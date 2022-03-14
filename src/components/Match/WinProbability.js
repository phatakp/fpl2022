import { Image } from "react-bootstrap";
import { Loader, MotionDiv } from "..";
import { fetchStats } from "../../api";
import { teamLogo } from "../../helpers";
import { useAPIData } from "../../hooks";

export function WinProbability({ match }) {
  const { team1, team2 } = match.match;
  const { data: stats, isLoading } = useAPIData(fetchStats, false, {
    team1: team1.short_name,
    team2: team2.short_name,
  });

  if (isLoading) return <Loader />;
  const team1Stats = stats[team1.short_name];
  const team2Stats = stats[team2.short_name];

  if (stats.length <= 0 || !(team1Stats?.winprob && team2Stats?.winprob))
    return null;

  return (
    <MotionDiv type="slideUp" className="probability">
      <h2>Win Probability</h2>
      <div className="prob-content">
        <Image src={teamLogo(team1.short_name)} />
        <div className="prob-container">
          <div
            className={`prob-left ${team1.short_name}`}
            style={{ width: `${team1Stats.winprob}%` }}
          >
            {team1Stats.winprob}%
          </div>
          <div
            className={`prob-right ${team2.short_name}`}
            style={{ width: `${team2Stats.winprob}%` }}
          >
            {team2Stats.winprob}%
          </div>
        </div>
        <Image src={teamLogo(team2.short_name)} />
      </div>
    </MotionDiv>
  );
}
