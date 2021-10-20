import { useCallback, useEffect, useReducer, useState } from "react";

let logoutTimer;

const initialState = {
  name: null,
  role: null,
  _token: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      const { name, role, expriteDate, token } = action.payload;
      return {
        name,
        role,
        _token: token,
      };
    case "logout":
      return {
        name: null,
        role: null,
        _token: null,
      };
    default:
      throw new Error("co loi");
  }
}

export const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async (name, role, token) => {

    // const authExpirationDate =
    //   expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 5); // 5h

    await dispatch({
      type: "login",
      payload: {
        name,
        role,
        token,
      },
    });
   
    localStorage.setItem(
      "RFAC",
      JSON.stringify({
        name: name,
        role: role,
        web_auth: token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "logout" });
    localStorage.removeItem("RFAC");
  }, []);

  const [check, setCheck] = useState(false);
  const changeBackground = () => {
    setCheck(!check);
  }


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("RFAC"));
    if (
      storedData &&
      storedData.name
    ) {
      login(
        storedData.name,
        storedData.role,
        storedData.web_auth,
      );
    }
  }, [login]);

  return {
    name: state.name,
    role: state.role,
    login,
    logout,
    changeBackground,
    check,
    token: state._token,
  };
};
