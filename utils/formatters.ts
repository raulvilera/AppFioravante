/**
 * Normaliza o nome da turma vindo de diferentes fontes (Supabase, Sheets, Local)
 * Para EE Fioravante Iervolino: 1ºA, 1ºB, 2ºA ... 5ºB, AEE D TARDE TEA, etc.
 */
export const normalizeClassName = (raw: string): string => {
    if (!raw || raw === '---') return '---';

    let s = raw.trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\(DESCONSIDER.*\)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Turmas AEE — preservar como estão (ex: "AEE D TARDE TEA")
    if (/^AEE/i.test(s)) {
        return s.toUpperCase().trim();
    }

    // Captura padrão: número + letra (ex: "1A", "1 A", "1ºA", "1º A", "1ª A")
    const match = s.match(/^(\d+)\s*[oOaAºª°]?\s*([A-Za-z])$/);
    if (match) {
        return `${match[1]}º${match[2].toUpperCase()}`;
    }

    // Já no formato correto (ex: "1ºA")
    const alreadyFormatted = raw.match(/^(\d+)[º°ª]\s*([A-Za-z])$/);
    if (alreadyFormatted) {
        return `${alreadyFormatted[1]}º${alreadyFormatted[2].toUpperCase()}`;
    }

    return raw.trim();
};
