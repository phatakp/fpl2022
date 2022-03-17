import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchTeams, register } from "../../api";
import { Loader } from "../../components";
import { useAPIData } from "../../hooks";
import { MotionDiv } from "../MotionDiv";

export function RegisterForm() {
  const navigate = useNavigate();
  const { data: teams, isLoading } = useAPIData(fetchTeams);
  const [name, setName] = useState("");
  const [inp_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [iplWinner, setIPLWinner] = useState("");
  const [error, setError] = useState("");

  const formSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("The two password fields didn't match");
      return;
    }
    try {
      const resp = await register(
        inp_email,
        name,
        password,
        password2,
        iplWinner
      );
      if (resp.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err.response);
      const { email, non_field_errors } = err.response.data;
      if (email) {
        setError(email[0]);
      }
      if (non_field_errors) {
        setError(non_field_errors[0]);
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <MotionDiv type="slideRight">
      <Form className="sign-up-form" autoComplete="off" onSubmit={formSubmit}>
        <h2 className="form-title">Register</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <FloatingLabel
          className="input-field"
          controlId="name"
          label="Full Name"
        >
          <Form.Control
            type="text"
            name="name"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel className="input-field" controlId="email" label="Email">
          <Form.Control
            type="email"
            name="email"
            value={inp_email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          className="input-field"
          controlId="pass"
          label="Password"
        >
          <Form.Control
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </FloatingLabel>

        <FloatingLabel
          className="input-field"
          controlId="pass2"
          label="Confirm Password"
        >
          <Form.Control
            type="password"
            name="password2"
            value={password2}
            placeholder="Password2"
            onChange={(e) => setPassword2(e.target.value)}
            required
            minLength={8}
          />
        </FloatingLabel>

        <FloatingLabel
          className="input-field"
          controlId="iplWinner"
          label="Predict IPL Winner"
        >
          <Form.Select
            // className="input-field"
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

        <Button className="form-button" type="submit">
          Submit
        </Button>
      </Form>
    </MotionDiv>
  );
}
