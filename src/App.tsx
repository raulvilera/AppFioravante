import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfessorView from './components/ProfessorView';
import ResetPassword from './components/ResetPassword';
import { User } from './types';
import { supabase } from './services/supabaseClient';
import { fetchRoleFromDB } from './services/supabaseService';
import { FIXED_GESTAO_EMAILS, isProfessorRegistered } from './data/professorsData';
import './index.css';

type View = 'login' | 'dashboard' | 'professor' | 'resetPassword' | 'loading';

function App() {
    const [view, setView] = useState<View>('loading');
    const [user, setUser] = useState<User | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    // Resolve role com fallback local — timeout de 4s para não travar
    const fetchRoleSafe = async (email: string): Promise<string | null> => {
        const lower = email.toLowerCase().trim();
        if (FIXED_GESTAO_EMAILS.includes(lower)) return 'gestor';

        const timeout = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 4000)
        );

        try {
            const role = await Promise.race([fetchRoleFromDB(lower), timeout]);
            if (role) return role;
        } catch {
            console.warn('[Fioravante] Fallback de role para:', email);
        }

        return isProfessorRegistered(lower) ? 'professor' : null;
    };

    useEffect(() => {
        // Detecta link de recuperação de senha na URL
        const urlCheck = window.location.hash.includes('type=recovery')
            || window.location.search.includes('type=recovery')
            || window.location.hash.includes('access_token=');

        if (urlCheck) {
            setIsRecoveryMode(true);
            setView('resetPassword');
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
                setView('resetPassword');
                return;
            }

            if (session?.user) {
                if (isRecoveryMode) {
                    setView('resetPassword');
                    return;
                }

                const role = await fetchRoleSafe(session.user.email!);
                if (role) {
                    const newUser: User = { email: session.user.email!.toLowerCase(), role: role as any };
                    setUser(newUser);
                    setView(role === 'gestor' ? 'dashboard' : 'professor');
                } else {
                    console.warn('[Fioravante] Usuario nao autorizado:', session.user.email);
                    await supabase.auth.signOut();
                    setUser(null);
                    setView('login');
                }
            } else if (event === 'SIGNED_OUT' || !session) {
                setIsRecoveryMode(false);
                setUser(null);
                setView('login');
            }
        });

        // Verifica sessão existente
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const role = await fetchRoleSafe(session.user.email!);
                if (role) {
                    const newUser: User = { email: session.user.email!.toLowerCase(), role: role as any };
                    setUser(newUser);
                    setView(role === 'gestor' ? 'dashboard' : 'professor');
                } else {
                    await supabase.auth.signOut();
                    setView('login');
                }
            } else {
                setView('login');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('login');
    };

    const handleRecoveryEmailSent = () => {
        setView('login');
    };

    const handleResetSuccess = () => {
        setIsRecoveryMode(false);
        setView('login');
    };

    // Tela de loading inicial
    if (view === 'loading') {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: '#001f3f', flexDirection: 'column', gap: '1.5rem'
            }}>
                <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 800, color: '#3b82f6'
                }}>F</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Carregando...
                </div>
            </div>
        );
    }

    if (view === 'resetPassword') {
        return <ResetPassword onSuccess={handleResetSuccess} />;
    }

    if (view === 'login' || !user) {
        return <Login onRecoveryMode={handleRecoveryEmailSent} />;
    }

    if (view === 'dashboard' && user.role === 'gestor') {
        return (
            <Dashboard
                user={user}
                onLogout={handleLogout}
                onSwitchToProfessor={() => setView('professor')}
            />
        );
    }

    return (
        <ProfessorView
            user={user}
            onLogout={handleLogout}
            isGestor={user.role === 'gestor'}
            onSwitchToDashboard={user.role === 'gestor' ? () => setView('dashboard') : undefined}
        />
    );
}

export default App;
