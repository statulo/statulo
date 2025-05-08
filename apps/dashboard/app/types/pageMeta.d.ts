declare module "#app" {
  interface PageMeta {
    auth?: boolean | "guest";
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
