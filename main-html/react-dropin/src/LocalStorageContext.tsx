import React, { useState, createContext, useContext, ReactNode } from "react";
import Cookies from "js-cookie"


const cookieName = "BCA-universal-cookie";
const defaultCookieData = ""

export const localStorageDatas = {
  raw: Cookies.get(cookieName) || String(defaultCookieData)
};
type InitialLocalStorageState = {
  localStorageData: string;
  setLocalStorageData: any
};
const initialState: InitialLocalStorageState = {
  localStorageData: localStorageDatas.raw,
  setLocalStorageData: () => { }
};

const localStorageContext = createContext(initialState);

interface Props {
    children?: ReactNode
    // any props that come into the component
}

export const LocalStorageProvider = ({ children }: Props) => {
  const [ localStorageData, setLocalStorageData ] = useState(localStorageDatas.raw);
  return (
    <localStorageContext.Provider value={{ localStorageData, setLocalStorageData }}>
      {children}
    </localStorageContext.Provider>
  );
};

const useLocalStorage = () => {
  const context = useContext(localStorageContext);

  if (context === undefined) {
    throw new Error("useLocalStorage must be used within a LocalStorageProvider");
  }
  return context;
};
export default useLocalStorage;
