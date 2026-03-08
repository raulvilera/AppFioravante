import React, { useState } from 'react';
import { LISTA_PROFESSORES } from '../data/professorsData';

interface LoginProps {
    onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isProfessorAuthorized = (email: string) => {
        return LISTA_PROFESSORES.some(prof =>
            prof.emails.some(e => e.toLowerCase() === email.toLowerCase())
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const lowerEmail = email.toLowerCase();

        if (!isProfessorAuthorized(lowerEmail)) {
            setError('E-mail institucional não autorizado ou não encontrado na lista oficial.');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Sucesso no login
        onLogin(lowerEmail);
    };

    return (
        <div className="auth-layout">
            <div className="login-card animate-slide-up">
                <div className="logo-section">
                    <div className="logo-placeholder">
                        <span>F</span>
                    </div>
                    <h1 className="portal-title">Portal Fioravante</h1>
                    <p className="portal-subtitle">Sistema de Gestão 2026</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail Institucional</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                className="input-field"
                                placeholder="seu.nome@prof.educacao.sp.gov.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password" style={{ margin: 0 }}>Senha</label>
                            <a href="#" className="forgot-password">Esqueci a senha</a>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}

                    <button type="submit" className="btn-login">
                        Entrar no Portal
                    </button>
                </form>

                <p className="signup-text">
                    Primeiro acesso? <a href="#" className="signup-link">Cadastre-se aqui</a>
                </p>

                <div className="footer-disclaimer">
                    Este portal é de uso exclusivo dos profissionais da gestão e docentes.
                </div>
            </div>
        </div>
    );
};

export default Login;
