import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Loader } from ".";
import { updateWinner } from "../api";
import { useAuth } from "../hooks";

export function MatchWinnerForm({ match }) {
  const { getToken } = useAuth();
  const { num, team1, team2 } = match.match;

  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState("");
  const [type, setType] = useState("");
  const [margin, setMargin] = useState(0);
  const [status, setStatus] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "wickets" && margin > 10) {
      setError("Invalid Win Margin");
      return;
    }
    setLoading(true);

    try {
      const token = await getToken();
      await updateWinner(token, winner, status, type, margin, num);
      setMessage("Winner Updated");
      window.location.reload();
    } catch (error) {
      const {
        winner_name: wErr,
        stat: sErr,
        type: tErr,
        margin: mErr,
      } = error?.response?.data;
      if (wErr) setError("Invalid Winner");
      else if (sErr) setError("Invalid Status");
      else if (tErr) setError("Invalid Win Type");
      else if (mErr) setError("Invalid Win Margin");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Form className="match-winner-form" onSubmit={handleSubmit}>
      {(error || message) && (
        <Alert variant={error ? "danger" : "success"} className="text-center">
          {message ? message : error ? error : ""}
        </Alert>
      )}

      <Form.Group className="input mb-3" controlId="status">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setError("");
            setMessage("");
          }}
          required
          aria-required="true"
        >
          <option value="">--Select--</option>
          <option value="completed">Completed</option>
          <option value="abandoned">Abandoned</option>
        </Form.Select>
      </Form.Group>

      {status !== "abandoned" && (
        <Form.Group className="input mb-3" controlId="winner">
          <Form.Label>Winner</Form.Label>
          <Form.Select
            name="winner"
            value={winner}
            onChange={(e) => {
              setWinner(e.target.value);
              setError("");
              setMessage("");
            }}
            required={status === "completed"}
            aria-required="true"
          >
            <option value="">--Select--</option>
            <option value={team1.short_name}>{team1.short_name}</option>
            <option value={team2.short_name}>{team2.short_name}</option>
          </Form.Select>
        </Form.Group>
      )}

      {status !== "abandoned" && (
        <Form.Group className="input mb-3" controlId="type">
          <Form.Label>Win Type</Form.Label>
          <Form.Select
            name="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setError("");
              setMessage("");
            }}
            required={status === "completed"}
            aria-required="true"
          >
            <option value="">--Select--</option>
            <option value="runs">Runs</option>
            <option value="wickets">Wickets</option>
            <option value="super">Super Over</option>
          </Form.Select>
        </Form.Group>
      )}

      {type !== "super" && status !== "abandoned" && (
        <Form.Group className="input mb-3" controlId="margin">
          <Form.Label>Win Margin</Form.Label>
          <Form.Control
            type="number"
            name="margin"
            value={margin}
            min={0}
            onChange={(e) => {
              setMargin(Number(e.target.value) || 0);
              setError("");
              setMessage("");
            }}
            required={status === "completed"}
            aria-required="true"
          ></Form.Control>
        </Form.Group>
      )}

      <Button type="submit">Submit</Button>
    </Form>
  );
}
