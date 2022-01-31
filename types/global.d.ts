declare global {
  namespace NodeJS {
    interface Global {
      refreshToken: string;
    }
  }
}

export {};


