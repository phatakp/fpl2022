import { Card, Image, Table } from "react-bootstrap";
import { FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Loader, MotionDiv } from "..";
import { fetchMatchPredictions } from "../../api";
import { betCutoffPassed, tableDttime, teamImage } from "../../helpers";
import { useAPIData, useAuth } from "../../hooks";

export function MatchPredictions({ match }) {
  const { num, date } = match.match;
  const { id } = useAuth();
  const { data: predictions, isLoading } = useAPIData(
    fetchMatchPredictions,
    true,
    { num }
  );

  if (isLoading) return <Loader />;
  if (!id)
    return (
      <MotionDiv type="appear" className="text-center">
        <p>You are not authorized</p>
        <Link to="/login">Login Here</Link>
      </MotionDiv>
    );
  let bets = [...predictions];
  if (!betCutoffPassed(date)) {
    bets = predictions.filter((item) => item.user.id === id);
  }

  return (
    <Card
      className="page-detail"
      style={{
        background: `url(${process.env.REACT_APP_STATIC_URL}/scheduleBg.jpg) no-repeat center center/cover`,
      }}
    >
      <Card.Body>
        <Card.Title>
          <h2 className="poppins">Match Predictions</h2>
        </Card.Title>

        <MotionDiv className="prediction-table" type="slideUp">
          <Table hover responsive className="predictions">
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th className="amount">Stake</th>
                <th className="amount">Earned</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {bets &&
                bets.map((bet) => (
                  <tr key={bet.id}>
                    <td className="name">{bet.user.name}</td>
                    <td className="team">
                      {bet?.team?.short_name ? (
                        <Image src={teamImage(bet?.team?.short_name)} fluid />
                      ) : (
                        <FaShieldAlt />
                      )}
                    </td>
                    <td className="amount">{bet.amount}</td>
                    <td
                      className={`amount ${
                        bet.result < 0 || bet.status === "defaulted"
                          ? "text-danger"
                          : bet.result > 0
                          ? "text-success"
                          : ""
                      }`}
                    >
                      {bet.status === "defaulted" &&
                        `-${bet.amount.toFixed(2)}`}
                      {bet.status !== "defaulted" &&
                        `${bet.result >= 0 ? "+" : ""}${bet.result.toFixed(2)}`}
                    </td>
                    <td className="status">{bet.status}</td>
                    <td>{tableDttime(bet.updated)}</td>
                  </tr>
                ))}
              {!predictions && (
                <tr>
                  <td colSpan={6}>No Predictions made yet</td>
                </tr>
              )}
            </tbody>
          </Table>
        </MotionDiv>
      </Card.Body>
    </Card>
  );
}
