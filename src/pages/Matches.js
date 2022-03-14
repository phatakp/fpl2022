import { useState } from "react";
import { Container } from "react-bootstrap";
import { IoFilter } from "react-icons/io5";
import { FixturesvsResults, MatchList, TeamFilter } from "../components";
import { useModal } from "../hooks";

export function Matches({ fixturePage }) {
  const [filterValue, setFilterValue] = useState("");

  const { setShow, modal } = useModal(
    <TeamFilter filterValue={filterValue} setFilterValue={setFilterValue} />,
    "Filter By Team"
  );

  return (
    <Container
      className="matches"
      fluid
      style={{
        background: `url(${process.env.REACT_APP_STATIC_URL}/scheduleBg.jpg) no-repeat center center/cover`,
      }}
    >
      {modal}
      <div className="matches__wrapper">
        <div className="filter__wrapper">
          <FixturesvsResults
            fixturePage={fixturePage}
            setFilterValue={setFilterValue}
          />

          <div className="team-filter">
            <span>Filter </span>
            <IoFilter onClick={() => setShow(true)} />
          </div>
        </div>

        <h2>
          {fixturePage ? "Fixtures" : "Results"}
          {filterValue && ` for  ${filterValue}`}
        </h2>

        <MatchList fixturePage={fixturePage} filterValue={filterValue} />
      </div>
    </Container>
  );
}
