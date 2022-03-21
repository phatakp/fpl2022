import { useState } from "react";
import { Badge, Button, Card, Image, Table } from "react-bootstrap";
import { Loader } from "..";
import { fetchAllPredictions, fetchUsers } from "../../api";
import {
  firstName,
  getPaginatedData,
  getPlayerForm,
  teamImage,
} from "../../helpers";
import { useAPIData } from "../../hooks";
import { MotionDiv } from "../MotionDiv";

const PER_PAGE = 10;

export function PlayerStandings() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: standings, isLoading } = useAPIData(fetchUsers);
  const { data: predictions, isLoading: loading } = useAPIData(
    fetchAllPredictions,
    true
  );

  if (isLoading || loading) return <Loader />;

  const pages = Math.ceil(standings.length / PER_PAGE);

  const pageStandings = getPaginatedData(standings, currentPage, PER_PAGE);

  return (
    <Card className="dash-player-standings">
      <Card.Body>
        <Card.Title>Player Standings</Card.Title>
        <Table responsive className="standings">
          <thead>
            <tr>
              <th>Name</th>
              <th className="amount">Value</th>
              {predictions.length > 0 && <th className="form">Form</th>}
            </tr>
          </thead>
          <tbody>
            {pageStandings &&
              pageStandings.map((item) => (
                <tr key={item.id}>
                  <td className="name">
                    <MotionDiv>
                      {firstName(item.user.name)}
                      <Badge pill bg="light">
                        <Image
                          src={teamImage(item.ipl_winner.short_name)}
                          fluid
                        />
                      </Badge>
                    </MotionDiv>
                  </td>

                  <td
                    className={`amount ${
                      item.amount < 0
                        ? "text-danger"
                        : item.amount > 0
                        ? "text-success"
                        : ""
                    }`}
                  >
                    <MotionDiv>
                      {item.amount < 0 ? "" : "+"}
                      {item.amount.toFixed(2)}
                    </MotionDiv>
                  </td>

                  {predictions.length > 0 && (
                    <td className="form">
                      <MotionDiv>
                        {getPlayerForm(predictions, item.user.id).map(
                          (pred) => (
                            <span key={pred.id} className={pred.status}>
                              {pred.status === "won"
                                ? "W"
                                : pred.status === "lost"
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

        <div className="pagination">
          {currentPage > 1 && (
            <Button onClick={() => setCurrentPage((page) => page - 1)}>
              Prev
            </Button>
          )}

          {currentPage < pages && (
            <Button onClick={() => setCurrentPage((page) => page + 1)}>
              Next
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
