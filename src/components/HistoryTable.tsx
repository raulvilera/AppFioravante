import React from 'react';

const HistoryTable: React.FC = () => {
    // Dados mockados para representar a terceira imagem
    const historico = [
        { data: "08/03/2026", status: "RESOLVIDO", aluno: "MIKAELY RINALDI DE SOUZA", turma: "9ºANO B", tipo: "OCORRÊNCIA", responsavel: "ALINE", descricao: "A aluna se envolveu em uma briga..." },
        { data: "08/03/2026", status: "PENDENTE", aluno: "JAYANE BRAGA DA SILVA", turma: "9ºANO B", tipo: "OCORRÊNCIA", responsavel: "CARMEN LÚCIA", descricao: "Aluna fora da sala sem permissão." },
    ];

    return (
        <div className="history-section animate-fade-in" style={{ marginTop: '2rem' }}>
            <div className="glass p-6 overflow-x-auto">
                <h3 className="premium-gradient-text mb-6">HISTÓRICO RECENTE</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>DATA</th>
                            <th style={{ padding: '1rem' }}>STATUS</th>
                            <th style={{ padding: '1rem' }}>ALUNO</th>
                            <th style={{ padding: '1rem' }}>TURMA</th>
                            <th style={{ padding: '1rem' }}>TIPO</th>
                            <th style={{ padding: '1rem' }}>RESPONSÁVEL</th>
                            <th style={{ padding: '1rem' }}>DESCRIÇÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{item.data}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.7rem',
                                        background: item.status === 'RESOLVIDO' ? '#10b98122' : '#f59e0b22',
                                        color: item.status === 'RESOLVIDO' ? '#10b981' : '#f59e0b',
                                        border: `1px solid ${item.status === 'RESOLVIDO' ? '#10b98144' : '#f59e0b44'}`
                                    }}>
                                        {item.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 700 }}>{item.aluno}</td>
                                <td style={{ padding: '1rem', color: '#60a5fa' }}>{item.turma}</td>
                                <td style={{ padding: '1rem' }}>{item.tipo}</td>
                                <td style={{ padding: '1rem' }}>{item.responsavel}</td>
                                <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>{item.descricao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryTable;
