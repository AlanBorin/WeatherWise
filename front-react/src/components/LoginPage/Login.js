import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log("Login bem-sucedido:", response.data);
      console.log("usuario:", response.data.user.id);

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);

      navigate("/home");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha no login, verifique suas credenciais.");
    }
  };

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              style={{ width: "100%" }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              style={{ width: "100%" }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
        </form>
        <p className="register-link">
          Não tem uma conta? <Link to="/register">Crie uma conta</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
