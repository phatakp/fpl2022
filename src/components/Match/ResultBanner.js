import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  DoubleForm,
  Loader,
  MatchScoreForm,
  MatchWinnerForm,
  PredictionForm,
} from "..";
import { fetchResults } from "../../api";
import {
  formattedDate,
  formattedTime,
  getMatchByNum,
  matchCutoffPassed,
  withinDoubleCutoff,
} from "../../helpers";
import { useAPIData, useAuth, useModal } from "../../hooks";
import { MotionDiv } from "../MotionDiv";
import { ResultBannerTeam } from "./ResultBannerTeam";

export function ResultBanner({ match, statsPage }) {
  const navigate = useNavigate();
  const { data: matches, isLoading } = useAPIData(fetchResults);
  const { state: user } = useAuth();

  const { setShow, modal } = useModal(
    <PredictionForm match={match} />,
    "Match Prediction"
  );

  const { setShow: setDoubleShow, modal: doubleModal } = useModal(
    <DoubleForm match={match} />,
    "Play Double"
  );

  const { setShow: setScoreShow, modal: scoreModal } = useModal(
    <MatchScoreForm match={match} />,
    "Update Match Score"
  );

  const { setShow: setWinnerShow, modal: winnerModal } = useModal(
    <MatchWinnerForm match={match} />,
    "Update Match Winner"
  );

  if (!match) return null;
  if (isLoading) return <Loader />;

  const { team1, team2, type, num, venue, date, bat_first, double } =
    match.match;
  const { winner, win_margin, win_type, status } = match;
  const { team1_score, team2_score, team1_overs, team2_overs } = match.match;

  const handleNextMatch = (num) => {
    const newMatch = getMatchByNum(matches, num + 1);
    navigate(`/${statsPage ? "stats" : "predictions"}/${newMatch.match.slug}`);
  };

  const handlePrevMatch = (num) => {
    const newMatch = getMatchByNum(matches, num - 1);
    navigate(`/${statsPage ? "stats" : "predictions"}/${newMatch.match.slug}`);
  };

  return (
    <MotionDiv type="appear">
      <Container
        className="result-banner"
        fluid
        style={{
          background: `url(${process.env.REACT_APP_STATIC_URL}/result.jpg) no-repeat center center/cover`,
        }}
      >
        {modal}
        {scoreModal}
        {winnerModal}
        {doubleModal}
        <div className="result__venue">
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
        </div>
        <h5 className="result__status">
          {winner
            ? win_type === "super"
              ? winner.long_name + " won by Super Over"
              : winner.long_name + " won by " + win_margin + " " + win_type
            : status === "scheduled"
            ? matchCutoffPassed(date)
              ? "Match In Progress"
              : "Match Yet to Begin"
            : "Match Abandoned"}
        </h5>
        <ResultBannerTeam
          klass="teamL"
          team={team1}
          winner={winner}
          score={team1_score}
          overs={team1_overs}
          batFirst={bat_first}
        />

        <h3 className="vs">VS</h3>

        <ResultBannerTeam
          klass="teamR"
          team={team2}
          winner={winner}
          score={team2_score}
          overs={team2_overs}
          batFirst={bat_first}
        />
      </Container>
      <div className="match-btns">
        {num > 1 && (
          <Button
            className="match-btn"
            variant="dark"
            onClick={() => handlePrevMatch(num)}
          >
            Prev Match
          </Button>
        )}

        {!matchCutoffPassed(date) && (
          <Button
            className="match-btn"
            variant="warning"
            onClick={() => setShow(true)}
          >
            Predict
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

        {user.ipl_admin && status === "scheduled" && matchCutoffPassed(date) && (
          <Button
            className="match-btn"
            variant="warning"
            onClick={() => setScoreShow(true)}
          >
            Score
          </Button>
        )}

        {user.ipl_admin && status === "scheduled" && matchCutoffPassed(date) && (
          <Button
            className="match-btn"
            variant="warning"
            onClick={() => setWinnerShow(true)}
          >
            Winner
          </Button>
        )}

        {type !== "final" && (
          <Button
            className="match-btn"
            variant="dark"
            onClick={() => handleNextMatch(num)}
          >
            Next Match
          </Button>
        )}
      </div>
    </MotionDiv>
  );
}
