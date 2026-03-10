import React, { useState, useEffect } from 'react';
import { Incident, User } from '../types';
import { fetchAllIncidents, updateIncidentStatus } from '../services/supabaseService';

interface DashboardProps {
    user: User;
    onLogout: () => void;
    onSwitchToProfessor: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onSwitchToProfessor }) => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [filterStatus, setFilterStatus] = useState('TODOS');

    const loadIncidents = async () => {
        setLoading(true);
        const data = await fetchAllIncidents();
        setIncidents(data);
        setLoading(false);
    };

    useEffect(() => { loadIncidents(); }, []);

    const handleStatusChange = async (id: string, status: string) => {
        const ok = await updateIncidentStatus(id, status);
        if (ok) setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    const filtered = incidents.filter(i => {
        const matchText = filter === '' || (
            i.aluno?.toLowerCase().includes(filter.toLowerCase()) ||
            i.turma?.toLowerCase().includes(filter.toLowerCase()) ||
            i.professor?.toLowerCase().includes(filter.toLowerCase())
        );
        const matchStatus = filterStatus === 'TODOS' || i.status === filterStatus;
        return matchText && matchStatus;
    });

    const countByStatus = (status: string) => incidents.filter(i => i.status === status).length;

    return (
        <div className="app-container">
            <header className="professor-header">
                <div className="header-info">
                    <h2>DASHBOARD DE GESTAO — EE FIORAVANTE IERVOLINO</h2>
                    <p style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700 }}>MODO GESTOR</p>
                </div>
                <div className="user-profile">
                    <span className="user-email">{user.email}</span>
                    <button className="btn-sync" onClick={onSwitchToProfessor}>Modo Professor</button>
                    <button className="btn-sync" style={{ background: '#3b82f6' }} onClick={loadIncidents}>Atualizar</button>
                    <button className="btn-exit" onClick={onLogout}>Sair</button>
                </div>
            </header>

            <main className="main-content">
                {/* Cartoes de resumo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'TOTAL', value: incidents.length, color: '#3b82f6' },
                        { label: 'PENDENTES', value: countByStatus('PENDENTE'), color: '#f59e0b' },
                        { label: 'RESOLVIDOS', value: countByStatus('RESOLVIDO'), color: '#10b981' },
                        { label: 'EM ANDAMENTO', value: countByStatus('EM ANDAMENTO'), color: '#8b5cf6' },
                    ].map(card => (
                        <div key={card.label} style={{
                            background: '#004b8d',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            borderLeft: `4px solid ${card.color}`,
                        }}>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.5rem' }}>{card.label}</p>
                            <p style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Buscar por aluno, turma ou professor..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{
                            flex: 1, minWidth: '250px', padding: '0.75rem 1rem',
                            borderRadius: '0.5rem', border: 'none',
                            background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.875rem'
                        }}
                    />
                    {['TODOS', 'PENDENTE', 'EM ANDAMENTO', 'RESOLVIDO'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                background: filterStatus === s ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Tabela */}
                <div style={{ background: '#004b8d', borderRadius: '1rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', background: '#003a6c', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Registros Disciplinares — {filtered.length} ocorrencia(s)
                    </div>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Carregando...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Nenhuma ocorrencia encontrada.</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#003a6c' }}>
                                        {['Data', 'Aluno', 'Turma', 'Professor', 'Disciplina', 'Irregularidades', 'Descricao', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: '#93c5fd', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item, idx) => (
                                        <tr key={item.id ?? idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                            <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: '#94a3b8' }}>{item.data}<br /><span style={{ fontSize: '0.65rem' }}>{item.horario}</span></td>
                                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{item.aluno}<br /><span style={{ fontSize: '0.65rem', color: '#60a5fa' }}>{item.ra}</span></td>
                                            <td style={{ padding: '0.75rem 1rem', color: '#60a5fa', whiteSpace: 'nowrap' }}>{item.turma}</td>
                                            <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{item.professor}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>{item.disciplina}</td>
                                            <td style={{ padding: '0.75rem 1rem', maxWidth: '200px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                    {(item.irregularidades || []).map((tag, i) => (
                                                        <span key={i} style={{
                                                            padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.6rem',
                                                            background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)',
                                                            whiteSpace: 'nowrap'
                                                        }}>{tag}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', maxWidth: '200px', fontSize: '0.75rem' }}>{item.descricao}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <select
                                                    value={item.status || 'PENDENTE'}
                                                    onChange={e => item.id && handleStatusChange(item.id, e.target.value)}
                                                    style={{
                                                        background: item.status === 'RESOLVIDO' ? '#10b98122' : item.status === 'EM ANDAMENTO' ? '#8b5cf622' : '#f59e0b22',
                                                        color: item.status === 'RESOLVIDO' ? '#10b981' : item.status === 'EM ANDAMENTO' ? '#a78bfa' : '#fbbf24',
                                                        border: 'none', borderRadius: '0.5rem', padding: '0.35rem 0.5rem',
                                                        fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                                                    }}
                                                >
                                                    <option value="PENDENTE">PENDENTE</option>
                                                    <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                                                    <option value="RESOLVIDO">RESOLVIDO</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
