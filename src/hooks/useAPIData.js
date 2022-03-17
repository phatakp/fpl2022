import { useEffect, useMemo, useState } from "react";
import { useAuth } from ".";

export function useAPIData(func, token = false, params = null) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  useEffect(() => {
    async function fetchData() {
      let resp;
      let access;
      if (token) access = await getToken();
      if (access && params) resp = await func(access, params);
      else if (access) resp = await func(access);
      else if (params) resp = await func(params);
      else resp = await func();

      if (resp?.status === 200) setData(resp.data);
      else setError(resp?.data);
    }
    fetchData();
    setIsLoading(false);
  }, [JSON.stringify(params)]);

  const value = useMemo(
    () => ({
      data,
      error,
      isLoading,
    }),
    [data, error, isLoading]
  );
  return value;
}
