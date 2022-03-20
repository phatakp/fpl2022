import { Container, Table } from "react-bootstrap";

export function Rules() {
  return (
    <Container className="rules">
      <h1>Game Rules</h1>
      <h2>Predict the winner of every IPL game and earn big !!</h2>
      <hr />

      <ul>
        <li>
          <h4>Prediction</h4>
          <ol>
            <li className="imp">
              Every player has to predict the winner of the match atleast 1 hour
              before start of the match.
            </li>
            <li>
              Minimum Stake is applicable for each match as below.{" "}
              <strong>No Maximum Limit.</strong>
              <ul>
                For League Matches - <strong>Rs.30</strong>
              </ul>
              <ul>
                For Knockout/Qualifiers - <strong>Rs.50</strong>
              </ul>
              <ul>
                For Final Match - <strong>Rs.100</strong>
              </ul>
            </li>
            <li className="text-danger">
              In case a player does not predict before the cutoff, an amount
              equivalent to minimum stake applicable for the match will deducted
              from player's balance.
            </li>
            <li>
              <span className="imp">
                Prediction can be updated up until the start of the match.
              </span>{" "}
              Rules for same are defined as -
              <ol>
                <li>Only increase in stake amount is allowed.</li>
                <li>
                  Team change is allowed, however the stake amount has to be
                  atleast double of the existing value.
                </li>
              </ol>
            </li>
          </ol>
        </li>

        <li>
          <h4>Pre Requisites</h4>
          <ol>
            <li className="imp">
              Every player who registers has to complete the whole tournament.
            </li>
            <li>
              Every player has to predict the overall IPL winner at time of
              registration. An automatic stake of Rs.500 will be applicable for
              this case, which will be settled after final match.
            </li>
            <li className="imp">
              IPL Winner prediction can be changed up until the completion of
              Match 35. You can use the Update Profile button under your profile
              (on top right corner).
            </li>
            <li>
              <span className="text-danger">
                After registration a caution deposit of Rs.500 has to be made
              </span>{" "}
              on phone number <strong>9130469142 (PhonePe/GPay)</strong>. Only
              then you will be allowed to predict the matches. This deposit will
              be adjusted to your current balance on dashboard.
            </li>
          </ol>
        </li>

        <li>
          <h4>Settlement</h4>
          <ol>
            <li>
              All stakes will be settled at end of each match as below -
              <ul>
                For Losing stakes, amount equivalent to stake to be debited from
                balance.
              </ul>
              <ul>
                For Winning stakes, amount will be credited to balance as per
                below formula.
                <li className="imp">
                  Credit Amount = (Your Stake / Total Winning Stake Amount) *
                  Total Losing Stake Amount
                </li>
              </ul>
            </li>
            <li className="text-danger">
              Higher the stakes, higher will be the return.
            </li>
          </ol>
        </li>

        <li>
          <h4>Double Cards</h4>
          <ol>
            <li>
              Each player will be awarded a total of 5 double cards to be
              utilized in <span className="imp">league matches only.</span>
            </li>
            <li className="text-danger">
              Double card can only be applied after start of the match and up
              until 1 hour post the start.
            </li>
            <li className="imp">
              Only one player can play the double card in a match.
            </li>
            <li className="text-danger">
              Any unutilized double cards at the end of league stage will be
              exhausted.
            </li>
            <li className="imp">
              When a player uses a double card his/her stake for the match will
              also be doubled.
            </li>
            <li>
              {" "}
              Settlement of double card will be as below -
              <ul>
                <strong className="text-danger">
                  In case double player wins -{" "}
                </strong>
                <li>
                  All losing stakes will be doubled, and half of the amount will
                  be credited to double card player.
                </li>
                <li>
                  For the other half, settlement will be done as per regular
                  ratio process.
                </li>
                <li>
                  Other winner(s) (other than double card player) will not be
                  affected and will get same amount, as when double card was not
                  played.
                </li>
              </ul>
              <ul className="mt-3">
                <strong className="text-danger">
                  In case double player loses -{" "}
                </strong>
                <li>Settlement will be done as per usual ratio formula</li>
              </ul>
            </li>
            <li>
              Below table shows the sample stakes for the CSK vs KKR match and
              applicable settlements after the match.{" "}
              <strong>"D" in the row shows double card player.</strong>
              <h5>Stakes before the match</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Stake</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="name">P1</td>
                    <td>CSK</td>
                    <td>60</td>
                    <td>0.00</td>
                  </tr>
                  <tr>
                    <td className="name">P2</td>
                    <td>KKR</td>
                    <td>30</td>
                    <td>0.00</td>
                  </tr>
                  <tr>
                    <td className="name">P3</td>
                    <td>KKR</td>
                    <td>40</td>
                    <td>0.00</td>
                  </tr>
                  <tr>
                    <td className="name">P4</td>
                    <td>KKR</td>
                    <td>50</td>
                    <td>0.00</td>
                  </tr>
                  <tr>
                    <td className="name">P5</td>
                    <td>CSK</td>
                    <td>30</td>
                    <td>0.00</td>
                  </tr>
                </tbody>
              </Table>
              <h5>Result after the Match</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Stake</th>
                    <th>Result CSK win</th>
                    <th>Result KKR win</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="name">P1</td>
                    <td>CSK</td>
                    <td>60</td>
                    <td className="text-success">+200</td>
                    <td className="text-danger">-60</td>
                  </tr>
                  <tr>
                    <td className="name">P2</td>
                    <td>KKR</td>
                    <td>30</td>
                    <td className="text-danger">-60</td>
                    <td className="text-success">+22.5</td>
                  </tr>
                  <tr>
                    <td className="name">P3</td>
                    <td>KKR</td>
                    <td>40</td>
                    <td className="text-danger">-80</td>
                    <td className="text-success">+30</td>
                  </tr>
                  <tr>
                    <td className="name">P4</td>
                    <td>KKR</td>
                    <td>50</td>
                    <td className="text-danger">-100</td>
                    <td className="text-success">+37.5</td>
                  </tr>
                  <tr>
                    <td className="name">P5</td>
                    <td>CSK</td>
                    <td>30</td>
                    <td className="text-success">+40</td>
                    <td className="text-danger">-30</td>
                  </tr>
                </tbody>
              </Table>
            </li>
          </ol>
        </li>
      </ul>

      <h1>Play Bold !!</h1>
    </Container>
  );
}
