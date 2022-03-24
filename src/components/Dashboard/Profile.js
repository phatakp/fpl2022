import { Card, Image } from "react-bootstrap";
import { Loader } from "..";
import { fetchUsers } from "../../api";
import {
  getPosition,
  getProfileClass,
  getRank,
  teamBanner,
} from "../../helpers";
import { useAPIData } from "../../hooks";
import { MotionDiv } from "../MotionDiv";

export function Profile({ currUser }) {
  const { data: users, isLoading } = useAPIData(fetchUsers);
  if (isLoading) return <Loader />;
  const { id, name, won, lost, amount, doubles, ipl_winner: winner } = currUser;
  const winpct = (won / (won + lost)) * 100 || 0;
  const rank = getRank(users, id);

  return (
    <Card className="profile">
      <Card.Img variant="top" src={teamBanner(winner.short_name)} />
      <div className="rank">
        <span>Rank</span>
        <h1 className="display-1">#{rank}</h1>
      </div>
      <Card.Body>
        <MotionDiv>
          <Image
            className="profileImg"
            src={`${process.env.REACT_APP_STATIC_URL}/profile.png`}
            fluid
          />
        </MotionDiv>
        <Card.Title>
          <MotionDiv type="slideUp">
            <span>
              {name}
              <br />
            </span>
            <small>
              Doubles Left: <strong>{doubles}</strong>
            </small>
          </MotionDiv>
        </Card.Title>

        <MotionDiv className="stats">
          <div className={`circle ${getPosition(users, amount)}`}>
            <h5
              className={`amount ${
                amount < 0 ? "text-danger" : "text-success"
              }`}
            >
              {amount.toFixed(1)}
            </h5>
            <div className="label">Balance</div>
          </div>
          <div className={`circle ${getProfileClass(winpct)}`}>
            <h4
              className={`amount ${
                winpct < 50 ? "text-danger" : "text-success"
              }`}
            >
              {winpct.toFixed(0)}%
            </h4>
            <div className="label">Predictions</div>
          </div>
        </MotionDiv>
      </Card.Body>
    </Card>
  );
}
