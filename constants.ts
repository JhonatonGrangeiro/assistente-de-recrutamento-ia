import type { Candidate, JobRequisition, PipelineStage, Recruiter, Region, Department, Source } from './types';

export const PIPELINE_STAGES: PipelineStage[] = ['Candidatou-se', 'Triagem', 'Entrevista', 'Oferta', 'Contratado', 'Rejeitado'];

const today = new Date();
const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_RECRUITERS: Recruiter[] = [
  { id: 1, name: 'Ana Costa' },
  { id: 2, name: 'Bruno Gomes' },
  { id: 3, name: 'Carla Dias' },
];

export const MOCK_REGIONS: Region[] = [
  { id: 1, name: 'Remoto' },
  { id: 2, name: 'Nova York, NY' },
  { id: 3, name: 'São Paulo, SP' },
  { id: 4, name: 'Global' },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 1, name: 'Engenharia de Software' },
  { id: 2, name: 'Gestão de Produtos' },
  { id: 3, name: 'Business Intelligence' },
  { id: 4, name: 'Design UX/UI' },
];

export const MOCK_SOURCES: Source[] = [
    { id: 1, name: 'Anúncio de Vaga' },
    { id: 2, name: 'Indicação' },
    { id: 3, name: 'Anúncio Externo' },
    { id: 4, name: 'Banco de Talentos' },
    { id: 5, name: 'LinkedIn' },
];

