import './sign-in.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Lógica de verificação de email e senha
        if (email === "admin@admin.com" && password === "1234") {
            navigate("/home"); // Redireciona para a página de dashboard
        } else if (email === "cliente@cliente.com" && password === "1234"){
            navigate("/home");
        } else {
            setError("Email ou senha incorretos");
        }
    };

    return (
        <div>
            <h1>Salon Agenda</h1>
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
            </div>
        </div>
    );
}

export default SignIn;