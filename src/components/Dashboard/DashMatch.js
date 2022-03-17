import { Alert, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Loader, MatchTeam } from "..";
import { fetchUserPredictionsforMatch } from "../../api";
import {
  betCutoffPassed,
  dashMatchDate,
  formattedTime,
  teamLogo,
} from "../../helpers";
import { useAPIData, useAuth } from "../../hooks";
import { MotionDiv } from "../MotionDiv";

export function DashMatch({ match, currMatch }) {
  const navigate = useNavigate();
  const { type, team1, team2, num, date, venue, slug, double } = match.match;
  const { winner, win_margin, win_type, status } = match;
  const { id } = useAuth();

  const { data: userPredictions, isLoading } = useAPIData(
    fetchUserPredictionsforMatch,
    true,
    { id, num }
  );

  const [pred] = userPredictions;

  if (isLoading) return <Loader />;

  return (
    <MotionDiv>
      <Card
        className={`dash-match ${match.id === currMatch.id ? "current" : ""} ${
          winner
            ? winner.short_name
            : status === "abandoned"
            ? "dark"
            : "future"
        }`}
        onClick={() => navigate(`/stats/${slug}`)}
      >
        <Card.Body>
          <Card.Title>
            <strong>{type === "league" ? "Match " + num : type},&nbsp;</strong>
            <small>{venue}</small>
          </Card.Title>
          {double && <div className="double">Double</div>}
          {winner && win_type !== "super" && (
            <div className={`result ${winner.short_name}-color`}>
              <MatchTeam team={winner} />
              &nbsp;won by&nbsp;{win_margin}&nbsp;{win_type}
            </div>
          )}
          {winner && win_type === "super" && (
            <div className={`result ${winner.short_name}-color`}>
              <MatchTeam team={winner} />
              &nbsp;won by&nbsp;Super Over
            </div>
          )}
          {status === "abandoned" && (
            <div className="result">Match Abandoned</div>
          )}
          <div className="dash-match-detail">
            <Image src={teamLogo(team1.short_name)} />
            <div className="dash-match-date">
              <small>{dashMatchDate(date)}</small>
              <strong>{formattedTime(date)}</strong>
            </div>
            <Image src={teamLogo(team2.short_name)} />
          </div>

          {pred && status === "scheduled" && (
            <Alert variant="success" className="prediction">
              <span>Your Prediction:</span>
              <strong>&nbsp;{pred.team.short_name}</strong>
              <strong>&nbsp;for&nbsp;{pred.amount}</strong>
            </Alert>
          )}
          {pred && status === "abandoned" && (
            <Alert
              variant={
                pred.result < 0
                  ? "danger"
                  : pred.result === 0
                  ? "dark"
                  : "success"
              }
              className="prediction"
            >
              {pred.result === 0 && <span>Predictions discarded</span>}
              {pred.result !== 0 && (
                <>
                  <span>You {pred.status}</span>
                  <strong>&nbsp;{pred.result.toFixed(2)}</strong>
                </>
              )}
            </Alert>
          )}
          {pred && status === "completed" && (
            <Alert
              variant={pred.result < 0 ? "danger" : "success"}
              className="prediction"
            >
              <span>You {pred.status}</span>
              <strong>&nbsp;{pred.result.toFixed(2)}</strong>
            </Alert>
          )}
          {!pred && (
            <Alert variant="danger" className="prediction">
              <span>
                {betCutoffPassed(date)
                  ? "Cutoff Passed: Defaulted"
                  : "No Prediction made"}
              </span>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </MotionDiv>
  );
}
