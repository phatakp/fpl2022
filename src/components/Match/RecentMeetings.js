import { Container } from "react-bootstrap";
import { Loader } from "..";
import { fetchRecent } from "../../api";
import { useAPIData } from "../../hooks";
import RecentMatch from "./RecentMatch";

export default function RecentMeetings({ team1, team2 }) {
  const { isLoading, data } = useAPIData(fetchRecent, false, { team1, team2 });
  if (isLoading) return <Loader />;
  const recent = data.slice(0, 5);
  if (recent.length <= 0) return null;

  return (
    <Container fluid>
      <div className="stats-title">
        <h4 className="poppins">Recent Meetings</h4>
      </div>

      <div className="recent-section">
        {recent &&
          recent.map((match) => <RecentMatch key={match.id} match={match} />)}
      </div>
      <hr style={{ height: "5px", marginTop: "3rem" }} />
    </Container>
  );
}
