import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { Spin } from "antd";

export interface IUser {
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  uid: string;
}

const defaultValue: IUser = {
  displayName: "",
  photoURL: "",
  email: "",
  uid: "",
};

export const AuthContext = React.createContext<IUser>(defaultValue);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<IUser>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    const unsubcribed = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false);
        navigate("/");
      } else {
        setIsLoading(false);
        navigate("/login");
      }
    });
    return () => {
      unsubcribed();
    };
  }, [navigate]);
  return (
    <AuthContext.Provider value={user}>
      {isLoading ? <Spin></Spin> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
