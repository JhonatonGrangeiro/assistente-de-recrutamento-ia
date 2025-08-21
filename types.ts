export type PipelineStage = 'Candidatou-se' | 'Triagem' | 'Entrevista' | 'Oferta' | 'Contratado' | 'Rejeitado';

export type RequisitionPriority = 'Baixa' | 'Média' | 'Alta';
export type RequisitionReason = 'Implantação' | 'Substituição' | 'Temporária';

export interface Recruiter {
  id: number;
  name: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Source {
  id: number;
  name: string;
}

export interface JobRequisition {
  id: number;
  title: string;
  departmentId: number;
  regionId: number;
  recruiterId: number;
  priority: RequisitionPriority;
  reason: RequisitionReason;
  status: 'Aberta' | 'Fechada' | 'Em Espera';
  description: string;
  createdAt: string; // ISO Date String
  closedAt?: string; // ISO Date String
}

export interface Application {
  requisitionId: number;
  history: {
    stage: PipelineStage;
    date: string; // ISO Date String
  }[];
}

export interface Candidate {
  id: number;
  name: string;
  role: string;
  location:string;
  email: string;
  phone: string;
  avatarUrl: string;
  sourceId: number;
  skills: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
  }[];
  resume: string;
  applications: Application[];
}

export interface AIAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
  fitScore: number;
}