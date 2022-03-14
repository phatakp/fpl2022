import React from "react";
import { Image } from "react-bootstrap";
import { MatchTeam, ResultBannerWinner } from "..";
import { teamImage } from "../../helpers";
import { MotionDiv } from "../MotionDiv";

export function ResultBannerTeam({
  klass,
  winner,
  team,
  score,
  overs,
  batFirst,
}) {
  return (
    <MotionDiv type={klass === "teamL" ? "slideLeft" : "slideRight"}>
      <div className={`result__team ${klass}`}>
        <div className="result__teamlogo">
          <Image src={teamImage(team.short_name)} />
          <MatchTeam team={team} />
        </div>
        <ResultBannerWinner
          klass={klass}
          team={team}
          winner={winner}
          score={score}
          overs={overs}
        />
      </div>
    </MotionDiv>
  );
}
