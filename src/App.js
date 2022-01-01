import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Board from "./components/Board";
import GameList from "./components/GameList";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/board" element={<Board />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const NavBar = () => (
  <div className="Navbar">
    <Link to="/games">Games</Link>&nbsp;
    <Link to="/board">Board</Link>
  </div>
);

export default App;
