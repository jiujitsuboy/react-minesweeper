import React, { Component } from "react";
import "./styles/Board.css";
import Cell from "./Cell";
import { useLocation } from "react-router-dom";
import Minesweeper from "../api/minesweeper";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
      board: [],
    };
  }

  async updateFlag(event, row, column) {
    event.preventDefault();
    const newBoard = this.state.board;
    if (!newBoard[row][column].opened) {
      newBoard[row][column].flagged = await Minesweeper.markCell(
        this.gameId,
        this.userId,
        row,
        column,
        !newBoard[row][column].flagged
      );
      this.setState({ details: this.state.details, board: newBoard });
    }
  }

  _openAllCells(board) {
    board.forEach((row) => row.forEach((col) => (col.opened = true)));
  }

  async openCell(row, column) {
    const game = this.state;

    try {
      const cellInfo = await Minesweeper.openCell(
        this.gameId,
        this.userId,
        row,
        column
      );

      if (cellInfo.won) {
        this._openAllCells(game.board);
        this.isWon = true;
      } else if (cellInfo.cellValue === -1) {
        this._openAllCells(game.board);
        this.hitMine = true;
        console.log("DETONOOOOOO");
        game.board[row][column].detonated = this.hitMine;
      } else {
        game.board[row][column].flagged = false;
        cellInfo.cellsOpened.forEach(
          (cell) => (game.board[cell.row][cell.column].opened = true)
        );
      }

      game.details.won = this.isWon;

      this.setState(game, this._showGameStatus());
    } catch (err) {
      alert(err);
    }
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

    const gameDetails = await Minesweeper.getGameForUser(
      this.gameId,
      this.userId
    );
    console.log("gameDetails: ", gameDetails);
    this.setState({ ...gameDetails });
  }

  render() {
    return (
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
    );
  }
}

const BoardWithParams = (props) => <Board {...props} params={useLocation()} />;

export default BoardWithParams;
