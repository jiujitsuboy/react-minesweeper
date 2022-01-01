const GAME_URL = "http://localhost:8082/api/v1/game";
const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzY290dDIiLCJyb2xlcyI6WyJBRE1JTiJdLCJpc3MiOiJNaW5lU3dlZXBlciBBUEkiLCJleHAiOjE2NDIwMjkxOTAsImlhdCI6MTY0MTAyOTE5MH0.eL9wvi5wrTCaRe4nua_1KEpWeTvlHjUgbYlr2TguTpUne7FvzGCbEcC5Pxn6EyWVJUSQrXa5G2AQndAHggc6C6CpZ8EoEI6ADId6IzjxcTpa7V-HtD4AQo_yIuQQUFdBCe2rTLORqrTinyxDnNrRixvodsLjgdWvcuqvYlHJdHB25K2bHxi_zT1_TWQuhWsHIxgbJ8MoGSFGD91IJBgqBBSA1daqAwifJ4xNWlnuFdaL3KWi3e0Sp1JWQrfLrNCkXZG5Qdscby9urlmAZ_aOoF_yRaaY4PezvCKap-xqS794DJx_L5EOBqBuGOZ4xiG2TqNBA4nsbDZPhWZ_wW_uRjilO60P_NCgtyYIJpA7FWbRL2wFQQ1iDeyIc6sNjJjmx6eT8klEgerdmKvWLh5s5oPjCtRM1lsm2mkUgCQ7JubpXQEa7JHzXdfF1XKlmkhNmrSXD1KRhEiItLIQQ5Lm7GclhFtR8KdPDV5GWgiQ2K1mYAZaRckJwH4l5dCdVkMravfcg3kB-NUVsUi18tMaIV98ck4gbqNG5prTZMMY0Z_fKcyNK13o2Qm07FwPOI8k1_EfbQ8bZcBzqnjcKpqQJRSpEuBGB4mreFv7-rEMdLe4rTPFR1kvfI09NewFctNRqS8Z_s5FoKTob7tXn_bGQVFgJ9WrWxQlT6TAF-rlvEw";

class Minesweeper {
  static createNewGame(userId, numRows, numColumns, numBombs) {
    return fetch(`${GAME_URL}/`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        numRows,
        numColumns,
        numBombs,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
  }

  static getGameForUser(gameId, userId) {
    return fetch(`${GAME_URL}/${userId}/${gameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
  }

  static getAllGamesForUser(userId) {
    return fetch(`${GAME_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((resp) => {
        console.log("resp", resp);
        return resp.json();
      })
      .catch((err) => console.log(err));
  }

  static openCell(gameId, userId, row, column) {
    return fetch(`${GAME_URL}/cell`, {
      method: "PATCH",
      body: JSON.stringify({
        gameId: gameId,
        userId: userId,
        row: row,
        column: column,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((resp) => {
        return resp.json().then((body) => {
          return { resp, body };
        });
      })
      .then((obj) => {
        console.log("respuesta: ", obj.body);
        if (obj.resp.status !== 200) {
          throw new Error(obj.body.message);
        }
        return obj.body;
      })
      .catch((err) => {
        console.log(err.message);
        throw new Error(err.message);
      });
  }

  static markCell(gameId, userId, row, column, flaggedCell) {
    return fetch(`${GAME_URL}/cell/flagged`, {
      method: "PATCH",
      body: JSON.stringify({
        gameId,
        userId,
        row,
        column,
        flaggedCell,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
  }
}

export default Minesweeper;
