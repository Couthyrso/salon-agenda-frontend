import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from './bannerlogin.jpg';
import './sign-in.css';
import api from '../../services/api';
import Cookies from 'js-cookie';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post('/api/login', {
        email,
        password
      });

      const { token, user } = response.data;

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('userRole', user.admin, { expires: 7 });
      
      if (user.admin === true) {
        navigate("/homeadm");
      } else {
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Erro ao fazer login");
      } else {
        setError("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="left-side">
        <header className="header">
          <h1>Salon Agenda</h1>
        </header>
        <div className="login-box">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Senha</label>
            </div>
            <button type="submit" className="submit-button">
              Entrar
            </button>
          </form>
          <p className="sign-up-link">
            Não tem uma conta? <a href="/auth/sign-up">Registre-se</a>
          </p>
        </div>
      </div>
      <div className="right-side">
        <img src={loginImage} alt="Banner Login" />
      </div>
    </div>
  );
};

export default SignIn;
