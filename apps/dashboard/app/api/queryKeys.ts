function key<const T extends string[]>(...args: T) {
  return args;
}

export const queryKeys = {
  invites: {
    token: (token: string) => key("invites", token),
  },
  users: {
    me: key("users", "@me"),
    all: key("users"),
    one: (id: string) => key("users", id),
    invites: {
      me: key("users", "@me", "invites"),
      one: (id: string) => key("users", id, "invites"),
    },
  },
  monitors: {
    all: key("monitors"),
  },
};
