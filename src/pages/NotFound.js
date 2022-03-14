import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h1>Oops!!</h1>
      <h3>Looks like you have hit an invalid page!</h3>
      <Button variant="warning" onClick={() => navigate("/")}>
        Back to HomePage
      </Button>
    </div>
  );
}
