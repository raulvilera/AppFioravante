import React, { useState, useEffect } from 'react';
import { User, Student, Incident } from '../types';
import { fetchTurmasFromDB, fetchAlunosByTurmaDB, saveIncidentToDB, fetchAllIncidents } from '../services/supabaseService';
import { getNomeProfessor } from '../data/professorsData';

interface ProfessorViewProps {
    user: User;
    onLogout: () => void;
    onSwitchToDashboard?: () => void;
    isGestor?: boolean;
}

const tagsIrregularidades = [
    'ATRASO', 'SEM MATERIAL', 'USO DE CELULAR', 'CONVERSA',
    'DESRESPEITO', 'INDISCIPLINA', 'DESACATO', 'SEM TAREFA', 'SAIU SEM PERMISSAO'
];

const ProfessorView: React.FC<ProfessorViewProps> = ({ user, onLogout, onSwitchToDashboard, isGestor }) => {
    const [turmas, setTurmas] = useState<string[]>([]);
    const [selectedTurma, setSelectedTurma] = useState('');
    const [alunos, setAlunos] = useState<Student[]>([]);
    const [selectedAluno, setSelectedAluno] = useState<Student | null>(null);
    const [irregularidades, setIrregularidades] = useState<string[]>([]);
    const [descricao, setDescricao] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [saving, setSaving] = useState(false);
    const [myIncidents, setMyIncidents] = useState<Incident[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const nomeProfessor = getNomeProfessor(user.email);

    useEffect(() => {
        const load = async () => {
            setLoadingTurmas(true);
            const data = await fetchTurmasFromDB();
            setTurmas(data);
            setLoadingTurmas(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (selectedTurma) {
            const load = async () => {
                setLoading(true);
                const data = await fetchAlunosByTurmaDB(selectedTurma);
                setAlunos(data);
                setLoading(false);
            };
            load();
        } else {
            setAlunos([]);
        }
        setSelectedAluno(null);
    }, [selectedTurma]);

    const loadMyHistory = async () => {
        const all = await fetchAllIncidents();
        setMyIncidents(all.filter(i => i.professor?.toUpperCase() === nomeProfessor.toUpperCase()));
        setShowHistory(true);
    };

    const toggleIrregularidade = (tag: string) => {
        setIrregularidades(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSave = async () => {
        if (!selectedAluno || !selectedTurma || irregularidades.length === 0) {
            alert('Preencha: turma, aluno e pelo menos uma irregularidade.');
            return;
        }

        setSaving(true);

        const incident: Incident = {
            data: new Date().toLocaleDateString('pt-BR'),
            professor: nomeProfessor,
            turma: selectedTurma,
            aluno: selectedAluno.nome,
            ra: selectedAluno.ra,
            disciplina: disciplina || 'N/A',
            irregularidades,
            descricao,
            horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: 'PENDENTE',
        };

        const ok = await saveIncidentToDB(incident);
        setSaving(false);

        if (ok) {
            alert('Ocorrencia registrada com sucesso!');
            setIrregularidades([]);
            setDescricao('');
            setDisciplina('');
            setSelectedAluno(null);
        } else {
            alert('Erro ao registrar. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#000d1a] to-[#001a35] font-sans pb-12">
            <header className="professor-header">
                <div className="header-info">
                    <h2>AREA DO PROFESSOR 2026</h2>
                    <p>EE FIORAVANTE IERVOLINO</p>
                </div>
                <div className="user-profile">
                    <span className="user-email" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {nomeProfessor}
                    </span>
                    <button className="btn-sync" onClick={loadMyHistory}>Meu Historico</button>
                    {isGestor && onSwitchToDashboard && (
                        <button className="btn-sync" style={{ background: '#8b5cf6' }} onClick={onSwitchToDashboard}>Dashboard</button>
                    )}
                    <button className="btn-exit" onClick={onLogout}>Sair</button>
                </div>
            </header>

            <main className="main-content">
                <div className="registration-card">
                    <div className="card-header">Lancamento de Registros Disciplinares</div>
                    <div className="card-body">
                        {/* Coluna esquerda */}
                        <div className="form-section">
                            <div className="input-group">
                                <label className="input-label">Professor Responsavel</label>
                                <input type="text" className="text-input" value={nomeProfessor} disabled />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Selecione o Aluno</label>
                                <div className="aluno-selection-area">
                                    {loadingTurmas ? (
                                        <p style={{ color: '#64748b' }}>Carregando turmas...</p>
                                    ) : loading ? (
                                        <p style={{ color: '#64748b' }}>Carregando alunos...</p>
                                    ) : selectedTurma ? (
                                        alunos.length === 0 ? (
                                            <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                                                Nenhum aluno cadastrado nesta turma ainda.
                                            </p>
                                        ) : (
                                            <div style={{ width: '100%', padding: '0.75rem', overflowY: 'auto', height: '100%' }}>
                                                {alunos.map(aluno => (
                                                    <div
                                                        key={aluno.ra}
                                                        onClick={() => setSelectedAluno(aluno)}
                                                        style={{
                                                            padding: '0.6rem 0.75rem',
                                                            marginBottom: '0.4rem',
                                                            background: selectedAluno?.ra === aluno.ra
                                                                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                                                : 'rgba(255,255,255,0.05)',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            border: selectedAluno?.ra === aluno.ra
                                                                ? '1px solid #60a5fa'
                                                                : '1px solid transparent',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        <small style={{ opacity: 0.6, fontSize: '0.65rem' }}>{aluno.ra}</small>
                                                        <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{aluno.nome}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <p style={{ color: '#64748b' }}>Selecione uma turma para carregar os alunos</p>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Irregularidades</label>
                                <div className="irregularidades-grid">
                                    {tagsIrregularidades.map(tag => (
                                        <button
                                            key={tag}
                                            className={`tag-btn ${irregularidades.includes(tag) ? 'active' : ''}`}
                                            onClick={() => toggleIrregularidade(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna direita */}
                        <div className="side-section">
                            <div className="input-group">
                                <label className="input-label">Turma / Serie</label>
                                <select
                                    className="select-field"
                                    value={selectedTurma}
                                    onChange={e => setSelectedTurma(e.target.value)}
                                    disabled={loadingTurmas}
                                >
                                    <option value="">{loadingTurmas ? 'Carregando...' : 'Selecione...'}</option>
                                    {turmas.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Disciplina</label>
                                <input
                                    type="text"
                                    className="text-input"
                                    placeholder="Ex: Matematica"
                                    value={disciplina}
                                    onChange={e => setDisciplina(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Descricao Adicional</label>
                                <textarea
                                    className="text-input"
                                    rows={5}
                                    style={{ resize: 'none' }}
                                    placeholder="Descreva o ocorrido..."
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                />
                            </div>

                            {selectedAluno && (
                                <div style={{
                                    background: 'rgba(59,130,246,0.15)', borderRadius: '0.5rem',
                                    padding: '0.75rem', marginBottom: '1rem',
                                    border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.8rem'
                                }}>
                                    <p style={{ color: '#93c5fd', fontWeight: 700, marginBottom: '0.25rem' }}>ALUNO SELECIONADO</p>
                                    <p style={{ fontWeight: 700 }}>{selectedAluno.nome}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{selectedAluno.ra} — {selectedAluno.turma}</p>
                                </div>
                            )}

                            <button
                                className="btn-login"
                                onClick={handleSave}
                                disabled={saving}
                                style={{ marginTop: '0.5rem' }}
                            >
                                {saving ? 'Salvando...' : 'Registrar Ocorrencia'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Historico do professor */}
                {showHistory && (
                    <div style={{ marginTop: '2rem', background: 'linear-gradient(to right, #000d1a, #002b5c)', borderRadius: '1rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'linear-gradient(to right, black, #001030, #002b5c)' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Meu Historico ({myIncidents.length})
                            </span>
                            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                        </div>
                        {myIncidents.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Voce ainda nao registrou ocorrencias.</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(to right, black, #001030, #002b5c)' }}>
                                            {['Data', 'Aluno', 'Turma', 'Irregularidades', 'Status'].map(h => (
                                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#93c5fd', fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myIncidents.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.data}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{item.aluno}</td>
                                                <td style={{ padding: '0.75rem 1rem', color: '#60a5fa' }}>{item.turma}</td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    {(item.irregularidades || []).join(', ')}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.65rem', fontWeight: 700,
                                                        background: item.status === 'RESOLVIDO' ? '#10b98122' : '#f59e0b22',
                                                        color: item.status === 'RESOLVIDO' ? '#10b981' : '#fbbf24',
                                                    }}>{item.status || 'PENDENTE'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfessorView;
