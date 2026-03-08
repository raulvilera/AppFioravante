export const GOOGLE_SHEETS_CONFIG = {
    // Planilha de Origem (Turmas e Alunos)
    SOURCE_SPREADSHEET_ID: '1I2e7NexDqkZZ6Pc6fEQ6QTJCdY2xGgo_SicORFv4zGI',

    // Planilha de Destino (Registros)
    TARGET_SPREADSHEET_ID: '1q_wi1Z70g851xZ86_gm9VKlblaSTqkP3Y9CL-HhHFwM',

    // Abas de Registro
    TABS: {
        TEACHER: 'OCORRENCIASDOSPROFESSORES',
        MANAGEMENT: 'BANCODEALUNOS'
    }
};

export interface Aluno {
    nome: string;
    turma: string;
    ra: string;
}

export interface Ocorrencia {
    data: string;
    professor: string;
    turma: string;
    aluno: string;
    ra: string;
    disciplina: string;
    irregularidades: string[];
    descricao: string;
    horario: string;
    pdfUrl?: string;
}

// Este serviço fará as requisições para o Google Apps Script Web App
// que o usuário deverá implantar posteriormente.
export const fetchTurmas = async (): Promise<string[]> => {
    // Lógica de fetch real via App Script virá aqui
    return ["6ºANO A", "6ºANO B", "7ºANO A", "8ºANO C", "9ºANO B"];
};

export const fetchAlunosByTurma = async (turma: string): Promise<Aluno[]> => {
    // Lógica de fetch real virá aqui
    return [
        { nome: "JOÃO SILVA", turma, ra: "123.456.789-X" },
        { nome: "MARIA OLIVEIRA", turma, ra: "987.654.321-0" }
    ];
};

export const saveOcorrencia = async (ocorrencia: Ocorrencia): Promise<boolean> => {
    console.log("Salvando ocorrência na planilha...", ocorrencia);
    return true;
};
