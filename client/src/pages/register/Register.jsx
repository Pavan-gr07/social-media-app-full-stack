import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleUserData = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8000/api/auth/register",
      userData
    );
    if (response) {
      navigate("/login");
    }
    console.log(response, "response");
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Pavan Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleUserData}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleUserData}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleUserData}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleUserData}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
