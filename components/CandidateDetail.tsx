import React, { useState } from 'react';
import type { Candidate, JobRequisition, Department, Region } from '../types';
import { AIAssistant } from './AIAssistant';
import { MailIcon, PhoneIcon, LocationMarkerIcon, PlusIcon, PencilIcon, TrashIcon, CalendarIcon } from './icons';
import { formatRelativeDate } from '../utils/date';

interface CandidateDetailProps {
  candidate: Candidate;
  jobDescription: string;
  requisitions: JobRequisition[];
  departments: Department[];
  regions: Region[];
  onAssignToRequisition: (candidateId: number, requisitionId: number) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidateId: number) => void;
}

const DetailHeader: React.FC<{ 
    candidate: Candidate, 
    onEdit: () => void, 
    onDelete: () => void 
}> = ({ candidate, onEdit, onDelete }) => (
  <div className="flex-shrink-0 p-6 border-b border-slate-200 bg-white">
    <div className="flex justify-between items-start">
        <div className="flex items-start sm:items-center flex-col sm:flex-row">
            <img
            src={candidate.avatarUrl}
            alt={candidate.name}
            className="w-24 h-24 rounded-full object-cover mr-6 shadow-md mb-4 sm:mb-0"
            />
            <div>
            <h2 className="text-3xl font-bold text-slate-800">{candidate.name}</h2>
            <p className="text-lg text-blue-600 font-medium">{candidate.role}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">
                <span className="flex items-center"><LocationMarkerIcon className="w-4 h-4 mr-1.5"/>{candidate.location}</span>
                <span className="flex items-center"><MailIcon className="w-4 h-4 mr-1.5"/>{candidate.email}</span>
                <span className="flex items-center"><PhoneIcon className="w-4 h-4 mr-1.5"/>{candidate.phone}</span>
            </div>
            </div>
        </div>
         <div className="flex-shrink-0 flex items-center gap-2">
            <button onClick={onEdit} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800">
                <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={onDelete} className="p-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
  </div>
);

const DetailTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; hasAiContext: boolean }> = ({ activeTab, setActiveTab, hasAiContext }) => {
  const tabs = hasAiContext ? ['Assistente IA', 'Currículo', 'Detalhes'] : ['Currículo', 'Detalhes'];
  return (
    <div className="flex-shrink-0 border-b border-slate-200 bg-white sticky top-0 z-10">
      <nav className="flex space-x-6 px-6 -mb-px">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

const AssignToRequisition: React.FC<{
    candidate: Candidate;
    requisitions: JobRequisition[];
    onAssign: (requisitionId: number) => void;
}> = ({ candidate, requisitions, onAssign }) => {
    const [selectedReq, setSelectedReq] = useState('');
    const availableRequisitions = requisitions.filter(r => 
        !candidate.applications.some(app => app.requisitionId === r.id) && r.status === 'Aberta'
    );

    const handleAssign = () => {
        if (selectedReq) {
            onAssign(parseInt(selectedReq, 10));
            setSelectedReq('');
        }
    }

    if(availableRequisitions.length === 0) {
        return <p className="text-sm text-slate-500">O candidato foi considerado para todas as vagas abertas.</p>;
    }

    return (
        <div className="flex items-center gap-2">
            <select
                value={selectedReq}
                onChange={(e) => setSelectedReq(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
                <option value="" disabled>Selecione uma vaga...</option>
                {availableRequisitions.map(req => (
                    <option key={req.id} value={req.id}>{req.title}</option>
                ))}
            </select>
            <button 
                onClick={handleAssign}
                disabled={!selectedReq}
                className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400"
            >
                <PlusIcon className="w-4 h-4 mr-1.5"/>
                Designar
            </button>
        </div>
    );
};


const DetailsContent: React.FC<{ candidate: Candidate; requisitions: JobRequisition[]; departments: Department[], regions: Region[], onAssign: (requisitionId: number) => void; }> = ({ candidate, requisitions, departments, regions, onAssign }) => (
  <div className="p-6 space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Habilidades</h3>
      <div className="flex flex-wrap gap-2">
        {candidate.skills.map(skill => (
          <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
        ))}
      </div>
    </div>
    <div className="pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Designar para Vaga</h3>
        <AssignToRequisition candidate={candidate} requisitions={requisitions} onAssign={onAssign} />
    </div>
    <div className="pt-6 border-t border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Candidaturas Ativas</h3>
      {candidate.applications.length > 0 ? (
        <div className="space-y-4">
          {candidate.applications.map((app) => {
            const requisition = requisitions.find(r => r.id === app.requisitionId);
            const department = departments.find(d => d.id === requisition?.departmentId);
            const currentStage = app.history[app.history.length - 1];
            return (
              <div key={app.requisitionId} className="p-3 bg-slate-100 rounded-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-800">{requisition?.title || 'Vaga Desconhecida'}</p>
                        <p className="text-sm text-slate-500">{department?.name || 'Departamento Desconhecido'}</p>
                    </div>
                    <div className='text-right'>
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">{currentStage.stage}</span>
                        <p className="text-xs text-slate-400 mt-1">{formatRelativeDate(currentStage.date)}</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-500 mb-2">Histórico na Vaga:</h4>
                    <ul className="space-y-1">
                        {app.history.map((h, index) => (
                            <li key={index} className="flex justify-between items-center text-xs">
                                <span className="text-slate-600">{h.stage}</span>
                                <span className="text-slate-400">{formatRelativeDate(h.date)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Este candidato não está atualmente em nenhum pipeline ativo.</p>
      )}
    </div>
     <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Experiência Profissional</h3>
        <div className="space-y-4">
            {candidate.experience.map((exp, index) => (
            <div key={index} className="pl-4 border-l-2 border-slate-200">
                <p className="font-semibold text-slate-800">{exp.role}</p>
                <p className="text-sm text-slate-600">{exp.company}</p>
                <p className="text-xs text-slate-400 mb-1">{exp.period}</p>
                <p className="text-sm text-slate-500">{exp.description}</p>
            </div>
            ))}
        </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Formação Acadêmica</h3>
       <div className="space-y-4">
            {candidate.education.map((edu, index) => (
            <div key={index} className="pl-4 border-l-2 border-slate-200">
                <p className="font-semibold text-slate-800">{edu.degree}</p>
                <p className="text-sm text-slate-600">{edu.institution}</p>
                <p className="text-xs text-slate-400">{edu.period}</p>
            </div>
            ))}
        </div>
    </div>
  </div>
);

const ResumeContent: React.FC<{ resume: string }> = ({ resume }) => (
  <div className="p-6">
    <pre className="text-sm text-slate-600 whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-200 font-sans">
      {resume}
    </pre>
  </div>
);


export const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, jobDescription, requisitions, departments, regions, onAssignToRequisition, onEdit, onDelete }) => {
  const hasAiContext = !!jobDescription;
  const [activeTab, setActiveTab] = useState(hasAiContext ? 'Assistente IA' : 'Currículo');

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <DetailHeader 
        candidate={candidate} 
        onEdit={() => onEdit(candidate)} 
        onDelete={() => onDelete(candidate.id)} 
      />
      <DetailTabs activeTab={activeTab} setActiveTab={setActiveTab} hasAiContext={hasAiContext}/>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Assistente IA' && hasAiContext && <AIAssistant resume={candidate.resume} jobDescription={jobDescription} />}
        {activeTab === 'Currículo' && <ResumeContent resume={candidate.resume} />}
        {activeTab === 'Detalhes' && <DetailsContent candidate={candidate} requisitions={requisitions} departments={departments} regions={regions} onAssign={(reqId) => onAssignToRequisition(candidate.id, reqId)}/>}
      </div>
    </div>
  );
};