import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { getPaginatedData } from "../../helpers";
import { DashMatch } from "./DashMatch";

export function ResultsNFixtures({ matches, currMatch }) {
  const PER_PAGE = 5;
  const index = matches.indexOf(currMatch);
  const [currentPage, setCurrentPage] = useState(
    Math.ceil((index + 1) / PER_PAGE)
  );
  const pages = Math.ceil(matches.length / PER_PAGE);

  const pageMatches = getPaginatedData(matches, currentPage, PER_PAGE);

  return (
    <Card className="results-fixtures">
      <Card.Body>
        <Card.Title>Fixtures & Results</Card.Title>

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

        {pageMatches &&
          pageMatches.map((match) => (
            <DashMatch key={match.id} match={match} currMatch={currMatch} />
          ))}

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
