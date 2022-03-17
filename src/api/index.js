import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const instance = (token = null) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return axios.create({
    // @ts-ignore
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers,
    withCredentials: true,
  });
};

export const register = (email, name, password, password2, winner) => {
  const data = JSON.stringify({ email, name, password, password2, winner });
  return instance().post("/register/", data);
};

export const tokenLogout = () => {
  return instance().post("/token/logout/");
};

export const fetchToken = (email, password) => {
  const data = JSON.stringify({ email, password });
  return instance().post("/token/", data);
};

export const fetchNewToken = () => {
  return instance().post("/token/refresh/");
};

export const fetchUsers = () => {
  return instance().get("/users/");
};

export const fetchUser = (token) => {
  return instance(token).get("/user/");
};

export const fetchTeams = () => {
  return instance().get("/teams/");
};

export const fetchStandings = () => {
  return instance().get("/teams/standings/");
};

export const fetchResults = () => {
  return instance().get("/matches/results/");
};

export const fetchStats = (params) => {
  const { team1, team2 } = params;
  return instance().get(`/matches/stats/${team1}/${team2}/`);
};

export const fetchRecent = (params) => {
  const { team1, team2 } = params;
  return instance().get(`/matches/history/?team1=${team1}&team2=${team2}`);
};

export const fetchAllPredictions = (token) => {
  return instance(token).get("/predictions/");
};

export const fetchMatchPredictions = (token, params) => {
  const { num } = params;

  if (!num) return null;
  return instance(token).get(`/predictions/?match=${num}`);
};

export const fetchUserPredictions = (token, params) => {
  const { id } = params;
  return instance(token).get(`/predictions/?user=${id}`);
};

export const fetchUserPredictionsforMatch = (token, params) => {
  const { id, num } = params;
  return instance(token).get(`/predictions/?user=${id}&match=${num}`);
};

export const addPrediction = (token, team_name, match_num, amount) => {
  const data = JSON.stringify({ team_name, match_num, amount });
  return instance(token).post("/predictions/", data);
};

export const updatePrediction = (
  token,
  team_name,
  match_num,
  amount,
  pred_id
) => {
  const data = JSON.stringify({ team_name, match_num, amount });
  return instance(token).put(`/predictions/${pred_id}/`, data);
};

export const doublePrediction = (token, pred_id) => {
  return instance(token).put(`/predictions/${pred_id}/double/`);
};

export const updateScore = (
  token,
  team1_score,
  team1_overs,
  team2_score,
  team2_overs,
  batFirst,
  num
) => {
  const data = JSON.stringify({
    team1_score,
    team1_overs,
    team2_score,
    team2_overs,
    batFirst,
  });
  return instance(token).put(`/matches/${num}/`, data);
};

export const updateWinner = (token, winner_name, stat, type, margin, num) => {
  const data = JSON.stringify({
    winner_name,
    stat,
    type,
    margin,
  });
  return instance(token).put(`/matches/results/${num}/`, data);
};
