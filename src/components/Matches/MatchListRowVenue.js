import { formattedDate, formattedTime } from "../../helpers";

export function MatchListRowVenue({ match }) {
  const { date, type, num, venue } = match.match;
  return (
    <div className="match__venue">
      <div className="match__date">{formattedDate(date)}</div>
      <div className="match__num">
        <span>{match.match.type === "league" ? "Match " + num : type}</span>
        <small>{formattedTime(date)}</small>
      </div>
      <div className="venue">{venue}</div>
    </div>
  );
}
