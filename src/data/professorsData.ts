export interface ProfessorData {
    nome: string;
    emails: string[];
}

export const FIXED_GESTAO_EMAILS = [
    'cadastroslkm@gmail.com',
    'vilera@prof.educacao.sp.gov.br',
    'patricia.alexandre1@educacao.sp.gov.br',
    'patricia.alexandre1@servidor.educacao.sp.gov.br',
];

export const LISTA_PROFESSORES: ProfessorData[] = [
    { nome: "ALEXANDRE OLIVEIRA DOS SANTOS", emails: ["alexandreos@professor.educacao.sp.gov.br", "alexandreos@prof.educacao.sp.gov.br"] },
    { nome: "ANA CAROLINA POLITO PINHEIRO", emails: ["anapolito@professor.educacao.sp.gov.br", "anapolito@prof.educacao.sp.gov.br"] },
    { nome: "ANA PAULA DE SANTANA SANTOS", emails: ["anasantos51@professor.educacao.sp.gov.br", "anasantos51@prof.educacao.sp.gov.br"] },
    { nome: "ANIELI SOFIA RODRIGUES DA SILVA", emails: ["anielisilva@professor.educacao.sp.gov.br", "anielisilva@prof.educacao.sp.gov.br"] },
    { nome: "BRUNA NICOLE FERREIRA SANTOS", emails: ["brunanicole@professor.educacao.sp.gov.br", "brunanicole@prof.educacao.sp.gov.br"] },
    { nome: "CAMILA COSTA MONTEIRO ROSSI", emails: ["camilacostamonteiro@professor.educacao.sp.gov.br", "camilacostamonteiro@prof.educacao.sp.gov.br"] },
    { nome: "CAROLINA MARIA DUARTE", emails: ["carolinamduarte@professor.educacao.sp.gov.br", "carolinamduarte@prof.educacao.sp.gov.br"] },
    { nome: "CINTIA BERNADETE FERRAZ MATAVELLI", emails: ["cintiabernadete@professor.educacao.sp.gov.br", "cintiabernadete@prof.educacao.sp.gov.br"] },
    { nome: "CLARINETE HELENA ALVES DA SILVA", emails: ["clarinetesilva@professor.educacao.sp.gov.br", "clarinetesilva@prof.educacao.sp.gov.br"] },
    { nome: "DENISE SALVATIERRA ROMAO", emails: ["denisesalvatierra@professor.educacao.sp.gov.br", "denisesalvatierra@prof.educacao.sp.gov.br"] },
    { nome: "EDVANIA BEZERRA BARROS", emails: ["edvaniabarros@professor.educacao.sp.gov.br", "edvaniabarros@prof.educacao.sp.gov.br"] },
    { nome: "ELLEN MEIRE MARIANO DE SOUSA REIS", emails: ["ellenmeire@professor.educacao.sp.gov.br", "ellenmeire@prof.educacao.sp.gov.br"] },
    { nome: "GISELE SALVIATO CARNEIRO SINCIC", emails: ["giselesalviato@professor.educacao.sp.gov.br", "giselesalviato@prof.educacao.sp.gov.br"] },
    { nome: "GISLENE CABRERA", emails: ["gcabrera@professor.educacao.sp.gov.br", "gcabrera@prof.educacao.sp.gov.br"] },
    { nome: "IARA VIEIRA LIMA", emails: ["iaravlima@professor.educacao.sp.gov.br", "iaravlima@prof.educacao.sp.gov.br"] },
    { nome: "ITAMARA SANTANA DE OLIVEIRA", emails: ["itamaras@professor.educacao.sp.gov.br", "itamaras@prof.educacao.sp.gov.br"] },
    { nome: "JANETE GALDINO DOS SANTOS SOUZA", emails: ["janeteg@professor.educacao.sp.gov.br", "janeteg@prof.educacao.sp.gov.br"] },
    { nome: "JOCELMA FERREIRA DOS SANTOS", emails: ["jocelma@professor.educacao.sp.gov.br", "jocelma@prof.educacao.sp.gov.br"] },
    { nome: "JOYCE MARILIA DA SILVA DIAS", emails: ["joycemarilia@professor.educacao.sp.gov.br", "joycemarilia@prof.educacao.sp.gov.br"] },
    { nome: "LAINE SA DE SOUZA CHAGAS", emails: ["lainechagas@professor.educacao.sp.gov.br", "lainechagas@prof.educacao.sp.gov.br"] },
    { nome: "LUIZ VIEIRA GOMES", emails: ["luizvieiragomes@professor.educacao.sp.gov.br", "luizvieiragomes@prof.educacao.sp.gov.br"] },
    { nome: "MARCIA BETIZ SATURNINO", emails: ["marciasaturnino@professor.educacao.sp.gov.br", "marciasaturnino@prof.educacao.sp.gov.br"] },
    { nome: "MARCIA RITA GOMEZ MALERBA", emails: ["marciagomez@professor.educacao.sp.gov.br", "marciagomez@prof.educacao.sp.gov.br"] },
    { nome: "MARIA ISABEL GOMES SANTANA FERNANDES", emails: ["isagomes@professor.educacao.sp.gov.br", "isagomes@prof.educacao.sp.gov.br"] },
    { nome: "MARIANA CAROLINA BOA VENTURA", emails: ["marianaventura@professor.educacao.sp.gov.br", "marianaventura@prof.educacao.sp.gov.br"] },
    { nome: "PATRICIA DE OLIVEIRA ALEXANDRE VILERA", emails: ["patricia.alexandre1@educacao.sp.gov.br", "patricia.alexandre1@servidor.educacao.sp.gov.br"] },
    { nome: "RAUL VILERA", emails: ["vilera@prof.educacao.sp.gov.br"] },
    { nome: "ROSILENE SANTANA ALVES SILVA", emails: ["rosilenesan@professor.educacao.sp.gov.br", "rosilenesan@prof.educacao.sp.gov.br"] },
    { nome: "ROSIRENE LEME BERALDI GOTTARDI", emails: ["rosirenel@professor.educacao.sp.gov.br", "rosirenel@prof.educacao.sp.gov.br"] },
    { nome: "VANESSA CATIANE DA SILVA PORTO", emails: ["vanessacatiane@professor.educacao.sp.gov.br", "vanessacatiane@prof.educacao.sp.gov.br"] },
    { nome: "VANESSA RODRIGUES DANTAS", emails: ["vanessardantas@professor.educacao.sp.gov.br", "vanessardantas@prof.educacao.sp.gov.br"] },
];

export const isProfessorRegistered = (email: string): boolean => {
    const lower = email.toLowerCase().trim();
    return LISTA_PROFESSORES.some(p => p.emails.some(e => e.toLowerCase() === lower))
        || FIXED_GESTAO_EMAILS.includes(lower);
};

export const getNomeProfessor = (email: string): string => {
    const lower = email.toLowerCase().trim();
    const found = LISTA_PROFESSORES.find(p => p.emails.some(e => e.toLowerCase() === lower));
    return found?.nome ?? email.split('@')[0].replace('.', ' ').toUpperCase();
};
