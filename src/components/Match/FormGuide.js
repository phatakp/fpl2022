import React from "react";
import { Container } from "react-bootstrap";
import FormGuideMatches from "./FormGuideMatches";
import FormGuideTitle from "./FormGuideTitle";

export default function FormGuide({ team1, team2, match }) {
  return (
    <Container fluid>
      <div className="stats-title">
        <h4 className="poppins">Form Guide</h4>
      </div>

      <div className="form-guide">
        <FormGuideTitle klass="teamL" team={team1} />
        <FormGuideTitle klass="teamR" team={team2} />

        <FormGuideMatches klass="teamL" match={match} team={team1} />
        <FormGuideMatches klass="teamR" match={match} team={team2} />
      </div>
      <hr style={{ height: "5px", marginTop: "3rem" }} />
    </Container>
  );
}
