import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isVerified: boolean;
      accountType: string;
    };
  }
}
