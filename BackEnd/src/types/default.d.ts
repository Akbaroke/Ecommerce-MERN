export {};

export enum STATUS {
  active,
  pending,
}

export enum ROLE {
  admin,
  user,
}

export enum TYPE {
  register,
  forgotPassword,
}

export enum RSTORE {
  owner,
  employee,
}

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      PORT: number;
      DB_NAME: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DRIVER: string;
      ACCESSTOKENSECRET: string;
      REFRESHTOKENSECRET: string;
      SALT: number;
      SALTHASHIDS: string;
      USER: string;
      PASS: string;
      CLOUD_NAME: string;
      CLOUD_API_KEY: string;
      CLOUD_API_SECRET: string;
    }
  }
  namespace Express {
    export interface Request {
      USER: Record<string | any>;
    }
  }
}
