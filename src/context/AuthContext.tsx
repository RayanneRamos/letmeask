import firebase from "firebase/compat/app";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { useToast } from '../hooks/useToast';

type User = {
  id: string;
  name: string;
  avatar: string;
  email: string | null;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

function AuthContextProvider(props: AuthContextProviderProps) {
  const [ user, setUser ] = useState<User>();
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid, email } = user;

        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google Account');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email,
        });
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    if(result.user) {
      const { displayName, photoURL, uid, email } = result.user;

      if(!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      showToast('🎉', `Seja bem-vindo ${displayName}!`);

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
        email: email,
      });
    }
  }

  async function signInWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();

    const result = await auth.signInWithPopup(provider);
    console.log(result);

    if(result.user) {
      const { displayName, photoURL, uid, email } = result.user;

      if(!displayName || !photoURL) {
        throw new Error('Missing information from Github Account');
      }

      showToast('🎉', `Seja bem-vindo ${displayName}!`);

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
        email: email,
      });
    }
  }

  async function signOut() {
    await auth.signOut();

    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithGithub, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider };