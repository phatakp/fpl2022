import { useEffect, useState } from "react";
import { Alert, Button, ButtonGroup, Form, Image } from "react-bootstrap";
import { Loader, MatchTeam, MotionDiv } from ".";
import {
  addPrediction,
  fetchUserPredictionsforMatch,
  updatePrediction,
} from "../api";
import { betCutoffPassed, teamImage } from "../helpers";
import { useAPIData, useAuth } from "../hooks";

export function PredictionForm({ match }) {
  const { id, getToken } = useAuth();
  const { num, team1, team2, min_bet, date } = match.match;

  const { data: userPredictions, isLoading } = useAPIData(
    fetchUserPredictionsforMatch,
    true,
    { id, num }
  );

  const [pred] = userPredictions;

  const [team, setTeam] = useState(pred?.team?.short_name || "");
  const [amount, setAmount] = useState(pred?.amount || min_bet);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setTeam(() => pred?.team?.short_name || "");
    setAmount(() => pred?.amount || min_bet);
  }, [pred?.team?.short_name, pred?.amount, min_bet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!team) {
      setError("Team is not selected");
      return;
    }

    try {
      const action = pred?.team?.short_name ? "update" : "add";
      const token = await getToken();
      if (action === "add") {
        await addPrediction(token, team, num, amount);
      } else {
        await updatePrediction(token, team, num, amount, pred.id);
      }
      setSuccessMessage(
        `Prediction ${action === "add" ? "Created" : "Updated"}`
      );
      window.location.reload();
    } catch (error) {
      const { amount: amtErr, team_name: teamErr } = error.response.data;
      if (amtErr) setError(amtErr);
      else if (teamErr) setError(teamErr);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <MotionDiv>
      <Form className="prediction-form" onSubmit={handleSubmit}>
        <Alert
          variant={
            pred?.team.short_name || successMessage ? "success" : "danger"
          }
          className="text-center"
        >
          {successMessage ? (
            successMessage
          ) : pred && pred.team.short_name ? (
            <>
              <span>Current Prediction:</span>
              <strong>&nbsp;{pred?.team.short_name}</strong>
              <strong>&nbsp;for&nbsp;{pred?.amount}</strong>
            </>
          ) : betCutoffPassed(date) && !pred ? (
            <span>Cutoff time passed! Prediction Defaulted!</span>
          ) : (
            <span>No Predictions yet!</span>
          )}
        </Alert>

        <Form.Group className="input mb-3" controlId="team">
          <input type="hidden" name="team_name" value={team} />
          <Form.Label>Team</Form.Label>
          <ButtonGroup className="teamOptions">
            <Button
              variant="light"
              className={`team-logoName team1 ${
                team && team1.short_name === team ? team : ""
              }`}
              onClick={() => {
                setTeam(team1.short_name);
                setError("");
                setSuccessMessage("");
              }}
              disabled={betCutoffPassed(date) && !pred}
            >
              <Image src={teamImage(team1.short_name)} />
              <MatchTeam team={team1} />
            </Button>
            <Button
              variant="light"
              className={`team-logoName team2 ${
                team && team2.short_name === team ? team : ""
              }`}
              onClick={() => {
                setTeam(team2.short_name);
                setError("");
                setSuccessMessage("");
              }}
              disabled={betCutoffPassed(date) && !pred}
            >
              <Image src={teamImage(team2.short_name)} />
              <MatchTeam team={team2} />
            </Button>
          </ButtonGroup>
        </Form.Group>

        <Form.Group className="input mb-3" controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={amount}
            min={min_bet}
            onChange={(e) => {
              setAmount(Number(e.target.value || "0"));
              setError("");
              setSuccessMessage("");
            }}
            disabled={betCutoffPassed(date) && !pred}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>

        {!(betCutoffPassed(date) && !pred) && (
          <Button type="submit">Submit</Button>
        )}
      </Form>
    </MotionDiv>
  );
}
