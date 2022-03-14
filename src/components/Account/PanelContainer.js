import { Image } from "react-bootstrap";
import { MotionDiv } from "../MotionDiv";

export function PanelContainer({ page }) {
  const newPage = page === "Register" ? "login" : "register";
  const title =
    page === "Register" ? "Already have an Account" : "Create an Account";
  return (
    <div className="panel-container">
      <div className="panel">
        <h3>{title}</h3>
        <div className="content poppins">
          <p className="poppins">
            {page === "Register"
              ? "Enter Credentials for your Fantasy Account and start predicting"
              : "Enter few personal details and create a new account with a click of a button"}
          </p>
          <a
            className="transparent-btn btn btn-primary poppins"
            href={`/${newPage}`}
          >
            {newPage}
          </a>
        </div>
        <MotionDiv type="appear">
          <Image
            src={
              page === "Register"
                ? `${process.env.REACT_APP_STATIC_URL}/register.svg`
                : `${process.env.REACT_APP_STATIC_URL}/login.svg`
            }
            fluid
          />
        </MotionDiv>
      </div>
    </div>
  );
}
