import React, { useState, useRef, useEffect } from 'react';
import type { JobRequisition, Candidate, PipelineStage, Recruiter, Department, Region } from '../types';
import { PIPELINE_STAGES } from '../constants';
import { ArrowLeftIcon, DotsVerticalIcon, PencilIcon, TrashIcon, UsersIcon, GlobeAltIcon, TagIcon, CalendarIcon } from './icons';
import { formatRelativeDate } from '../utils/date';

interface PipelineCandidateCardProps {
    candidate: Candidate;
    lastUpdateDate?: string;
    onView: (candidate: Candidate) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, candidateId: number) => void;
}

const PipelineCandidateCard: React.FC<PipelineCandidateCardProps> = ({ candidate, lastUpdateDate, onView, onDragStart }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, candidate.id)}
            onClick={() => onView(candidate)}
            className="bg-white p-3 rounded-md shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-400 mb-3 transition-all"
        >
            <div className="flex items-center space-x-3">
                <img src={candidate.avatarUrl} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-sm text-slate-800">{candidate.name}</p>
                    <p className="text-xs text-slate-500">{candidate.role}</p>
                </div>
            </div>
             {lastUpdateDate && (
                <div className="mt-2 pt-2 border-t border-slate-100 text-right">
                    <span className="text-xs text-slate-400 flex items-center justify-end">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {formatRelativeDate(lastUpdateDate)}
                    </span>
                </div>
            )}
        </div>
    );
};


interface PipelineColumnProps {
    stage: PipelineStage;
    candidates: { candidate: Candidate, lastUpdateDate?: string }[];
    onViewCandidate: (candidate: Candidate) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, candidateId: number) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, stage: PipelineStage) => void;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage, candidates, onViewCandidate, onDragStart, onDrop }) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-blue-50');
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-blue-50');
        onDrop(e, stage);
    }

    return (
        <div 
            className="w-64 md:w-72 flex-shrink-0"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="bg-slate-100 rounded-lg p-3 h-full transition-colors">
                <h3 className="font-semibold text-slate-600 mb-4 px-1 flex justify-between items-center">
                    <span>{stage}</span>
                    <span className="text-sm font-normal bg-slate-200 text-slate-500 rounded-full w-6 h-6 flex items-center justify-center">
                        {candidates.length}
                    </span>
                </h3>
                <div className="space-y-3">
                    {candidates.map(({ candidate, lastUpdateDate }) => (
                        <PipelineCandidateCard 
                            key={candidate.id} 
                            candidate={candidate} 
                            lastUpdateDate={lastUpdateDate}
                            onView={onViewCandidate}
                            onDragStart={onDragStart}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const ActionMenu: React.FC<{
    requisition: JobRequisition;
    onEdit: () => void;
    onToggleStatus: () => void;
    onDelete: () => void;
}> = ({ requisition, onEdit, onToggleStatus, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            >
                <DotsVerticalIcon className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                        <button onClick={() => handleAction(onEdit)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                             <PencilIcon className="w-4 h-4 mr-2" />
                            Editar Vaga
                        </button>
                        <button onClick={() => handleAction(onToggleStatus)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                           {requisition.status === 'Aberta' ? 'Fechar Vaga' : 'Reabrir Vaga'}
                        </button>
                        <button onClick={() => handleAction(onDelete)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Excluir Vaga
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface PipelineViewProps {
  requisition: JobRequisition;
  candidates: Candidate[];
  recruiter?: Recruiter;
  department?: Department;
  region?: Region;
  onUpdateCandidateStage: (candidateId: number, requisitionId: number, newStage: PipelineStage) => void;
  onViewCandidate: (candidate: Candidate) => void;
  onBack: () => void;
  onEditRequisition: (requisition: JobRequisition) => void;
  onToggleStatus: (id: number) => void;
  onDeleteRequisition: (id: number) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ requisition, candidates, recruiter, department, region, onUpdateCandidateStage, onViewCandidate, onBack, onEditRequisition, onToggleStatus, onDeleteRequisition }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidateId: number) => {
    e.dataTransfer.setData("candidateId", candidateId.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: PipelineStage) => {
    const candidateId = parseInt(e.dataTransfer.getData("candidateId"), 10);
    if (candidateId) {
        onUpdateCandidateStage(candidateId, requisition.id, newStage);
    }
  };
  
  const getCandidatesForStage = (stage: PipelineStage) => {
    return candidates
      .filter(c => {
        const application = c.applications.find(app => app.requisitionId === requisition.id);
        if (!application || application.history.length === 0) return false;
        const currentStage = application.history[application.history.length - 1].stage;
        return currentStage === stage;
      })
      .map(c => {
        const application = c.applications.find(app => app.requisitionId === requisition.id);
        const lastUpdateDate = application?.history[application.history.length - 1].date;
        return { candidate: c, lastUpdateDate };
      });
  };

  const priorityStyles = {
    'Baixa': 'bg-sky-100 text-sky-800',
    'Média': 'bg-yellow-100 text-yellow-800',
    'Alta': 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-6">
         <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Voltar para Vagas
        </button>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{requisition.title}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-500">
                    <span className="flex items-center"><UsersIcon className="w-4 h-4 mr-1.5"/>{recruiter?.name || 'N/A'}</span>
                    <span className="flex items-center font-medium">{department?.name || 'N/A'}</span>
                    <span className="flex items-center"><GlobeAltIcon className="w-4 h-4 mr-1.5"/>{region?.name || 'N/A'}</span>
                    <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[requisition.priority]}`}>
                      <TagIcon className="w-3 h-3 mr-1"/> {requisition.priority}
                    </span>
                     <span className="font-medium text-slate-600">{requisition.reason}</span>
                </div>
            </div>
            <ActionMenu 
                requisition={requisition}
                onEdit={() => onEditRequisition(requisition)}
                onToggleStatus={() => onToggleStatus(requisition.id)}
                onDelete={() => onDeleteRequisition(requisition.id)}
            />
        </div>
      </div>

      <div className="flex-1 flex space-x-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map(stage => (
          <PipelineColumn 
            key={stage}
            stage={stage}
            candidates={getCandidatesForStage(stage)}
            onViewCandidate={onViewCandidate}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};