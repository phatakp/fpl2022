import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function FixturesvsResults({ fixturePage, setFilterValue }) {
  const navigate = useNavigate();
  const handleFilterChange = (name) => {
    setFilterValue("");
    if (name === "result") {
      navigate("/results");
    } else {
      navigate("/fixtures");
    }
  };

  return (
    <ButtonGroup className="match-filter">
      <Button
        variant={fixturePage ? "danger" : "dark"}
        onClick={() => handleFilterChange("fixture")}
      >
        Fixtures
      </Button>
      <Button
        variant={fixturePage ? "dark" : "danger"}
        onClick={() => handleFilterChange("result")}
      >
        Results
      </Button>
    </ButtonGroup>
  );
}
