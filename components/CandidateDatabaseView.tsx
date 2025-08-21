import React, { useState, useMemo } from 'react';
import type { Candidate } from '../types';
import { PlusIcon, SearchIcon } from './icons';

interface CandidateRowProps {
    candidate: Candidate;
    onView: (candidate: Candidate) => void;
}

const CandidateRow: React.FC<CandidateRowProps> = ({ candidate, onView }) => {
    return (
        <tr onClick={() => onView(candidate)} className="hover:bg-slate-50 cursor-pointer">
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={candidate.avatarUrl} alt={candidate.name} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{candidate.name}</div>
                        <div className="text-sm text-slate-500">{candidate.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{candidate.role}</div>
                <div className="text-sm text-slate-500">{candidate.location}</div>
            </td>
            <td className="p-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {candidate.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {skill}
                        </span>
                    ))}
                    {candidate.skills.length > 4 && (
                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                            +{candidate.skills.length - 4}
                        </span>
                    )}
                </div>
            </td>
            <td className="p-4 whitespace-nowrap text-center text-sm text-slate-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${candidate.applications.length > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {candidate.applications.length}
                </span>
            </td>
        </tr>
    );
};

interface CandidateDatabaseViewProps {
    candidates: Candidate[];
    onViewCandidate: (candidate: Candidate) => void;
    onAddCandidate: () => void;
}

export const CandidateDatabaseView: React.FC<CandidateDatabaseViewProps> = ({ candidates, onViewCandidate, onAddCandidate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCandidates = useMemo(() => {
        if (!searchTerm) return candidates;
        const lowercasedFilter = searchTerm.toLowerCase();
        return candidates.filter(candidate =>
            candidate.name.toLowerCase().includes(lowercasedFilter) ||
            candidate.role.toLowerCase().includes(lowercasedFilter) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(lowercasedFilter))
        );
    }, [candidates, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Banco de Candidatos</h1>
                <button
                    onClick={onAddCandidate}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Adicionar Candidato
                </button>
            </div>
            
            <div className="relative mb-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nome, cargo ou habilidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-slate-300 py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cargo Atual</th>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Principais Habilidades</th>
                                <th scope="col" className="p-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Candidaturas</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredCandidates.map(candidate => (
                                <CandidateRow key={candidate.id} candidate={candidate} onView={onViewCandidate} />
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
             {filteredCandidates.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg mt-4">
                    <p className="text-slate-500">Nenhum candidato encontrado.</p>
                </div>
            )}
        </div>
    );
};