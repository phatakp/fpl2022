import React from "react";
import { Image } from "react-bootstrap";
import { MotionDiv } from "..";
import { dashMatchDate, formattedTime, teamLogo } from "../../helpers";
import { useWindowDimensions } from "../../hooks";

export default function FormMatchItem({ dir, match, team }) {
  const { winner, status, win_margin, win_type } = match;
  const { date, team1, team2 } = match.match;
  const { width } = useWindowDimensions();

  const winClass =
    winner && winner.short_name === team.short_name
      ? "result winner"
      : winner
      ? "result loser"
      : "result";

  const winData =
    status === "scheduled"
      ? "-"
      : winner && winner.short_name === team.short_name
      ? "W"
      : winner
      ? "L"
      : "D";

  const resultData =
    status === "scheduled"
      ? `TBP on ${dashMatchDate(date)} ${
          width > 500 ? formattedTime(date) : ""
        }`
      : winner && winner.short_name === team.short_name
      ? win_type === "super"
        ? "Won by Super Over"
        : `Won by ${win_margin} ${win_type}`
      : winner
      ? win_type === "super"
        ? "Lost by Super Over"
        : `Lost by ${win_margin} ${win_type}`
      : "No Result";

  const type = dir === "left" ? "slideLeft" : "slideRight";

  return (
    <MotionDiv type={type} className="form-match">
      <div></div>
      <Image
        src={teamLogo(
          team1.short_name === team.short_name
            ? team2.short_name
            : team1.short_name
        )}
      />
      <span>vs</span>
      <span className={winClass}>{winData}</span>
      <small className="match-result">{resultData}</small>
    </MotionDiv>
  );
}
