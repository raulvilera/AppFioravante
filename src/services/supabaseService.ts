import { supabase } from './supabaseClient';
import { Incident, Student } from '../types';

// ─── ALUNOS ──────────────────────────────────────────────────────────────────

export const fetchTurmasFromDB = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('students')
        .select('turma')
        .order('turma');

    if (error) {
        console.error('[Fioravante] Erro ao buscar turmas:', error.message);
        return [];
    }

    const turmas = [...new Set((data || []).map((r: any) => r.turma as string))].sort();
    return turmas;
};

export const fetchAlunosByTurmaDB = async (turma: string): Promise<Student[]> => {
    const { data, error } = await supabase
        .from('students')
        .select('id, nome, ra, turma')
        .eq('turma', turma)
        .order('nome');

    if (error) {
        console.error('[Fioravante] Erro ao buscar alunos:', error.message);
        return [];
    }

    return (data || []) as Student[];
};

// ─── OCORRÊNCIAS ─────────────────────────────────────────────────────────────

export const saveIncidentToDB = async (incident: Incident): Promise<boolean> => {
    const { error } = await supabase.from('incidents').insert([{
        data: incident.data,
        professor: incident.professor,
        turma: incident.turma,
        aluno: incident.aluno,
        ra: incident.ra,
        disciplina: incident.disciplina,
        irregularidades: incident.irregularidades,
        descricao: incident.descricao,
        horario: incident.horario,
        status: 'PENDENTE',
    }]);

    if (error) {
        console.error('[Fioravante] Erro ao salvar ocorrência:', error.message);
        return false;
    }

    return true;
};

export const fetchAllIncidents = async (): Promise<Incident[]> => {
    const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Fioravante] Erro ao buscar ocorrências:', error.message);
        return [];
    }

    return (data || []) as Incident[];
};

export const updateIncidentStatus = async (id: string, status: string): Promise<boolean> => {
    const { error } = await supabase
        .from('incidents')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('[Fioravante] Erro ao atualizar status:', error.message);
        return false;
    }

    return true;
};

// ─── ROLE ─────────────────────────────────────────────────────────────────────

export const fetchRoleFromDB = async (email: string): Promise<string | null> => {
    const lower = email.toLowerCase().trim();
    const emailBase = lower.split('@')[0];

    const { data, error } = await supabase
        .from('authorized_professors')
        .select('role')
        .or(`email.eq.${lower},email.eq.${emailBase}@prof.educacao.sp.gov.br,email.eq.${emailBase}@professor.educacao.sp.gov.br`)
        .maybeSingle();

    if (error || !data) return null;
    return (data as any).role ?? null;
};
