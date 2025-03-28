import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      bio?: string | null;
      dateOfBirth?: string | null;
      gender?: string | null;
    };
  }
}
