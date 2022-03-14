import { useState } from "react";
import { Button, Card, Image, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Loader, MotionDiv } from "..";
import { fetchUserPredictions } from "../../api";
import { getPaginatedData, teamLogo } from "../../helpers";
import { useAPIData } from "../../hooks";

const PER_PAGE = 10;

export function UserPredictions({ currUser }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = currUser;
  const { data: predictions, isLoading } = useAPIData(
    fetchUserPredictions,
    true,
    { id }
  );

  if (isLoading) return <Loader />;
  predictions.sort((a, b) =>
    a?.match?.num && b?.match?.num && b?.match?.num > a?.match?.num ? 1 : -1
  );

  const pages = Math.ceil(predictions.length / PER_PAGE);

  const pagePredictions = getPaginatedData(predictions, currentPage, PER_PAGE);

  return (
    <Card className="user-predictions">
      <Card.Body>
        <Card.Title>Your Predictions</Card.Title>
        <Table hover responsive className="standings">
          <thead>
            <tr>
              <th scope="row">#</th>
              <th>Match</th>
              <th>Team</th>
              <th className="amount">Stake</th>
              <th className="amount">Earned</th>
            </tr>
          </thead>
          <tbody>
            {pagePredictions &&
              pagePredictions.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/predictions/${item.match.slug}`)}
                >
                  <th>
                    <MotionDiv>{item?.match?.num}</MotionDiv>
                  </th>
                  <td>
                    <MotionDiv>
                      {item?.match?.slug.slice(0, -11) || "IPL Winner"}
                    </MotionDiv>
                  </td>
                  <td className="team">
                    <MotionDiv>
                      <Image src={teamLogo(item?.team?.short_name)} />
                    </MotionDiv>
                  </td>
                  <td className="amount">
                    <MotionDiv>{item.amount}</MotionDiv>
                  </td>
                  <td
                    className={`amount ${
                      item.result < 0
                        ? "text-danger"
                        : item.result > 0
                        ? "text-success"
                        : ""
                    }`}
                  >
                    <MotionDiv>
                      {item.result < 0 ? "" : "+"}
                      {item.result.toFixed(2)}
                    </MotionDiv>
                  </td>
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