export const MOCK_REQUISITIONS: JobRequisition[] = [
  {
    id: 1,
    title: 'Desenvolvedor Frontend Sênior (React)',
    departmentId: 1,
    regionId: 1,
    recruiterId: 1,
    priority: 'Alta',
    reason: 'Substituição',
    status: 'Aberta',
    createdAt: daysAgo(45),
    description: `Estamos procurando um Desenvolvedor Frontend Sênior experiente para se juntar à nossa equipe dinâmica. O candidato ideal terá vasta experiência com React, TypeScript e tecnologias de frontend modernas. Você será responsável por construir e manter nossas aplicações voltadas para o usuário, colaborar com designers e gerentes de produto para criar experiências de usuário perfeitas e orientar desenvolvedores juniores. As principais responsabilidades incluem arquitetar componentes de UI complexos, otimizar o desempenho da aplicação e garantir que nosso código seja escalável e de fácil manutenção. Experiência com GraphQL e Next.js é um grande diferencial.`
  },
  {
    id: 2,
    title: 'Gerente de Produto Principal - SaaS B2B',
    departmentId: 2,
    regionId: 2,
    recruiterId: 2,
    priority: 'Média',
    reason: 'Implantação',
    status: 'Aberta',
    createdAt: daysAgo(30),
    description: `Buscamos um Gerente de Produto Principal experiente para conduzir a estratégia e execução de nossa principal plataforma SaaS B2B. Você será dono do roadmap do produto, definirá os requisitos das funcionalidades e trabalhará em estreita colaboração com engenharia, design e marketing para lançar produtos impactantes. O candidato ideal tem um profundo entendimento do mercado de SaaS B2B, excelentes habilidades de comunicação e um histórico comprovado de lançamento de produtos de sucesso. Você será responsável por realizar pesquisas de mercado, analisar dados de usuários e definir a visão do produto que se alinha com nossos objetivos de negócios.`
  },
  {
    id: 3,
    title: 'Analista de Dados Pleno',
    departmentId: 3,
    regionId: 3,
    recruiterId: 1,
    priority: 'Baixa',
    reason: 'Temporária',
    status: 'Fechada',
    createdAt: daysAgo(90),
    closedAt: daysAgo(25),
    description: 'Procuramos um analista de dados para extrair insights e apoiar a tomada de decisão. Requer conhecimento em SQL, Python e ferramentas de BI como Tableau ou PowerBI.'
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: 'Isabella Rossi',
    role: 'Desenvolvedora Frontend Sênior',
    location: 'São Francisco, CA',
    email: 'isabella.rossi@example.com',
    phone: '555-0101',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    sourceId: 1,
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS', 'Figma'],
    experience: [
      {
        role: 'Desenvolvedora Frontend Líder',
        company: 'Innovate Inc.',
        period: '2020 - Presente',
        description: 'Liderei o desenvolvimento de um novo painel de análise voltado para o cliente usando React e TypeScript. Orientei desenvolvedores juniores e melhorei a qualidade do código em 30%.'
      },
      {
        role: 'Desenvolvedora Frontend',
        company: 'Solutions Co.',
        period: '2017 - 2020',
        description: 'Desenvolvi e mantive componentes para uma plataforma de e-commerce de grande escala. Colaborei com designers de UI/UX para implementar designs com precisão de pixel.'
      }
    ],
    education: [
      {
        degree: 'Bacharelado em Ciência da Computação',
        institution: 'Universidade da Califórnia, Berkeley',
        period: '2013 - 2017'
      }
    ],
    resume: `Isabella Rossi - Desenvolvedora Frontend Sênior. Vasta experiência em tecnologias web modernas, incluindo React, TypeScript e Next.js. Histórico comprovado de liderança de equipes e entrega de aplicações escaláveis e de alta qualidade.`,
    applications: [{ 
      requisitionId: 1, 
      history: [
        { stage: 'Candidatou-se', date: daysAgo(20) },
        { stage: 'Triagem', date: daysAgo(18) },
      ]
    }],
  },
  {
    id: 2,
    name: 'Liam Chen',
    role: 'Gerente de Produto',
    location: 'Nova York, NY',
    email: 'liam.chen@example.com',
    phone: '555-0102',
    avatarUrl: 'https://i.pravatar.cc/150?img=60',
    sourceId: 2,
    skills: ['Estratégia de Produto', 'Metodologias Ágeis', 'Pesquisa de Usuário', 'Planejamento de Roadmap', 'Jira'],
    experience: [/* ... */],
    education: [/* ... */],
    resume: `Liam Chen - Gerente de Produto com foco em SaaS B2B. Habilidoso em análise de mercado, gerenciamento do ciclo de vida do produto e liderança de equipes multifuncionais.`,
    applications: [{ 
      requisitionId: 2, 
      history: [
        { stage: 'Candidatou-se', date: daysAgo(25) },
        { stage: 'Triagem', date: daysAgo(22) },
        { stage: 'Entrevista', date: daysAgo(15) },
      ]
    }],
  },
  {
    id: 3,
    name: 'Aisha Khan',
    role: 'Designer UX/UI',
    location: 'Austin, TX',
    email: 'aisha.khan@example.com',
    phone: '555-0103',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    sourceId: 3,
    skills: ['Pesquisa de Usuário', 'Wireframing', 'Prototipagem', 'Figma', 'Adobe XD', 'Sistemas de Design'],
    experience: [/* ... */],
    education: [/* ... */],
    resume: `Aisha Khan - Designer UX/UI criativa, dedicada a construir experiências digitais intuitivas e centradas no usuário.`,
    applications: [{ 
      requisitionId: 1, 
      history: [
         { stage: 'Candidatou-se', date: daysAgo(30) }
      ]
    }],
  },
  {
    id: 4,
    name: 'David Lee',
    role: 'Desenvolvedor Frontend',
    location: 'Boston, MA',
    email: 'david.lee@example.com',
    phone: '555-0104',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    sourceId: 1,
    skills: ['React', 'JavaScript', 'CSS', 'Redux'],
    experience: [/* ... */],
    education: [/* ... */],
    resume: `David Lee - Desenvolvedor Frontend apaixonado por construir aplicações web responsivas e de alto desempenho.`,
    applications: [
        { 
          requisitionId: 1, 
          history: [
            { stage: 'Candidatou-se', date: daysAgo(40) }
          ] 
        },
        { 
          requisitionId: 2, 
          history: [
            { stage: 'Candidatou-se', date: daysAgo(28) },
            { stage: 'Rejeitado', date: daysAgo(26) }
          ] 
        }
    ],
  },
   {
    id: 5,
    name: 'Sophia Martinez',
    role: 'Gerente de Produto Sênior',
    location: 'Chicago, IL',
    email: 'sophia.martinez@example.com',
    phone: '555-0105',
    avatarUrl: 'https://i.pravatar.cc/150?img=40',
    sourceId: 4,
    skills: ['Estratégia de Go-to-Market', 'Análise de Dados', 'SaaS'],
    experience: [/* ... */],
    education: [/* ... */],
    resume: `Sophia Martinez - Gerente de Produto Sênior orientada a dados, com expertise em estratégias de go-to-market para produtos SaaS.`,
    applications: [{ 
      requisitionId: 2, 
      history: [
         { stage: 'Candidatou-se', date: daysAgo(10) },
         { stage: 'Triagem', date: daysAgo(8) },
      ]
    }],
  },
  {
    id: 6,
    name: 'Kenji Tanaka',
    role: 'Desenvolvedor Backend',
    location: 'Seattle, WA',
    email: 'kenji.tanaka@example.com',
    phone: '555-0106',
    avatarUrl: 'https://i.pravatar.cc/150?img=51',
    sourceId: 4,
    skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
     experience: [/* ... */],
    education: [/* ... */],
    resume: `Kenji Tanaka - Desenvolvedor Backend com forte experiência na construção de microsserviços escaláveis e resilientes.`,
    applications: [],
  },
  {
    id: 7,
    name: 'Maria Silva',
    role: 'Analista de Dados',
    location: 'São Paulo, SP',
    email: 'maria.silva@example.com',
    phone: '555-0107',
    avatarUrl: 'https://i.pravatar.cc/150?img=45',
    sourceId: 1,
    skills: ['SQL', 'Python', 'Tableau', 'Pandas'],
    experience: [/* ... */],
    education: [/* ... */],
    resume: 'Maria Silva - Analista de Dados com 3 anos de experiência em análise de negócios e visualização de dados.',
    applications: [{
      requisitionId: 3,
      history: [
        { stage: 'Candidatou-se', date: daysAgo(80) },
        { stage: 'Triagem', date: daysAgo(75) },
        { stage: 'Entrevista', date: daysAgo(60) },
        { stage: 'Oferta', date: daysAgo(40) },
        { stage: 'Contratado', date: daysAgo(35) },
      ]
    }]
  }
];