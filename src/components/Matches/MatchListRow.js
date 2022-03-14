import React from "react";
import {
  MatchListRowResult,
  MatchListRowTeam,
  MatchListRowVenue,
  MotionDiv,
  PredictionForm,
} from "..";
import { useModal } from "../../hooks";

export function MatchListRow({ match }) {
  const { team1, team2, team1_overs, team1_score, team2_overs, team2_score } =
    match.match;

  const { setShow, modal } = useModal(
    <PredictionForm match={match} />,
    "Match Prediction"
  );

  return (
    <MotionDiv className="match">
      <div className="match__prediction">{modal}</div>
      <div className="match__teams">
        <MatchListRowTeam
          team={team1}
          overs={team1_overs}
          score={team1_score}
          klass="team1"
        />

        <h4 className="versus">VS</h4>

        <MatchListRowTeam
          team={team2}
          overs={team2_overs}
          score={team2_score}
          klass="team2"
        />
      </div>

      <MatchListRowResult match={match} setShow={setShow} />
      <MatchListRowVenue match={match} />
    </MotionDiv>
  );
}
