import { Image } from "react-bootstrap";
import { MatchTeam } from "..";
import { teamImage } from "../../helpers";

export default function H2HTitle({ klass, team }) {
  return (
    <div className={klass === "teamL" ? "h2h-left" : "h2h-right"}>
      <div className={`h2h-team ${klass}`}>
        <MatchTeam team={team} />
        <Image src={teamImage(team.short_name)} fluid />
      </div>
    </div>
  );
}
