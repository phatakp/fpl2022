import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { updateScore } from "../api";
import { valid_format } from "../helpers";
import { useAuth } from "../hooks";

export function MatchScoreForm({ match }) {
  const { getToken } = useAuth();
  const {
    num,
    team1,
    team2,
    team1_score,
    team1_overs,
    team2_score,
    team2_overs,
    bat_first,
  } = match.match;

  const [team1Score, setTeam1Score] = useState(team1_score || "0/0");
  const [team2Score, setTeam2Score] = useState(team2_score || "0/0");
  const [team1Overs, setTeam1Overs] = useState(team1_overs || 0);
  const [team2Overs, setTeam2Overs] = useState(team2_overs || 0);
  const [batFirst, setbatFirst] = useState(bat_first || "");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (team1Overs && !valid_format(team1Score, team1Overs)) {
      setError("Invalid Format");
      return;
    }
    if (team2Overs && !valid_format(team2Score, team2Overs)) {
      setError("Invalid Format");
      return;
    }

    try {
      const token = await getToken();
      await updateScore(
        token,
        team1Score,
        team1Overs,
        team2Score,
        team2Overs,
        batFirst,
        num
      );
      setMessage("Score Updated");
      window.location.reload();
    } catch (error) {
      const {
        team1_score: t1Err,
        team1_overs: t1OErr,
        team2_score: t2Err,
        team2_overs: t2OErr,
      } = error?.response?.data;
      if (t1Err) setError(`Invalid ${team1.short_name} score`);
      else if (t1OErr) setError(`Invalid ${team1.short_name} overs`);
      else if (t2Err) setError(`Invalid ${team2.short_name} score`);
      else if (t2OErr) setError(`Invalid ${team2.short_name} overs`);
    }
  };

  return (
    <Form className="match-score-form" onSubmit={handleSubmit}>
      {(error || message) && (
        <Alert variant={error ? "danger" : "success"} className="text-center">
          {message ? message : error ? error : ""}
        </Alert>
      )}

      <Form.Group className="input mb-3" controlId="batFirst">
        <Form.Label>Batting First</Form.Label>
        <Form.Select
          name="batFirst"
          value={batFirst}
          onChange={(e) => {
            setbatFirst(e.target.value);
            setError("");
            setMessage("");
          }}
        >
          <option value="">--Select--</option>
          <option value={team1.short_name}>{team1.short_name}</option>
          <option value={team2.short_name}>{team2.short_name}</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="input mb-3" controlId="team1score">
        <Form.Label>{team1.short_name}&nbsp;Score</Form.Label>
        <Form.Control
          name="team1Score"
          value={team1Score}
          onChange={(e) => {
            setTeam1Score(e.target.value);
            setError("");
            setMessage("");
          }}
        />
      </Form.Group>

      <Form.Group className="input mb-3" controlId="team1overs">
        <Form.Label>{team1.short_name}&nbsp;Overs</Form.Label>
        <Form.Control
          type="number"
          name="team1Overs"
          value={team1Overs}
          min={0}
          max={20}
          step={0.1}
          onChange={(e) => {
            setTeam1Overs(e.target.value || 0);
            setError("");
            setMessage("");
          }}
        />
      </Form.Group>

      <Form.Group className="input mb-3" controlId="team2score">
        <Form.Label>{team2.short_name}&nbsp;Score</Form.Label>
        <Form.Control
          name="team2Score"
          value={team2Score}
          onChange={(e) => {
            setTeam2Score(e.target.value);
            setError("");
            setMessage("");
          }}
        />
      </Form.Group>

      <Form.Group className="input mb-3" controlId="team2overs">
        <Form.Label>{team2.short_name}&nbsp;Overs</Form.Label>
        <Form.Control
          type="number"
          name="team2Overs"
          value={team2Overs}
          min={0}
          max={20}
          step={0.1}
          onChange={(e) => {
            setTeam2Overs(e.target.value || 0);
            setError("");
            setMessage("");
          }}
        />
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
}
