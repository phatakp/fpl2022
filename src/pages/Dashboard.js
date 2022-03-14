import { Container } from "react-bootstrap";
import { fetchResults } from "../api";
import {
  CurrentMatch,
  Loader,
  PlayerStandings,
  Profile,
  ResultsNFixtures,
  TeamStandings,
  UserPredictions,
} from "../components";
import { getCurrentMatch } from "../helpers";
import { useAPIData, useAuth } from "../hooks";

export function Dashboard() {
  const { state: user } = useAuth();
  const { data: matches, isLoading } = useAPIData(fetchResults);

  if (isLoading) return <Loader />;

  if (!user.id) return null;

  const match = getCurrentMatch(matches);
  if (!match) return null;

  return (
    <Container
      className="dashboard"
      fluid
      style={{
        background: `url(${process.env.REACT_APP_STATIC_URL}/scheduleBg.jpg) no-repeat center center/cover`,
      }}
    >
      <TeamStandings />
      <CurrentMatch match={match} />
      <Profile currUser={user} />
      <PlayerStandings />
      <UserPredictions currUser={user} />
      <ResultsNFixtures matches={matches} currMatch={match} />
    </Container>
  );
}
