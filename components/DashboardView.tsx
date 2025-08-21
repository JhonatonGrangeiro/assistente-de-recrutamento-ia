import React from 'react';
import type { Candidate, JobRequisition, Recruiter, Source } from '../types';
import { 
    getAverageTimeToHire, 
    getCandidateSourceDistribution,
    getRequisitionsCountByPeriod,
    getActiveCandidateFunnel,
    getOpenRequisitionsByRecruiter,
    getCandidatesPerRequisition,
    calculateDaysSince
} from '../services/analyticsService';
import { BriefcaseIcon, CheckCircleIcon, UsersIcon, ClockIcon, ExclamationIcon } from './icons';

interface DashboardViewProps {
    requisitions: JobRequisition[];
    candidates: Candidate[];
    recruiters: Recruiter[];
    sources: Source[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: Record<string, number>; title: string, unit: string }> = ({ data, title, unit }) => {
    const maxValue = Math.max(...Object.values(data), 1); // Avoid division by zero
    const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {sortedData.map(([label, value]) => (
                    <div key={label} className="flex items-center">
                        <p className="w-1/3 text-sm text-slate-600 truncate" title={label}>{label}</p>
                        <div className="w-2/3 bg-slate-100 rounded-full h-6">
                            <div
                                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                                style={{ width: `${(value / maxValue) * 100}%` }}
                            >
                                <span className="text-xs font-medium text-white">{value} {unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {sortedData.length === 0 && <p className="text-sm text-slate-500">Dados insuficientes.</p>}
            </div>
        </div>
    );
};

const SlaTable: React.FC<{ 
    requisitions: JobRequisition[]; 
    recruiters: Recruiter[]; 
    candidatesPerReq: Record<number, number>;
}> = ({ requisitions, recruiters, candidatesPerReq }) => {
    const openRequisitions = requisitions.filter(r => r.status === 'Aberta');
    const SLA_DAYS = 30;
    const WARNING_DAYS = 25;

    const getSlaStatus = (daysOpen: number) => {
        if (daysOpen > SLA_DAYS) return { text: 'Atrasada', color: 'text-red-600 bg-red-100', icon: <ExclamationIcon className="w-4 h-4 text-red-600"/> };
        if (daysOpen >= WARNING_DAYS) return { text: 'Atenção', color: 'text-yellow-600 bg-yellow-100', icon: <ClockIcon className="w-4 h-4 text-yellow-600"/>};
        return { text: 'No Prazo', color: 'text-green-600 bg-green-100', icon: <CheckCircleIcon className="w-4 h-4 text-green-600"/>};
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Visão Geral do SLA de Vagas (Prazo: 30 dias)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Vaga</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Recrutador</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Candidatos</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Dias em Aberto</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status SLA</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {openRequisitions.map(req => {
                            const daysOpen = calculateDaysSince(req.createdAt);
                            const status = getSlaStatus(daysOpen);
                            const recruiter = recruiters.find(r => r.id === req.recruiterId)?.name || 'N/A';
                            return (
                                <tr key={req.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">{req.title}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{recruiter}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 text-center">{candidatesPerReq[req.id] || 0}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 text-center">{daysOpen}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                            {status.icon}
                                            {status.text}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {openRequisitions.length === 0 && <p className="text-center py-6 text-sm text-slate-500">Nenhuma vaga aberta no momento.</p>}
            </div>
        </div>
    );
};


export const DashboardView: React.FC<DashboardViewProps> = ({ requisitions, candidates, recruiters, sources }) => {
    const avgTimeToHire = getAverageTimeToHire(requisitions);
    const sourceDistribution = getCandidateSourceDistribution(candidates, sources);
    const funnel = getActiveCandidateFunnel(requisitions, candidates);
    const openRequisitionsByRecruiter = getOpenRequisitionsByRecruiter(requisitions, recruiters);
    const candidatesPerReq = getCandidatesPerRequisition(requisitions, candidates);

    const openRequisitionsTotal = requisitions.filter(r => r.status === 'Aberta').length;
    const openLastWeek = getRequisitionsCountByPeriod(requisitions, 7, 'Aberta');
    const openLastMonth = getRequisitionsCountByPeriod(requisitions, 30, 'Aberta');
    const closedLastWeek = getRequisitionsCountByPeriod(requisitions, 7, 'Fechada');
    const closedLastMonth = getRequisitionsCountByPeriod(requisitions, 30, 'Fechada');
    
    // Do not show rejected or hired on the funnel chart
    const { 'Rejeitado': rejected, 'Contratado': hired, ...relevantFunnel } = funnel;


    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Dashboards de Recrutamento</h1>
                <p className="mt-1 text-slate-500">Análise do desempenho do seu processo seletivo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                 <StatCard title="Vagas Abertas" value={openRequisitionsTotal} icon={<BriefcaseIcon className="w-6 h-6"/>} />
                 <StatCard title="Abertas (7d)" value={openLastWeek} icon={<BriefcaseIcon className="w-6 h-6"/>} />
                 <StatCard title="Abertas (30d)" value={openLastMonth} icon={<BriefcaseIcon className="w-6 h-6"/>} />
                 <StatCard title="Fechadas (7d)" value={closedLastWeek} icon={<CheckCircleIcon className="w-6 h-6"/>} />
                 <StatCard title="Fechadas (30d)" value={closedLastMonth} icon={<CheckCircleIcon className="w-6 h-6"/>} />
                 <StatCard title="Tempo Médio Contratação" value={avgTimeToHire ? `${avgTimeToHire}d` : 'N/A'} icon={<ClockIcon className="w-6 h-6"/>} />
            </div>

            <div>
                <SlaTable requisitions={requisitions} recruiters={recruiters} candidatesPerReq={candidatesPerReq}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <BarChart data={relevantFunnel} title="Funil de Candidatos Ativos" unit="cand." />
                 <BarChart data={openRequisitionsByRecruiter} title="Vagas por Gerente de Negócio" unit="vagas" />
                 <BarChart data={sourceDistribution} title="Origem dos Candidatos" unit="cand." />
            </div>
        </div>
    );
};