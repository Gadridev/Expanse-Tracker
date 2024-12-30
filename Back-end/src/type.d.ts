declare global {
    namespace NodeJS {
      interface ProcessEnv {
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        JWT_COOKIE_EXPIRES_IN: number;
      }
    }
  }
  
  export {};
  