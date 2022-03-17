import { useCallback, useContext, useMemo } from "react";
import { fetchToken, fetchUser, tokenLogout } from "../api";
import * as actions from "../store/actionTypes";
import { AuthContext } from "../store/context/authContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth hook should be used within AuthContextProvider");
  }

  // @ts-ignore
  const { state, dispatch, getToken } = context;

  const login = useCallback(
    async (email, password) => {
      try {
        const resp = await fetchToken(email, password);
        if (resp.status === 200) {
          dispatch({ type: actions.AUTHENTICATED, payload: resp.data });
          const res = await fetchUser(resp.data.access);
          if (res.status === 200) {
            dispatch({ type: actions.USER_LOADED, payload: res.data });
            return res;
          } else {
            return res;
          }
        } else {
          return resp;
        }
      } catch (error) {
        return error.response;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const resp = await tokenLogout();
    dispatch({ type: actions.NOT_AUTHENTICATED });
    return resp;
  }, [dispatch]);

  const { id, name, email } = state;
  const value = useMemo(
    () => ({ id, name, email, state, dispatch, login, logout, getToken }),
    [id, name, email, state, dispatch, login, logout, getToken]
  );
  return value;
}
