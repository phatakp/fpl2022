import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MatchTeam } from "..";
import { matchCutoffPassed } from "../../helpers";
import { useAuth } from "../../hooks";

export function MatchListRowResult({ match, setShow }) {
  const { email } = useAuth();
  const navigate = useNavigate();
  const { winner, win_margin, win_type, status } = match;
  const { slug, date } = match.match;

  return (
    <div className={`match__result ${winner ? "winner" : ""}`}>
      {winner ? (
        win_type === "super" ? (
          <div className="result">
            <MatchTeam team={winner} />
            &nbsp;won by&nbsp;Super Over
          </div>
        ) : (
          <div className="result">
            <MatchTeam team={winner} />
            &nbsp;won by&nbsp;{win_margin}&nbsp;{win_type}
          </div>
        )
      ) : (
        status !== "scheduled" && <div className="result">Match Abandoned</div>
      )}
      {!matchCutoffPassed(date) && (
        <Button
          variant="dark"
          onClick={() => {
            if (!email) navigate("/login");
            else setShow(true);
          }}
        >
          Predict Now
        </Button>
      )}
      <Button
        variant="danger"
        onClick={() => {
          navigate(`/stats/${slug}`);
        }}
      >
        Match Center
      </Button>
    </div>
  );
}
