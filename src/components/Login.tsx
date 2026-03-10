import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LoginProps {
    onRecoveryMode: () => void;
}

const Login: React.FC<LoginProps> = ({ onRecoveryMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [recoveryMsg, setRecoveryMsg] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password,
        });

        setLoading(false);

        if (authError) {
            if (authError.message.includes('Invalid login credentials')) {
                setError('E-mail ou senha incorretos. Verifique os dados e tente novamente.');
            } else if (authError.message.includes('Email not confirmed')) {
                setError('E-mail ainda nao confirmado. Verifique sua caixa de entrada.');
            } else {
                setError(authError.message);
            }
        }
        // sucesso: onAuthStateChange no App.tsx cuida do redirecionamento
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            forgotEmail.toLowerCase().trim(),
            { redirectTo: window.location.origin + '/?type=recovery' }
        );

        setLoading(false);

        if (resetError) {
            setError(resetError.message);
        } else {
            setRecoveryMsg(`Link de redefinicao enviado para ${forgotEmail}. Verifique sua caixa de entrada.`);
            setShowForgot(false);
            onRecoveryMode();
        }
    };

    if (showForgot) {
        return (
            <div className="auth-layout">
                <div className="login-card animate-slide-up">
                    <div className="logo-section">
                        <div className="logo-placeholder"><span>F</span></div>
                        <h1 className="portal-title">Recuperar Senha</h1>
                        <p className="portal-subtitle">Portal Fioravante</p>
                    </div>

                    <form onSubmit={handleForgotPassword}>
                        <div className="form-group">
                            <label htmlFor="forgot-email">E-mail Institucional</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="forgot-email"
                                    className="input-field"
                                    placeholder="seu.nome@prof.educacao.sp.gov.br"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Link de Recuperacao'}
                        </button>
                    </form>

                    <p className="signup-text">
                        <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); setShowForgot(false); }}>
                            Voltar ao login
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-layout">
            <div className="login-card animate-slide-up">
                <div className="logo-section">
                    <div className="logo-placeholder"><span>F</span></div>
                    <h1 className="portal-title">Portal Fioravante</h1>
                    <p className="portal-subtitle">Sistema de Gestao 2026</p>
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
                            <a
                                href="#"
                                className="forgot-password"
                                onClick={(e) => { e.preventDefault(); setShowForgot(true); setError(''); }}
                            >
                                Esqueci a senha
                            </a>
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
                    {recoveryMsg && <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem' }}>{recoveryMsg}</p>}

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar no Portal'}
                    </button>
                </form>

                <div className="footer-disclaimer">
                    Este portal e de uso exclusivo dos profissionais da gestao e docentes da EE Fioravante Iervolino.
                </div>
            </div>
        </div>
    );
};

export default Login;
