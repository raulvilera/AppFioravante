import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface ResetPasswordProps {
    onSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            setError('As senhas nao coincidem.');
            return;
        }

        setLoading(true);
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (updateError) {
            setError(updateError.message);
        } else {
            alert('Senha atualizada com sucesso! Faca login novamente.');
            await supabase.auth.signOut();
            onSuccess();
        }
    };

    return (
        <div className="auth-layout">
            <div className="login-card animate-slide-up">
                <div className="logo-section">
                    <div className="logo-placeholder"><span>F</span></div>
                    <h1 className="portal-title">Nova Senha</h1>
                    <p className="portal-subtitle">Portal Fioravante</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="new-password">Nova Senha</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="new-password"
                                className="input-field"
                                placeholder="Minimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirmar Senha</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="confirm-password"
                                className="input-field"
                                placeholder="Repita a senha"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Salvando...' : 'Definir Nova Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
