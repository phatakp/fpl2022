import { useEffect, useState } from "react";
import { Loader, MatchListRow } from "..";
import { fetchResults } from "../../api";
import { getTeamMatches } from "../../helpers";
import { useAPIData } from "../../hooks";

export function MatchList({ fixturePage, filterValue }) {
  const { data: matches, isLoading } = useAPIData(fetchResults);
  const [loading, setLoading] = useState(true);
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    const teamMatches = getTeamMatches(matches, filterValue);
    const filtered = teamMatches
      .filter((match) =>
        fixturePage
          ? match.status === "scheduled"
          : match.status !== "scheduled"
      )
      .sort((a, b) =>
        fixturePage ? a.match.num > b.match.num : b.match.num > a.match.num
      );
    setFilteredMatches(filtered);
    setLoading(false);
  }, [matches, fixturePage, filterValue]);

  if (loading || isLoading) return <Loader />;

  return (
    <div className="matches__list">
      {filteredMatches &&
        filteredMatches.map((match) => (
          <MatchListRow key={match.id} match={match} />
        ))}

      {filteredMatches.length === 0 && (
        <div className="match">No Matches to List</div>
      )}
    </div>
  );
}
