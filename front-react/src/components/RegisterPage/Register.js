import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../LoginPage/Login.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register', { name, email, password });
            console.log('Registro bem-sucedido:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Erro no registro:', error);
            alert('Falha no registro, tente novamente.');
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
                <h2>Registro</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Registrar</button>
                </form>
                <p className="register-link">
                    Já tem uma conta? <Link to="/login">Faça login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
