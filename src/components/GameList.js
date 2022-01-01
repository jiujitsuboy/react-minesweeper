import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/GameList.css";
import Minesweeper from "../api/minesweeper";

const userId = "f2681c02-006d-437c-9a3a-cb7011849876";

class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
    };
  }

  async componentDidMount() {
    console.log("Llamando API");
    const games = await Minesweeper.getAllGamesForUser(userId);
    this.setState({ games });
  }
  render() {
    return (
      <div className="GameList">
        <GameWizard />
        <table
          align="center"
          className="GamesList"
          border="1"
          cellPadding="5"
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th>Created</th>
              <th>Rows</th>
              <th>Columns</th>
              <th>Bombs</th>
              <th>Ended</th>
              <th>Played Time</th>
              <th>Game Over</th>
              <th>Won</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map((game, index) => {
              return (
                <tr key={index}>
                  <td align="center">{game.startTime}</td>
                  <td align="center">{game.rows}</td>
                  <td align="center">{game.columns}</td>
                  <td align="center">{game.numBombs}</td>
                  <td align="center">{game.endTime}</td>
                  <td align="center">{game.durationInSegs}</td>
                  <td align="center">{game.gameOver?.toString()}</td>
                  <td align="center">{game.won?.toString()}</td>
                  <td align="center">
                    {!game.isGameOver ? (
                      <a
                        href={`/board?userId=${game.user.id}&gameId=${game.id}`}
                      >
                        Resume
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

const GameWizard = () => {
  const navigate = useNavigate();

  const maxLengthAllow = (event) => {
    if (event.target.value.length > 3) {
      event.target.value = event.target.value.slice(0, 3);
    }
  };

  const gameSubmitHandler = async (event) => {
    event.preventDefault();

    const rows = event.target.rows.value;
    const columns = event.target.columns.value;
    const bombs = event.target.bombs.value;

    const game = await Minesweeper.createNewGame(userId, rows, columns, bombs);
    console.log("game received: ", game);
    navigate(`/board?userId=${game.user.id}&gameId=${game.id}`);
  };

  const enableSubmitButton = (event) => {
    const rows = document.forms[0].rows.value;
    const columns = document.forms[0].columns.value;
    const bombs = document.forms[0].bombs.value;

    if (rows && columns && bombs) {
      document.getElementById("submitButton").disabled = false;
    } else {
      document.getElementById("submitButton").disabled = true;
    }
  };

  return (
    <div className="GameWizard">
      <form onSubmit={gameSubmitHandler}>
        <span>Rows</span>
        <input
          id="rows"
          type="number"
          placeholder="rows"
          min="0"
          max="999"
          onInput={maxLengthAllow}
          onChange={enableSubmitButton}
        />
        <span>Columns</span>
        <input
          id="columns"
          type="number"
          placeholder="columns"
          min="0"
          max="999"
          onInput={maxLengthAllow}
          onChange={enableSubmitButton}
        />
        <span>Bombs</span>
        <input
          id="bombs"
          type="number"
          placeholder="bombs"
          min="0"
          max="999"
          onInput={maxLengthAllow}
          onChange={enableSubmitButton}
        />
        <button id="submitButton" type="submit" disabled>
          Create
        </button>
      </form>
    </div>
  );
};
export default GameList;
