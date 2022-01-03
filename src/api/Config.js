class Config {
  SCHEME = "http";
  HOST = "localhost";
  PORT = "8082";
  LOGIN_URL = `${this.SCHEME}://${this.HOST}:${this.PORT}/api/v1/auth/token`;
  SING_UP_URL = `${this.SCHEME}://${this.HOST}:${this.PORT}/api/v1/auth/users`;
  GAME_URL = `${this.SCHEME}://${this.HOST}:${this.PORT}/api/v1/game`;
  ACCESS_TOKEN = "accessToken";
  EXPIRATION = "expiration";

  defaultHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  headersWithAuthorization() {
    return {
      ...this.defaultHeaders(),
      Authorization: localStorage.getItem(this.ACCESS_TOKEN),
    };
  }

  tokenExpired() {
    const expDate = Number(localStorage.getItem(this.EXPIRATION));
    if (expDate > Date.now()) {
      return false;
    }
    return true;
  }

  storeAccessToken(token) {
    localStorage.setItem(this.ACCESS_TOKEN, `Bearer ${token}`);
    localStorage.setItem(this.EXPIRATION, this.getExpiration(token));
  }

  getExpiration(token) {
    let encodedPayload = token ? token.split(".")[1] : null;
    if (encodedPayload) {
      encodedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(encodedPayload));
      return payload?.exp ? payload?.exp * 1000 : 0;
    }
    return 0;
  }
}

export default Config;
