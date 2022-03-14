import { Card } from "react-bootstrap";
import { Loader } from "..";
import { fetchStats } from "../../api";
import { useAPIData } from "../../hooks";
import FormGuide from "./FormGuide";
import HeadToHead from "./HeadToHead";
import RecentMeetings from "./RecentMeetings";

export function MatchStats({ match }) {
  const { team1, team2 } = match.match;
  const { data: stats, isLoading } = useAPIData(fetchStats, false, {
    team1: team1.short_name,
    team2: team2.short_name,
  });

  if (isLoading) return <Loader />;

  if (stats.length <= 0) return null;
  return (
    <Card
      className="page-detail"
      style={{
        background: `url(${process.env.REACT_APP_STATIC_URL}/scheduleBg.jpg) no-repeat center center/cover`,
      }}
    >
      <Card.Body>
        <Card.Title>
          <h2 className="poppins">Match Stats</h2>
        </Card.Title>
        {stats && <HeadToHead stats={stats} team1={team1} team2={team2} />}

        <RecentMeetings team1={team1.short_name} team2={team2.short_name} />

        <FormGuide team1={team1} team2={team2} match={match} />
      </Card.Body>
    </Card>
  );
}
