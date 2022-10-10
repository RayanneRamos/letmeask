import { ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string | null;
}

export type UserAuth = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}

export type UserAuthProvider = {
  children: ReactNode;
}