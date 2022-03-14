import React from "react";

export function ResultBannerWinner({ klass, winner, team, score, overs }) {
  return (
    <div
      className={`result__score ${klass} ${
        winner && team.short_name !== winner.short_name ? "loser" : ""
      }`}
    >
      <h1>{score ?? "0/0"}</h1>
      <p>Overs: {overs ?? "0"}/20</p>
      <div>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
