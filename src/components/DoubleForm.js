import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Loader, MotionDiv } from ".";
import { doublePrediction, fetchUserPredictionsforMatch } from "../api";
import { betCutoffPassed, withinDoubleCutoff } from "../helpers";
import { useAPIData, useAuth } from "../hooks";

export function DoubleForm({ match }) {
  const {
    id,
    getToken,
    state: { doubles },
  } = useAuth();
  const { num, date, double } = match.match;

  const { data: userPredictions, isLoading } = useAPIData(
    fetchUserPredictionsforMatch,
    true,
    { id, num }
  );

  const [pred] = userPredictions;

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await doublePrediction(token, pred.id);
      setSuccessMessage("Double Card locked");
      window.location.reload();
    } catch (error) {
      const { non_field_errors } = error.response.data;
      if (non_field_errors) setError(non_field_errors);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <MotionDiv>
      <Form className="prediction-form" onSubmit={handleSubmit}>
        <Alert
          variant={
            error || double || !pred || doubles < 0 ? "danger" : "success"
          }
          className="text-center"
        >
          {successMessage ? (
            successMessage
          ) : error ? (
            error
          ) : pred?.team?.short_name && !double && doubles > 0 ? (
            <>
              <span>Current Prediction:</span>
              <strong>&nbsp;{pred?.team.short_name}</strong>
              <strong>&nbsp;for&nbsp;{pred?.amount}</strong>
            </>
          ) : betCutoffPassed(date) && !pred ? (
            <span>Cutoff time passed! Prediction Defaulted!</span>
          ) : double ? (
            <span>Double already placed for match</span>
          ) : doubles <= 0 ? (
            <span>No more double cards left!</span>
          ) : (
            <span>No Predictions yet!</span>
          )}
        </Alert>

        <Form.Group className="input mb-3" controlId="team">
          <input type="hidden" name="double" value="" />
          {!double && pred?.team?.short_name && doubles > 0 && (
            <div className="text-center">
              Are you sure you want to play double ??
            </div>
          )}
        </Form.Group>

        {pred?.team?.short_name &&
          withinDoubleCutoff(date) &&
          !double &&
          doubles > 0 && (
            <Button className="ms-auto" type="submit">
              Submit
            </Button>
          )}
      </Form>
    </MotionDiv>
  );
}
