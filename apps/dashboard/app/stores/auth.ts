import type { PublicRuntimeConfig } from "nuxt/schema";
import { queryKeys } from "~/api/queryKeys";
import type { ExpandedUserResponse } from "~/api/users";
import { login as loginRequest, register as registerRequest, type LoginRequest, type RegisterRequest } from "~/api/auth";

interface AuthState {
  user: ExpandedUserResponse | null;
  token: string | null;
  selectedOrgId: string | null;
}

type CookiesStorageOptions = PublicRuntimeConfig["piniaPluginPersistedstate"]["cookieOptions"];

function getNewSelectedOrgId(user: ExpandedUserResponse, oldOrgId: string | null): string | null {
  if (oldOrgId) {
    const oldSelectedOrg = user.orgMembers.find(v => v.org.id === oldOrgId);
    if (oldSelectedOrg)
      return oldSelectedOrg.org.id;
  }
  return user.orgMembers[0]?.org.id ?? null;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    const initialState: AuthState = {
      user: null,
      token: null,
      selectedOrgId: null,
    };

    const state = reactive<AuthState>(structuredClone(initialState));

    useQuerySubscribe<ExpandedUserResponse>(queryKeys.users.me, (user) => {
      state.user = user ?? null;
      if (user) state.selectedOrgId = getNewSelectedOrgId(user, state.selectedOrgId);
    });

    async function fetchUser() {
      if (!state.token) return;
      const user = await getQueryClient().fetchQuery({
        queryKey: queryKeys.users.me,
        queryFn: () => httpRequest<ExpandedUserResponse>("get", "/api/v1/users/@me", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }),
      });

      state.user = user;
      state.selectedOrgId = getNewSelectedOrgId(user, state.selectedOrgId);
      return user;
    }

    const isLoggedIn = computed(() => state.token != null && state.user != null);
    const org = computed(() => {
      if (!isLoggedIn.value) return null;
      if (!state.user) return null;
      if (!state.selectedOrgId) return null;
      return state.user.orgMembers.find(v => v.org.id === state.selectedOrgId)?.org ?? null;
    });

    async function login(request: LoginRequest) {
      const loginResponse = await loginRequest(request);
      state.token = loginResponse.token.token;
      await fetchUser();
    }

    async function register(request: RegisterRequest) {
      const loginResponse = await registerRequest(request);
      state.token = loginResponse.token.token;
      await fetchUser();
    }

    async function logout() {
      if (!state.token) return;

      const { $ofetch } = useNuxtApp();

      try {
        await $ofetch("/api/auth/logout", {
          method: "post",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
      } catch {
        // We don't care if the logout fails, we just want to clear the token
        // and redirect the user to the login page
      }

      resetAuth();
      await navigateTo("/login");
    }

    function resetAuth() {
      Object.assign(state, initialState);
      getQueryClient().removeQueries({
        queryKey: queryKeys.users.me,
      });
    }

    return {
      ...toRefs(state),
      isLoggedIn,
      org,
      login,
      logout,
      register,
      fetchUser,
      resetAuth,
    };
  },
  {
    persist: {
      key: "statulo-session",
      pick: ["token", "selectedOrgId"],
      storage: {
        getItem(key) {
          return piniaPluginPersistedstate.cookies().getItem(key);
        },
        setItem(key, valueJson) {
          const cookieOptions: CookiesStorageOptions = {
            // Here if we wish to set dynamic cookie options in the future
            // e.g. different expiration times for remember me vs non-remember me
          };

          piniaPluginPersistedstate
            .cookies(cookieOptions)
            .setItem(key, valueJson);
        },
      },
    },
  },
);
