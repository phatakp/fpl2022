export const authState = {
  isAuthenticated: false,
  accessToken: null,
  accessTokenExpiry: 0,
  id: "",
  name: "",
  email: "",
  played: 0,
  won: 0,
  lost: 0,
  amount: 0.0,
  ipl_admin: false,
  ipl_winner: null,
};

export const initDataState = {
  teams: [],
  matches: [],
};
