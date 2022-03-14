import { createContext, useCallback, useEffect, useReducer } from "react";
import { authState } from "..";
import { fetchNewToken, fetchUser } from "../../api";
import * as actions from "../actionTypes";
import AuthReducer from "../reducers/authReducer";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, authState);
  const { accessToken, accessTokenExpiry, name } = state;

  const refreshToken = useCallback(async () => {
    const resp = await fetchNewToken();
    if (resp.status === 200) {
      // @ts-ignore
      dispatch({ type: actions.AUTHENTICATED, payload: resp.data });

      if (!name) {
        // @ts-ignore
        await initUser(resp.data.access);
      }
      return resp.data.access;
    } else {
      // @ts-ignore
      dispatch({ type: actions.NOT_AUTHENTICATED });
      return Promise.reject();
    }
  }, [name]);

  const initAuth = useCallback(async () => {
    if (!accessTokenIsValid(accessToken, accessTokenExpiry)) {
      await refreshToken();
    }
  }, [accessToken, accessTokenExpiry, refreshToken]);

  useEffect(() => {
    let starting = true;
    if (starting) {
      initAuth();
    }
    return () => {
      starting = false;
    };
  });

  const initUser = async (token) => {
    const resp = await fetchUser(token);
    if (resp.status === 200) {
      // @ts-ignore
      dispatch({ type: actions.USER_LOADED, payload: resp.data });
    }
  };

  const getToken = useCallback(async () => {
    // Returns an access token if there's one or refetches a new one
    if (accessTokenIsValid(accessToken, accessTokenExpiry)) {
      return Promise.resolve(accessToken);
    } else {
      const newToken = await refreshToken();
      return newToken;
    }
  }, [accessToken, accessTokenExpiry]);

  return (
    <AuthContext.Provider value={{ state, dispatch, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

const accessTokenIsValid = (accessToken, accessTokenExpiry) => {
  if (accessToken === "") {
    return false;
  }
  const expiry = new Date(accessTokenExpiry);
  return expiry.getTime() > Date.now();
};
