import { Image } from "react-bootstrap";
import { MatchTeam } from "..";
import { teamLogo } from "../../helpers";

export default function FormGuideTitle({ klass, team }) {
  return (
    <div className={klass === "teamL" ? "form-left" : "form-right"}>
      <div className={`form-team ${klass}`}>
        <MatchTeam team={team} />
        <Image src={teamLogo(team.short_name)} fluid />
      </div>
    </div>
  );
}
