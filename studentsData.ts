/**
 * studentsData.ts — EE Fioravante Iervolino
 * Os alunos são carregados dinamicamente da planilha Google Sheets:
 * ID: 1I2e7NexDqkZZ6Pc6fEQ6QTJCdY2xGgo_SicORFv4zGI
 * Aba: BANCODEDADOSGERAL
 *
 * Turmas: 1ºA, 1ºB, 1ºC, 1ºD, 2ºA, 2ºB, 2ºC, 3ºA, 3ºB, 3ºC,
 *         4ºA, 4ºB, 4ºC, 5ºA, 5ºB,
 *         AEE D TARDE TEA, AEE E TARDE TEA, AEE F TARDE TEA
 */

export interface Student {
  nome: string;
  ra: string;
  turma: string;
}

// Fallback vazio — dados reais vêm do Google Sheets (BANCODEDADOSGERAL)
export const STUDENTS_DB: Student[] = [];
