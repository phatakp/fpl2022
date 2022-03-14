import { Button } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { Loader } from "..";
import { fetchTeams } from "../../api";
import { useAPIData } from "../../hooks";

export function TeamFilter({ filterValue, setFilterValue }) {
  const { data: teams, isLoading } = useAPIData(fetchTeams);

  if (isLoading) return <Loader />;
  if (teams.length <= 0) return null;

  return (
    <div className="team-filter-options">
      {teams.map((team) => (
        <Button
          key={team.short_name}
          className={team.short_name}
          onClick={() => setFilterValue(team.short_name)}
        >
          {team.short_name} &nbsp;
          {filterValue === team.short_name && <FaCheck />}
        </Button>
      ))}

      <Button
        className="all"
        variant="success"
        onClick={() => setFilterValue("")}
      >
        All Teams &nbsp;
        {filterValue === "" && <FaCheck />}
      </Button>
    </div>
  );
}
