import { Card, Image, Table } from "react-bootstrap";
import { Loader } from "..";
import { fetchResults, fetchStandings } from "../../api";
import { getTeamMatches, teamLogo } from "../../helpers";
import { useAPIData } from "../../hooks";
import { MotionDiv } from "../MotionDiv";

export function TeamStandings() {
  const { data: standings, isLoading } = useAPIData(fetchStandings);
  const { data: matches, isLoading: loading } = useAPIData(fetchResults);

  if (isLoading || loading) return <Loader />;
  standings.sort((a, b) =>
    b.points > a.points ? 1 : b._nrr > a._nrr ? 1 : -1
  );

  return (
    <Card className="dash-team-standings">
      <Card.Body>
        <Card.Title>Team Standings</Card.Title>
        <Table hover responsive className="standings">
          <thead>
            <tr>
              <th>Team</th>
              <th className="amount">Pts</th>
              <th className="nrr">NRR</th>
              {matches.length > 0 && <th className="form">Form</th>}
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
                  <td className="amount">
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

                  {matches.length > 0 && (
                    <td className="form">
                      <MotionDiv>
                        {getTeamMatches(matches, item.team, 3, true).map(
                          (res) => (
                            <span
                              key={res.match.num}
                              className={
                                item.team === res.winner?.short_name
                                  ? "won"
                                  : res.winner
                                  ? "lost"
                                  : ""
                              }
                            >
                              {item.team === res.winner?.short_name
                                ? "W"
                                : res.winner
                                ? "L"
                                : "-"}
                            </span>
                          )
                        )}
                      </MotionDiv>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
