export interface User {
    email: string;
    role: 'gestor' | 'professor';
    nome?: string;
}

export interface Incident {
    id?: string;
    data: string;
    professor: string;
    turma: string;
    aluno: string;
    ra: string;
    disciplina: string;
    irregularidades: string[];
    descricao: string;
    horario: string;
    status?: string;
    created_at?: string;
}

export interface Student {
    id?: string;
    nome: string;
    ra: string;
    turma: string;
}
