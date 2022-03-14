import React from "react";
import { MotionDiv } from "../MotionDiv";

export function CurrMatchWinner({ klass, winner, team, score, overs }) {
  return (
    <MotionDiv
      className={`match-score ${klass} ${
        winner && team.short_name !== winner.short_name ? "loser" : ""
      }`}
    >
      <h3>{score ?? "0/0"}</h3>
      <small>Ovr: {overs ?? 0}/20</small>
    </MotionDiv>
  );
}
