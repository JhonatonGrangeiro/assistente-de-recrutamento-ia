import React, { useState, useRef, useEffect } from 'react';
import type { JobRequisition, Candidate, Department, Region } from '../types';
import { LocationMarkerIcon, UsersIcon, PlusIcon, DotsVerticalIcon, PencilIcon, TrashIcon, TagIcon, CalendarIcon } from './icons';
import { formatRelativeDate } from '../utils/date';

interface ActionMenuProps {
    requisition: JobRequisition;
    onEdit: () => void;
    onToggleStatus: () => void;
    onDelete: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ requisition, onEdit, onToggleStatus, onDelete }) => {
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
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <button onClick={() => handleAction(onEdit)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Editar
                        </button>
                        <button onClick={() => handleAction(onToggleStatus)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                            {requisition.status === 'Aberta' ? 'Fechar Vaga' : 'Reabrir Vaga'}
                        </button>
                         <button onClick={() => handleAction(onDelete)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Excluir
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface JobRequisitionCardProps {
    requisition: JobRequisition;
    department?: Department;
    region?: Region;
    candidateCount: number;
    onSelect: () => void;
    onEdit: () => void;
    onToggleStatus: () => void;
    onDelete: () => void;
}

const JobRequisitionCard: React.FC<JobRequisitionCardProps> = ({ requisition, department, region, candidateCount, onSelect, onEdit, onToggleStatus, onDelete }) => {
    const priorityStyles = {
        'Baixa': 'text-sky-600',
        'Média': 'text-yellow-600',
        'Alta': 'text-red-600',
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col justify-between">
            <div>
                <div 
                    onClick={onSelect} 
                    className="cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-blue-600">{requisition.title}</h3>
                            <p className="text-sm text-slate-600">{department?.name || 'N/A'}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${requisition.status === 'Aberta' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                            {requisition.status}
                        </span>
                    </div>
                </div>
                 <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                     <span title={`Prioridade: ${requisition.priority}`} className={`flex items-center ${priorityStyles[requisition.priority]}`}>
                        <TagIcon className="w-4 h-4 mr-1.5" />
                        {requisition.priority}
                    </span>
                    <span className="flex items-center">
                        <LocationMarkerIcon className="w-4 h-4 mr-1.5" />
                        {region?.name || 'N/A'}
                    </span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                 <div className="flex items-center space-x-4">
                     <span className="flex items-center font-medium">
                        <UsersIcon className="w-4 h-4 mr-1.5" />
                        {candidateCount} {candidateCount === 1 ? 'Candidato' : 'Candidatos'}
                    </span>
                    <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        {requisition.status === 'Aberta' ? `Aberta ${formatRelativeDate(requisition.createdAt)}` : `Fechada ${formatRelativeDate(requisition.closedAt)}`}
                    </span>
                </div>
                <div onClick={e => e.stopPropagation()}>
                    <ActionMenu 
                        requisition={requisition}
                        onEdit={onEdit} 
                        onToggleStatus={onToggleStatus} 
                        onDelete={onDelete} 
                    />
                </div>
            </div>
        </div>
    );
};


interface JobRequisitionListProps {
  requisitions: JobRequisition[];
  candidates: Candidate[];
  departments: Department[];
  regions: Region[];
  onSelectRequisition: (id: number) => void;
  onAddRequisition: () => void;
  onEditRequisition: (requisition: JobRequisition) => void;
  onToggleStatus: (id: number) => void;
  onDeleteRequisition: (id: number) => void;
}

export const JobRequisitionList: React.FC<JobRequisitionListProps> = ({ requisitions, candidates, departments, regions, onSelectRequisition, onAddRequisition, onEditRequisition, onToggleStatus, onDeleteRequisition }) => {
  const getCandidateCount = (requisitionId: number) => {
    return candidates.reduce((count, candidate) => {
      if (candidate.applications.some(app => app.requisitionId === requisitionId)) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Vagas Abertas</h1>
             <button
                onClick={onAddRequisition}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
                <PlusIcon className="w-5 h-5 mr-2"/>
                Nova Vaga
            </button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requisitions.map(req => (
            <JobRequisitionCard 
                key={req.id} 
                requisition={req}
                department={departments.find(d => d.id === req.departmentId)}
                region={regions.find(r => r.id === req.regionId)}
                candidateCount={getCandidateCount(req.id)}
                onSelect={() => onSelectRequisition(req.id)}
                onEdit={() => onEditRequisition(req)}
                onToggleStatus={() => onToggleStatus(req.id)}
                onDelete={() => onDeleteRequisition(req.id)}
            />
            ))}
      </div>
    </div>
  );
};