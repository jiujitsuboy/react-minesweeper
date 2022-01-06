import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/GameList.css";
import Minesweeper from "../api/Minesweeper";

class GameList extends Component {
  PAGE_SIZE = 5;
  constructor(props) {
    super(props);
    this.userId = this.props.auth.token.userId;
    this.minesweeper = new Minesweeper();
    this.state = {
      games: [],
      pageInfo: {},
    };
  }

  async componentDidMount() {
    const resp = await this.minesweeper.getAllGamesForUser({
      userId: this.userId,
      page: 0,
      size: this.PAGE_SIZE,
    });
    console.log("resp.data: ", resp.data);
    this.setState(
      { games: resp.data.content, pageInfo: resp.data.page },
      () => {
        console.log("number: ", this.state.pageInfo.number);
        console.log("totalPages: ", this.state.pageInfo.totalPages);
        console.log(
          "this.state.pageInfo.number === 0 ",
          this.state.pageInfo.number === 0
        );
        console.log(
          "this.state.pageInfo.number < this.state.pageInfo.totalPages ",
          this.state.pageInfo.number < this.state.pageInfo.totalPages - 1
        );
      }
    );
  }

  async changeCurrentPage(newPage) {
    console.log("this.state.pageInfo: ", this.state.pageInfo);
    const resp = await this.minesweeper.getAllGamesForUser({
      userId: this.userId,
      page: newPage,
      size: this.PAGE_SIZE,
    });
    this.setState(
      { games: resp.data.content, pageInfo: resp.data.page },
      () => {
        console.log("newPage: ", newPage);
        console.log("number: ", this.state.pageInfo.number);
        console.log("totalPages: ", this.state.pageInfo.totalPages);
        console.log(
          "this.state.pageInfo.number === 0 ",
          this.state.pageInfo.number === 0
        );
        console.log(
          "this.state.pageInfo.number < this.state.pageInfo.totalPages ",
          this.state.pageInfo.number < this.state.pageInfo.totalPages - 1
        );
      }
    );
  }
  render() {
    return (
      <div className="GameList">
        <GameWizard minesweeper={this.minesweeper} userId={this.userId} />
        {this.state.games.length ? (
          <table
            align="center"
            className="GamesList"
            cellPadding="10"
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
                  <tr key={index} className="row">
                    <td align="center">{game.startTime}</td>
                    <td align="center">{game.rows}</td>
                    <td align="center">{game.columns}</td>
                    <td align="center">{game.numBombs}</td>
                    <td align="center">{game.endTime}</td>
                    <td align="center">{game.durationInSegs}</td>
                    <td align="center">{game.gameOver?.toString()}</td>
                    <td align="center">{game.won?.toString()}</td>
                    <td align="center">
                      <a
                        href={`/board?userId=${game.user.id}&gameId=${game.id}`}
                      >
                        {!game.gameOver ? "Resume" : "Review"}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="9">
                  <button
                    className="link-button"
                    onClick={() =>
                      this.changeCurrentPage(this.state.pageInfo.number - 1)
                    }
                    disabled={this.state.pageInfo.number === 0}
                  >
                    Back
                  </button>
                  <button
                    className="link-button"
                    onClick={() =>
                      this.changeCurrentPage(this.state.pageInfo.number + 1)
                    }
                    disabled={
                      this.state.pageInfo.number >=
                      this.state.pageInfo.totalPages - 1
                    }
                  >
                    Next
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="container">
            <div className="infomessage">No games currently</div>
          </div>
        )}
      </div>
    );
  }
}

const GameWizard = (props) => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const maxLengthAllow = (event, allowNumber) => {
    if (event.target.value.length > allowNumber) {
      event.target.value = event.target.value.slice(0, allowNumber);
    }
  };

  const gameSubmitHandler = async (event) => {
    event.preventDefault();

    const rows = event.target.rows.value;
    const columns = event.target.columns.value;
    const bombs = event.target.bombs.value;

    const resp = await props.minesweeper.createNewGame(
      props.userId,
      rows,
      columns,
      bombs
    );

    if (!resp.success) {
      setErrMsg(resp.data.message);
    } else {
      navigate(`/board?userId=${resp.data.user.id}&gameId=${resp.data.id}`);
    }
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
      <span className="error" style={{ dispay: errMsg ? "block" : "none" }}>
        {errMsg}
      </span>
      <form className="wizard" onSubmit={gameSubmitHandler}>
        <span>Rows</span>
        <input
          id="rows"
          type="number"
          placeholder="rows"
          min="0"
          max="10"
          onInput={(e) => maxLengthAllow(e, 2)}
          onChange={enableSubmitButton}
        />
        <span>Columns</span>
        <input
          id="columns"
          type="number"
          placeholder="columns"
          min="0"
          max="10"
          onInput={(e) => maxLengthAllow(e, 2)}
          onChange={enableSubmitButton}
        />
        <span>Bombs</span>
        <input
          id="bombs"
          type="number"
          placeholder="bombs"
          min="0"
          max="100"
          onInput={(e) => maxLengthAllow(e, 3)}
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
