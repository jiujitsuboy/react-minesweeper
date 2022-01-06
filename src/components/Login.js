import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.auth = this.props.auth;
    this.state = {
      signUp: false,
    };
  }

  _showSignUpComponent(value) {
    this.setState({
      signUp: value,
    });
  }

  render() {
    return this.state.signUp ? (
      <SignUp auth={this.auth} signUp={this._showSignUpComponent.bind(this)} />
    ) : (
      <SignIn auth={this.auth} signUp={this._showSignUpComponent.bind(this)} />
    );
  }
}

const SignIn = (props) => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);

    const username = event.target.username.value;
    const password = event.target.password.value;

    const resp = await props.auth.loginUser({ username, password });

    if (resp && !resp.success) {
      setErrMsg(resp.data.message);
      setButtonDisabled(false);
    } else {
      navigate("/games");
    }
  };

  return (
    <div className="container">
      <div
        className="errormessage"
        style={{ display: errMsg ? "block" : "none" }}
      >
        {errMsg}
      </div>
      <form className="login" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username"></input>
          <label htmlFor="password">Password</label>
          <input type="password" name="password"></input>
          <button type="submit" disabled={buttonDisabled}>
            Sign In
          </button>
          <button className="signupbtn" onClick={() => props.signUp(true)}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

const SignUp = (props) => {
  const [errMsg, setErrMsg] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);

    const username = event.target.username.value;
    const password = event.target.password.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.email.value;

    const resp = await props.auth.signUp({
      username,
      password,
      firstName,
      lastName,
      email,
    });

    if (resp && !resp.success) {
      setErrMsg(resp.data.message);
      setButtonDisabled(false);
    } else {
      props.signUp(false);
    }
  };

  return (
    <div className="container">
      <div
        className="errormessage"
        style={{ display: errMsg ? "block" : "none" }}
      >
        {errMsg}
      </div>
      <form className="login" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username"></input>
          <label htmlFor="password">Password</label>
          <input type="password" name="password"></input>
          <label htmlFor="firstName">First Name</label>
          <input type="text" name="firstName"></input>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" name="lastName"></input>
          <label htmlFor="email">Email</label>
          <input type="text" name="email"></input>
          <button type="submit" disabled={buttonDisabled}>
            Sign Up
          </button>
          <button className="cancelbtn" onClick={() => props.signUp(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
