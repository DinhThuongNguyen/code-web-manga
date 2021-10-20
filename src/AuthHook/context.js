import { createContext } from "react";

export const AuthContext = createContext({
  isLogin: false,
  role: null,
  name: null,
  token: null,
  checkedBackground: false,
  login: () => {},
  logout: () => {},
  changeBackground: () => {}
})