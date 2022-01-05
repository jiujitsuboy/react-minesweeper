import Config from "./Config";

class Minesweeper {
  constructor() {
    this.config = new Config();
  }
  createNewGame(userId, numRows, numColumns, numBombs) {
    return fetch(`${this.config.GAME_URL}/`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        numRows,
        numColumns,
        numBombs,
      }),
      headers: {
        ...this.config.headersWithAuthorization(),
      },
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        return { success: response.ok, data: json };
      })
      .catch((e) => {
        return { success: false, data: this._handleError(e) };
      });
  }

  getGameForUser(gameId, userId) {
    return fetch(`${this.config.GAME_URL}/${userId}/${gameId}`, {
      method: "GET",
      headers: {
        ...this.config.headersWithAuthorization(),
      },
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        return { success: response.ok, data: json };
      })
      .catch((e) => {
        return { success: false, data: this._handleError(e) };
      });
  }

  getAllGamesForUser({ userId, page, size }) {
    return fetch(
      `${this.config.GAME_URL}/${userId}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          ...this.config.headersWithAuthorization(),
        },
      }
    )
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        return { success: response.ok, data: json };
      })
      .catch((e) => {
        return { success: false, data: this._handleError(e) };
      });
  }

  openCell(gameId, userId, row, column) {
    return fetch(`${this.config.GAME_URL}/cell`, {
      method: "PATCH",
      body: JSON.stringify({
        gameId: gameId,
        userId: userId,
        row: row,
        column: column,
      }),
      headers: {
        ...this.config.headersWithAuthorization(),
      },
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        return { success: response.ok, data: json };
      })
      .catch((e) => {
        return { success: false, data: this._handleError(e) };
      });
  }

  markCell(gameId, userId, row, column, flaggedCell) {
    return fetch(`${this.config.GAME_URL}/cell/flagged`, {
      method: "PATCH",
      body: JSON.stringify({
        gameId,
        userId,
        row,
        column,
        flaggedCell,
      }),
      headers: {
        ...this.config.headersWithAuthorization(),
      },
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        return { success: response.ok, data: json };
      })
      .catch((e) => {
        return { success: false, data: this._handleError(e) };
      });
  }

  _handleError(error) {
    const err = new Map([
      [TypeError, "Can't connect to server."],
      [SyntaxError, "There was a problem parsing the response."],
      [Error, error.message],
    ]).get(error.constructor);
    return { message: err };
  }
}

export default Minesweeper;
