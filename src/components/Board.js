import React, { Component } from "react";
import "./styles/Board.css";
import Cell from "./Cell";
import { useLocation } from "react-router-dom";
import Minesweeper from "../api/Minesweeper";

class Board extends Component {
  constructor(props) {
    super(props);
    this.minesweeper = new Minesweeper();
    this.state = {
      details: {},
      board: [],
      result: {
        message: "",
        color: "",
      },
    };
  }

  async updateFlag(event, row, column) {
    event.preventDefault();
    const newBoard = this.state.board;

    if (!newBoard[row][column].opened) {
      const respMarkCell = await this.minesweeper.markCell(
        this.gameId,
        this.userId,
        row,
        column,
        !newBoard[row][column].flagged
      );

      if (!respMarkCell.success) {
        this.state.result = {
          message: respMarkCell.data.message,
          color: "purple",
        };
      } else {
        newBoard[row][column].flagged = respMarkCell.data;
      }

      this.setState({ details: this.state.details, board: newBoard });
    }
  }

  async openCell(row, column) {
    const game = this.state;

    const respCellInfo = await this.minesweeper.openCell(
      this.gameId,
      this.userId,
      row,
      column
    );

    if (!respCellInfo.success) {
      // alert(respCellInfo.data.message);
      game.result = { message: respCellInfo.data.message, color: "purple" };
    } else {
      if (respCellInfo.data.won) {
        this.isWon = true;
        game.details.won = this.isWon;
        game.result = {
          message: "Congratulation, you won the game",
          color: "green",
        };
      } else if (respCellInfo.data.cellValue === -1) {
        this.hitMine = true;
        game.board[row][column].detonated = this.hitMine;
        game.result = {
          message: "You hit a mine, you lost the game",
          color: "red",
        };
      } else {
        game.board[row][column].flagged = false;
      }

      respCellInfo.data.cellsOpened.forEach(
        (cell) => (game.board[cell.row][cell.column].opened = true)
      );
    }

    this.setState(game);
  }

  _showGameStatus() {
    if (this.isWon) {
      alert("game won");
    } else if (this.hitMine) {
      alert("clicked on mine");
    }
  }

  async componentDidMount() {
    const query = new URLSearchParams(this.props.params.search);
    this.gameId = query.get("gameId");
    this.userId = query.get("userId");

    const gameDetails = await this.minesweeper.getGameForUser(
      this.gameId,
      this.userId
    );
    if (!gameDetails.success) {
      this.setState({
        result: { message: gameDetails.data.message, color: "purple" },
      });
    } else {
      this.setState({ ...gameDetails.data });
    }
  }

  render() {
    console.log("state:", this.state);
    return (
      <>
        <div
          className="message"
          style={{
            backgroundColor: this.state.result.color,
            visibility: this.state.result.message ? "visible" : "hidden",
          }}
        >
          {this.state.result.message}
        </div>
        <div className="board">
          {this.state.board.map((row, indexRow) => {
            return (
              <div key={indexRow} className="row">
                {row.map((column, indexCol) => {
                  return (
                    <Cell
                      key={indexCol}
                      attributes={column}
                      updateFlag={this.updateFlag.bind(this)}
                      openCell={this.openCell.bind(this)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const BoardWithParams = (props) => <Board {...props} params={useLocation()} />;

export default BoardWithParams;
