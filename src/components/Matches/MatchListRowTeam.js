import { Image } from "react-bootstrap";
import { teamImage } from "../../helpers";
import { MatchTeam } from "./MatchTeam";

export function MatchListRowTeam({ team, score, overs, klass }) {
  return (
    <div className={`match__team ${klass}`}>
      <Image src={teamImage(team.short_name)} />
      <div className="match__team_info">
        <MatchTeam team={team} />
        <div className="score">
          <h4>{score}</h4>
          &nbsp;
          {overs && <small>({overs} OV)</small>}
        </div>
      </div>
    </div>
  );
}
