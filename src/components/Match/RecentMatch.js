import { MatchTeam } from "..";
import { formattedDate } from "../../helpers";
import RecentTeam from "./RecentTeam";

export default function RecentMatch({ match }) {
  if (!match) return null;

  return (
    <div className="recent-match">
      <small className="recent-match-date">{formattedDate(match.date)}</small>

      <small className="recent-match-result">
        {match.winner ? (
          <div className="win">
            <MatchTeam team={match.winner} />
            <span>&nbsp; won by &nbsp;</span>
            {match.win_type !== "super" && (
              <>
                <span>{match.win_margin}&nbsp;</span>
                <span>{match.win_type}</span>
              </>
            )}
            {match.win_type === "super" && <span>Super Over</span>}
          </div>
        ) : (
          <div className="draw">No Result</div>
        )}
      </small>

      <div className="recent-teams">
        <RecentTeam klass="team1" winner={match.winner} team={match.team1} />

        <RecentTeam klass="team2" winner={match.winner} team={match.team2} />
      </div>
    </div>
  );
}
