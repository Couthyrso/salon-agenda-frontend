import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import loginImage from './bannerlogin.jpg';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Remove o margin-top do body enquanto esta página está aberta
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post('/api/register', formData);
      navigate("/auth/sign-in");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Erro ao registrar usuário");
      } else {
        setError("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="left-side">
        <header className="header">
          <h4>Salon Agenda</h4>
        </header>
        <div className="login-box">
          <h2>Registro</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Nome</label>
            </div>
            <div className="user-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Senha</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
              <label>Confirmar Senha</label>
            </div>
            <button type="submit" className="submit-button">
              Registrar
            </button>
          </form>
          <p className="sign-up-link">
            Já tem uma conta? <a href="/auth/sign-in">Faça login</a>
          </p>
        </div>
      </div>

      <div className="right-side">
        <img src={loginImage} alt="Banner de login" />
      </div>
    </div>
  );
};

export default SignUp;
