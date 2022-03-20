import { Route, Routes } from "react-router-dom";
import { NavBar } from "./components";
import {
  Account,
  Dashboard,
  Home,
  Match,
  Matches,
  NotFound,
  Rules,
} from "./pages";
import { AuthContextProvider } from "./store/context/authContext";
import { DataContextProvider } from "./store/context/dataContext";

function App() {
  return (
    <AuthContextProvider>
      <DataContextProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game-rules" element={<Rules />} />
          <Route path="/login" element={<Account page="Login" />} />
          <Route path="/register" element={<Account page="Register" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fixtures" element={<Matches fixturePage={true} />} />
          <Route path="/results" element={<Matches fixturePage={false} />} />
          <Route path="/stats/:slug" element={<Match statsPage={true} />} />
          <Route
            path="/predictions/:slug"
            element={<Match statsPage={false} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DataContextProvider>
    </AuthContextProvider>
  );
}

export default App;
