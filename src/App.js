import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import GameList from "./components/GameList";
import Board from "./components/Board";
import Login from "./components/Login";
import Auth from "./api/Auth";
import useToken from "./hooks/useToken";
import "./App.css";

function App() {
  const { token, setToken } = useToken();
  const auth = new Auth(token, setToken);

  const loginComponent = () => {
    return <Login auth={auth} />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar auth={auth} />
        <Routes>
          <Route
            path="/games"
            element={token ? <GameList auth={auth} /> : loginComponent()}
          />
          <Route
            path="/board"
            element={token ? <Board /> : loginComponent()}
          ></Route>
          <Route path="/" element={loginComponent()}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const NavBar = (props) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    if (props.auth.token) {
      await props.auth.logoutUser({
        refreshToken: props.auth.token.refreshToken,
      });
    }
    navigate("/");
  };
  return (
    <div
      style={{
        color: "white",
        backgroundColor: "darkblue",
        textAlign: "center",
      }}
    >
      <div style={{ display: "inline" }} className="Navbar">
        <Link style={{ color: "white", float: "none" }} to="/games">
          Games
        </Link>
        &nbsp;
      </div>
      <div style={{ display: "inline", paddingLeft: "50%" }}>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default App;
