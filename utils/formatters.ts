/**
 * Normaliza o nome da turma vindo de diferentes fontes (Supabase, Sheets, Local)
 * Padroniza para "6ºAno A" ou "1ª Série A"
 */
export const normalizeClassName = (raw: string): string => {
    if (!raw || raw === '---') return '---';

    // Limpeza inicial
    let s = raw.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[º°ª]/g, "")           // Remove ordinais
        .replace(/\s+/g, " ")            // Remove espaços duplos
        .trim();

    // Regex aprimorada: captura número, tipo (ANO/SERIE/EM) e letra final (A-H)
    // Exemplos suportados: "7ANO E", "7 ANO E", "7ANOE", "6SERIE C", "1EM A"
    const match = s.match(/^(\d+)\s*(ANO|SERIE|EM)?\s*([A-H])?$/);

    if (match) {
        const num = match[1];
        const type = match[2] || (parseInt(num) <= 3 ? 'SERIE' : 'ANO'); // Heurística se faltar o tipo
        const letter = match[3] || '';

        // Regra: 1-3 EM/SERIE -> Xª Série Y
        if ((num === '1' || num === '2' || num === '3') && (type === 'SERIE' || type === 'EM')) {
            return `${num}ª Série ${letter}`.trim();
        }
        // Regra: 6-9 ANO -> XºAno Y
        return `${num}ºAno ${letter}`.trim();
    }

    // Fallback: Retorna o original se fugir do padrão
    return raw.trim();
};
