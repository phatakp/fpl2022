import React from "react";
import { Container } from "react-bootstrap";
import H2HItems from "./H2HItems";
import H2HMidItem from "./H2HMidItem";
import H2HTitle from "./H2HTitle";

export default function HeadToHead({ stats, team1, team2 }) {
  const team1Stats = stats[team1.short_name];
  const team2Stats = stats[team2.short_name];
  const noResult =
    team1Stats?.all - team1Stats?.all_wins - team2Stats?.all_wins;

  return (
    <Container className="h2h" fluid>
      <div className="stats-title">
        <h4 className="poppins">Head-to-Head</h4>
      </div>

      <div className="h2h-section">
        <H2HTitle klass="teamL" team={team1} />

        <H2HTitle klass="teamR" team={team2} />

        <H2HItems klass="teamL" teamStats={team1Stats} />

        <H2HMidItem total={team1Stats?.all} noResult={noResult} />

        <H2HItems klass="teamR" teamStats={team2Stats} />
      </div>
      <hr style={{ height: "5px", marginTop: "3rem" }} />
    </Container>
  );
}
