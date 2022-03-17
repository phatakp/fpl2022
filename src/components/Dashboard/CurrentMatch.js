import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DoubleForm, MotionDiv, PredictionForm } from "..";
import {
  formattedDate,
  formattedTime,
  matchCutoffPassed,
  withinDoubleCutoff,
} from "../../helpers";
import { useAuth, useModal } from "../../hooks";
import { CurrMatchTeam } from "./CurrMatchTeam";

export function CurrentMatch({ match }) {
  const navigate = useNavigate();
  const { state: user } = useAuth();
  const { team1, team2, type, num, venue, date, slug, double } = match.match;
  const { winner, win_margin, win_type } = match;
  const { team1_score, team2_score, team1_overs, team2_overs } = match.match;

  const { setShow, modal } = useModal(
    <PredictionForm match={match} />,
    "Match Prediction"
  );

  const { setShow: setDoubleShow, modal: doubleModal } = useModal(
    <DoubleForm match={match} />,
    "Play Double"
  );

  if (!match) return null;

  return (
    <Card
      className="curr-match"
      style={{
        background: `url(${process.env.REACT_APP_STATIC_URL}/result.jpg) no-repeat center center/cover`,
      }}
    >
      {modal}
      {doubleModal}
      <MotionDiv className="match-venue">
        <span className="match-num">
          {type === "league"
            ? "Match " + num + ", " + venue
            : type + ", " + venue}
        </span>
        <br />
        <span className="match-date">
          {formattedDate(date) + " " + formattedTime(date)}
        </span>
        {double && <div className="double">Double Card Played</div>}
        <hr />
      </MotionDiv>
      <h5 className="match-status">
        {winner
          ? winner.long_name + " won by " + win_margin + " " + win_type
          : matchCutoffPassed(date)
          ? "Match In Progress"
          : "Match Yet to Begin"}
      </h5>
      <CurrMatchTeam
        klass="teamL"
        team={team1}
        winner={winner}
        score={team1_score}
        overs={team1_overs}
      />

      <h3 className="vs">VS</h3>

      <CurrMatchTeam
        klass="teamR"
        team={team2}
        winner={winner}
        score={team2_score}
        overs={team2_overs}
      />
      <div className="match-btns">
        <Button
          className="match-btn"
          variant="warning"
          onClick={() => navigate(`/stats/${slug}`)}
        >
          Match Detail
        </Button>
        {!matchCutoffPassed(date) && (
          <Button
            className="match-btn"
            variant="warning"
            onClick={() => setShow(true)}
          >
            Predict Now
          </Button>
        )}
        {withinDoubleCutoff(date) && user.doubles > 0 && !double && (
          <Button
            className="match-btn"
            variant="warning"
            onClick={() => setDoubleShow(true)}
          >
            Play Double
          </Button>
        )}
      </div>
    </Card>
  );
}
