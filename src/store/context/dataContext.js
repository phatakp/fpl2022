import { createContext, useCallback, useEffect, useState } from "react";
import { fetchResults, fetchTeams } from "../../api";

export const DataContext = createContext({});

export const DataContextProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  const initData = useCallback(async () => {
    const teamResp = await fetchTeams();
    const resResp = await fetchResults();
    if (teamResp.status === 200) setTeams(() => teamResp.data);
    if (resResp.status === 200) setMatches(() => resResp.data);
  }, []);

  useEffect(() => {
    let starting = true;
    if (starting) {
      initData();
    }
    return () => {
      starting = false;
    };
  }, [initData]);

  return (
    <DataContext.Provider value={{ teams, matches }}>
      {children}
    </DataContext.Provider>
  );
};
