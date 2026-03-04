/**
 * Normaliza o nome da turma vindo de diferentes fontes (Supabase, Sheets, Local)
 * Padroniza para "6ºAno A" ou "1ª Série A"
 */
export const normalizeClassName = (raw: string): string => {
    if (!raw || raw === '---') return '---';

    // Limpeza inicial e remoção de termos de desconsideração
    let s = raw.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[º°ª]/g, "")           // Remove ordinais
        .replace(/\(DESCONSIDERA.*\)/g, "") // Remove (desconsidera) ou (desconsidere)
        .replace(/\s+/g, " ")            // Remove espaços duplos
        .trim();

    // Correções de typos específicos
    if (s.includes("3 SEIE")) s = s.replace("3 SEIE", "3 SERIE");
    if (s.includes("2 SEROIE")) s = s.replace("2 SEROIE", "2 SERIE");
    if (s.includes("1 SR")) s = s.replace("1 SR", "1 SERIE");

    // Regex aprimorada: captura número, tipo (ANO/SERIE/EM) e letra final (A-H)
    const match = s.match(/^(\d+)\s*(ANO|SERIE|EM|SERIE)?\s*([A-H])?$/);

    if (match) {
        const num = match[1];
        let type = match[2] || (parseInt(num) <= 3 ? 'SERIE' : 'ANO');
        if (type === 'EM') type = 'SERIE';
        const letter = match[3] || '';

        // Regra: 1-3 SERIE -> Xª Série Y
        if (num === '1' || num === '2' || num === '3') {
            return `${num}ª Série ${letter}`.trim();
        }
        // Regra: 6-9 ANO -> XºAno Y
        return `${num}ºAno ${letter}`.trim();
    }

    // Fallback: Retorna o original se fugir do padrão
    return raw.trim();
};
