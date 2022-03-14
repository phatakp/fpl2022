import React from "react";
import { Image } from "react-bootstrap";
import { MatchTeam, MotionDiv } from "..";
import { teamImage } from "../../helpers";
import { CurrMatchWinner } from "./CurrMatchWinner";

export function CurrMatchTeam({ klass, winner, team, score, overs }) {
  return (
    <div className={`match-team ${klass}`}>
      <MotionDiv
        type={klass === "teamL" ? "slideLeft" : "slideRight"}
        className="match-teamlogo"
      >
        <Image src={teamImage(team.short_name)} />
        <MatchTeam team={team} />
      </MotionDiv>
      <CurrMatchWinner
        klass={klass}
        team={team}
        winner={winner}
        score={score}
        overs={overs}
      />
    </div>
  );
}
