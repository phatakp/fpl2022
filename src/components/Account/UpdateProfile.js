import { useState } from "react";
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap";
import { changeIPLWinner, fetchTeams } from "../../api";
import { useAPIData, useAuth } from "../../hooks";
import { Loader } from "../Loader";

export function UpdateProfile({ user }) {
  const { getToken } = useAuth();
  const [iplWinner, setIPLWinner] = useState(user.ipl_winner.short_name);

  const { data: teams, isLoading } = useAPIData(fetchTeams);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      await changeIPLWinner(token, iplWinner);
      setMessage("IPL Winner Updated");
      window.location.reload();
    } catch (error) {
      const { winner, non_field_errors } = error?.response?.data;
      if (winner) setError(winner);
      else if (non_field_errors) setError(non_field_errors);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Form className="profile-form" onSubmit={handleSubmit}>
      {(error || message) && (
        <Alert variant={error ? "danger" : "success"} className="text-center">
          {message ? message : error ? error : ""}
        </Alert>
      )}

      <Form.Group className="input mb-3" controlId="name">
        <Form.Text>Name:&nbsp;</Form.Text>
        <Form.Label>{user.name}</Form.Label>
      </Form.Group>

      <Form.Group className="input mb-3" controlId="id">
        <Form.Text>ID:&nbsp;</Form.Text>
        <Form.Label>{user.id}</Form.Label>
      </Form.Group>

      <FloatingLabel
        className="input-field"
        controlId="iplWinner"
        label="Change IPL Winner"
      >
        <Form.Select
          name="iplWinner"
          value={iplWinner}
          onChange={(e) => setIPLWinner(e.target.value)}
          placeholder="-Select-"
          required
        >
          <option>-Select-</option>
          {teams.map((team) => (
            <option key={team.short_name} value={team.short_name}>
              {team.long_name}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>

      <Button type="submit">Submit</Button>
    </Form>
  );
}
