function key<const T extends string[]>(...args: T) {
  return args;
}

export const queryKeys = {
  users: {
    me: key("users", "@me"),
    all: key("users"),
    one: (id: string) => key("users", id),
  },
};
