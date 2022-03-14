import { Loader } from "..";
import { fetchResults } from "../../api";
import { getTeamMatches } from "../../helpers";
import { useAPIData } from "../../hooks";
import FormMatchItem from "./FormMatchItem";

export default function FormGuideMatches({ klass, match, team }) {
  const { data: matches, isLoading } = useAPIData(fetchResults);

  if (isLoading) return <Loader />;

  const teamMatches = getTeamMatches(matches, team.short_name)
    .filter((item) => item.id !== match.id)
    .slice(0, 5);

  return (
    <div className={`form-guide-detail ${klass}`}>
      {teamMatches &&
        teamMatches.map((match) => (
          <FormMatchItem
            key={match.id}
            dir={klass === "teamL" ? "left" : "right"}
            match={match}
            team={team}
          />
        ))}
    </div>
  );
}
