import { authState } from "..";
import * as actions from "../actionTypes";

function AuthReducer(state, action) {
  switch (action.type) {
    case actions.AUTHENTICATED:
      const accessToken = action.payload.access;
      const accessTokenExpiry = action.payload.access_expires * 1000;
      return {
        ...state,
        isAuthenticated: true,
        accessToken,
        accessTokenExpiry,
      };
    case actions.NOT_AUTHENTICATED:
      return { ...authState };
    case actions.USER_LOADED:
      const { id, name, email } = action.payload.user;
      const { played, won, lost, amount, ipl_admin, ipl_winner } =
        action.payload;

      return {
        ...state,
        id,
        name,
        email,
        played,
        won,
        lost,
        amount,
        ipl_admin,
        ipl_winner,
      };
    default:
      return state;
  }
}

export default AuthReducer;
