import React from "react";
import { Image } from "react-bootstrap";
import { MatchTeam, MotionDiv } from "..";
import { teamLogo } from "../../helpers";

export default function RecentTeam({ team, winner, klass }) {
  const winClass =
    winner && winner.short_name === team.short_name
      ? "result winner"
      : winner
      ? "result loser"
      : "result";

  const winData =
    winner && winner.short_name === team.short_name ? "W" : winner ? "L" : "D";

  const type = klass === "team1" ? "slideLeft" : "slideRight";

  return (
    <MotionDiv type={type} className={`recent-team ${klass}`}>
      <MatchTeam team={team} />
      <Image src={teamLogo(team.short_name)} />
      <span className={winClass}>{winData}</span>
    </MotionDiv>
  );
}
