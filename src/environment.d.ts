type nodeEnv = 'production' | '';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: nodeEnv;
      SESSION_SECRET: string;
      MONGODB_URI: string;
      MONGODB_URI_LOCAL: string;
      PORT: string;
      ACCESS_TOKEN_SECRET: string;
    }
  }
  /**
 * @internal
 * Remove it when connect-mongo is updated
 * https://stackoverflow.com/questions/64845125/namespace-express-has-no-exported-member-sessiondata
 */
  namespace Express {
    interface SessionData {
      cookie: any
    }
  }
}

export {};
