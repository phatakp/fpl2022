import { Card, Image, Table } from "react-bootstrap";
import { Loader } from "..";
import { fetchStandings } from "../../api";
import { teamLogo } from "../../helpers";
import { useAPIData } from "../../hooks";
import { MotionDiv } from "../MotionDiv";

export function TeamStandings() {
  const { data: standings, isLoading } = useAPIData(fetchStandings);

  if (isLoading) return <Loader />;
  standings
    .sort((a, b) => (b._nrr > a._nrr ? 1 : -1))
    .sort((a, b) => b.points - a.points)
    .sort((a, b) => a.lost - b.lost);
  return (
    <Card className="dash-team-standings">
      <Card.Body>
        <Card.Title>Team Standings</Card.Title>
        <Table hover responsive className="standings">
          <thead>
            <tr>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>L</th>
              <th>Pts</th>
              <th className="nrr">NRR</th>
            </tr>
          </thead>
          <tbody>
            {standings &&
              standings.map((item) => (
                <tr key={item.id}>
                  <td className="team">
                    <MotionDiv>
                      <Image src={teamLogo(item.team)} />
                    </MotionDiv>
                  </td>
                  <td>
                    <MotionDiv>{item.played}</MotionDiv>
                  </td>
                  <td>
                    <MotionDiv>{item.won}</MotionDiv>
                  </td>
                  <td>
                    <MotionDiv>{item.lost}</MotionDiv>
                  </td>
                  <td>
                    <MotionDiv>{item.points}</MotionDiv>
                  </td>

                  <td
                    className={`nrr ${
                      item._nrr < 0
                        ? "text-danger"
                        : item._nrr > 0
                        ? "text-success"
                        : ""
                    }`}
                  >
                    <MotionDiv>
                      {item._nrr < 0 ? "" : "+"}
                      {item._nrr.toFixed(3)}
                    </MotionDiv>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
