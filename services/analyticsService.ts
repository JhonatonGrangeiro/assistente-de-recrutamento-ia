import type { Candidate, JobRequisition, PipelineStage, Recruiter, Source } from '../types';
import { PIPELINE_STAGES } from '../constants';

const calculateDaysBetween = (dateStr1: string, dateStr2: string): number => {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateDaysSince = (isoDateString?: string): number => {
    if (!isoDateString) return 0;
    const date = new Date(isoDateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};


export const getAverageTimeToHire = (requisitions: JobRequisition[]): number | null => {
    const closedAndHiredRequisitions = requisitions.filter(r => r.status === 'Fechada' && r.closedAt);

    if (closedAndHiredRequisitions.length === 0) return null;

    const totalDays = closedAndHiredRequisitions.reduce((sum, r) => {
        return sum + calculateDaysBetween(r.createdAt, r.closedAt!);
    }, 0);

    return Math.round(totalDays / closedAndHiredRequisitions.length);
};

export const getRequisitionsCountByPeriod = (requisitions: JobRequisition[], periodInDays: number, type: 'Aberta' | 'Fechada'): number => {
    const now = new Date();
    const periodStart = new Date(now.getTime() - periodInDays * 24 * 60 * 60 * 1000);

    return requisitions.filter(r => {
        if (type === 'Aberta') {
            const createdAt = new Date(r.createdAt);
            return r.status === 'Aberta' && createdAt >= periodStart;
        } else { // Fechada
            if (!r.closedAt) return false;
            const closedAt = new Date(r.closedAt);
            return r.status === 'Fechada' && closedAt >= periodStart;
        }
    }).length;
};


export const getCandidateSourceDistribution = (candidates: Candidate[], sources: Source[]): Record<string, number> => {
    const sourceMap = new Map(sources.map(s => [s.id, s.name]));
    const distribution: Record<string, number> = {};

    candidates.forEach(candidate => {
        const sourceName = sourceMap.get(candidate.sourceId);
        if (sourceName) {
            distribution[sourceName] = (distribution[sourceName] || 0) + 1;
        }
    });

    return distribution;
};

export const getActiveCandidateFunnel = (requisitions: JobRequisition[], candidates: Candidate[]): Record<PipelineStage, number> => {
    const openRequisitionIds = new Set(requisitions.filter(r => r.status === 'Aberta').map(r => r.id));
    
    const funnel: Record<PipelineStage, number> = PIPELINE_STAGES.reduce((acc, stage) => {
        acc[stage] = 0;
        return acc;
    }, {} as Record<PipelineStage, number>);

    candidates.forEach(candidate => {
        candidate.applications.forEach(app => {
            if (openRequisitionIds.has(app.requisitionId)) {
                const currentStage = app.history[app.history.length - 1]?.stage;
                if (currentStage && funnel.hasOwnProperty(currentStage)) {
                    funnel[currentStage]++;
                }
            }
        });
    });

    return funnel;
};


export const getOpenRequisitionsByRecruiter = (requisitions: JobRequisition[], recruiters: Recruiter[]): Record<string, number> => {
    const openRequisitions = requisitions.filter(r => r.status === 'Aberta');
    const distribution: Record<string, number> = {};

    recruiters.forEach(rec => {
       distribution[rec.name] = 0;
    });

    openRequisitions.forEach(req => {
        const recruiter = recruiters.find(r => r.id === req.recruiterId);
        if (recruiter) {
            distribution[recruiter.name] = (distribution[recruiter.name] || 0) + 1;
        }
    });

    // Remove recruiters with 0 open requisitions to clean up the chart
    Object.keys(distribution).forEach(key => {
        if (distribution[key] === 0) {
            delete distribution[key];
        }
    });

    return distribution;
};

export const getCandidatesPerRequisition = (requisitions: JobRequisition[], candidates: Candidate[]): Record<number, number> => {
     const counts: Record<number, number> = {};
     requisitions.forEach(req => {
        counts[req.id] = 0;
     });
     candidates.forEach(cand => {
        cand.applications.forEach(app => {
            if (counts.hasOwnProperty(app.requisitionId)) {
                counts[app.requisitionId]++;
            }
        });
     });
     return counts;
};