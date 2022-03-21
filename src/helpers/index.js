export const dashMatchDate = (date) => {
  const jdate = new Date(date);
  return jdate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const tableDttime = (date) => {
  const jdate = new Date(date);
  const date_str = jdate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    date_str +
    "," +
    ("0" + jdate.getHours()).slice(-2) +
    ":" +
    ("0" + jdate.getMinutes()).slice(-2)
  );
};

export const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formattedTime = (date) => {
  const jdate = new Date(date);
  return (
    ("0" + jdate.getHours()).slice(-2) +
    ":" +
    ("0" + jdate.getMinutes()).slice(-2) +
    " IST"
  );
};

export function getIndiaTime(date) {
  return new Date(
    (typeof date === "string" ? new Date(date) : new Date()).toLocaleString(
      "en-US",
      {
        timeZone: "Asia/Kolkata",
      }
    )
  );
}

export function betCutoffPassed(date) {
  const currTime = getIndiaTime();
  const matchCutoffTime = getIndiaTime(date);
  matchCutoffTime.setHours(matchCutoffTime.getHours() - 1);
  return currTime > matchCutoffTime;
}

export function matchCutoffPassed(date) {
  const currTime = getIndiaTime();
  const matchTime = getIndiaTime(date);
  return currTime > matchTime;
}

export function withinDoubleCutoff(date) {
  const currTime = getIndiaTime();
  const matchTime = getIndiaTime(date);
  const doubleCutoffTime = getIndiaTime(date);
  doubleCutoffTime.setHours(doubleCutoffTime.getHours() + 1);
  return matchTime < currTime && currTime < doubleCutoffTime;
}

export const axiosParms = (method, url, data = "", token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return {
    method,
    url,
    headers,
    data,
    withCredentials: true,
  };
};

export const getMatch = (matches, slug) => {
  return matches.filter((match) => match.match.slug === slug)[0];
};

export const getMatchByNum = (matches, num) => {
  return matches.filter((match) => match.match.num === num)[0];
};

export const getTeamMatches = (
  matches,
  teamShortName,
  count = null,
  form = false
) => {
  const result = matches.filter((match) =>
    teamShortName
      ? match.match.team1.short_name === teamShortName ||
        match.match.team2.short_name === teamShortName
      : match
  );
  if (form)
    return result.sort((a, b) => a.match.num - a.match.num).slice(0, count);
  if (count)
    return result.sort((a, b) => b.match.num - a.match.num).slice(0, count);
  return result;
};

export const getPlayerForm = (predictions, userid) => {
  let userPreds;
  if (predictions.length <= 0) {
    userPreds = [];
  } else {
    userPreds = predictions
      .filter(
        (item) =>
          item.user.id === userid &&
          item.match &&
          getIndiaTime(item.match.date) <= getIndiaTime()
      )
      .sort((a, b) => b.match.num - a.match.num)
      .slice(0, 3);
  }
  if (userPreds.length < 3) {
    const remain = 3 - userPreds.length;
    for (let i = 0; i < remain; i++) {
      userPreds = userPreds.concat([{ id: i + 341279, status: "" }]);
    }
  }

  return userPreds;
};

export const teamImage = (team) => {
  if (!team) return "";
  return `${process.env.REACT_APP_STATIC_URL}/team-logos-round-big/${team}.png`;
};

export const teamLogo = (team) => {
  if (!team) return "";
  return `${process.env.REACT_APP_STATIC_URL}/team-logos-396x396/${team}.png`;
};

export const teamBanner = (team) => {
  if (!team) return "";
  return `${process.env.REACT_APP_STATIC_URL}/team-banner/${team}.png`;
};

export const getRanks = (users) => {
  if (users.length <= 0) return 0;
  return users.map((user, index) => ({ user, rank: index + 1 }));
};

export const getRank = (users, id) => {
  if (users.length <= 0) return 0;
  const ranks = getRanks(users);
  return ranks.filter((item) => item.user.user.id === id)[0].rank;
};

export const getCurrentMatch = (matches) => {
  const result = matches
    .filter((match) => match.status === "scheduled")
    .sort((a, b) => b.match.num < a.match.num);

  if (result.length > 0) return result[0];

  return matches.sort((a, b) => b.match.num > a.match.num)[0];
};

export const firstName = (name) => {
  return name.split(" ")[0];
};

export const getPaginatedData = (data, currentPage, PER_PAGE) => {
  const startIndex = currentPage * PER_PAGE - PER_PAGE;
  const endIndex = startIndex + PER_PAGE;
  return data.slice(startIndex, endIndex);
};

export const getProfileClass = (val) => {
  if (isNaN(val)) return "";
  else if (val === 0) return "none";
  else if (val <= 25) return "less-25";
  else if (val <= 50) return "less-50";
  else if (val === 100) return "all";
  else return "less-75";
};

export const getPosition = (users, amount) => {
  if (users.length <= 0 || amount === 0) return "";

  const tot_positive = users
    .filter((item) => item.amount >= 0)
    .reduce((a, b) => +a + +b.amount, 0);

  return amount >= 0
    ? getProfileClass((amount / tot_positive) * 100)
    : getProfileClass(0);
};

export const valid_runs = (runs) => {
  if (runs.includes("/")) {
    const [run, wickets] = runs.split("/");
    return !(isNaN(run) || isNaN(wickets) || Number(wickets) > 10);
  }
  return false;
};

export const valid_balls = (balls) => {
  const [over, dec] = [Math.floor(balls), (balls * 10) % 10];
  return !(isNaN(over) || isNaN(dec) || Number(over) > 20 || Number(dec) > 5);
};

export const valid_format = (runs, balls) => {
  return valid_runs(runs) && valid_balls(balls);
};
