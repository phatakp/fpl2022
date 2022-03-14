import { Button, Container, Image } from "react-bootstrap";
import { FaHatCowboy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchTeams } from "../api";
import { Loader, MotionDiv } from "../components";
import { teamImage } from "../helpers";
import { useAPIData, useAuth } from "../hooks";

export function Home() {
  const { id } = useAuth();
  const { isLoading, data: teams } = useAPIData(fetchTeams);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(id ? "/dashboard" : "/login");
  };

  if (isLoading) return <Loader />;

  if (teams.length <= 0) return null;

  return (
    <Container className="homepage" fluid>
      <MotionDiv type="slideLeft" className="text">
        <h1 className="shiz-font">
          Fantasy
          <br />
          Prediction
          <br />
          League
          <br />
          3.0
        </h1>

        <h5>
          Take out your Predictor's <FaHatCowboy /> hat and win big
        </h5>
        <Button variant="warning" onClick={handleClick}>
          Start Now
        </Button>
      </MotionDiv>
      <div className="images">
        <Image
          src={`${process.env.REACT_APP_STATIC_URL}/ipl-trophy.png`}
          className="trophy-img"
          fluid
        />
        <div className="team-img">
          {teams &&
            teams.map((team) => (
              <Image key={team.short_name} src={teamImage(team.short_name)} />
            ))}
        </div>
      </div>
    </Container>
  );
}
