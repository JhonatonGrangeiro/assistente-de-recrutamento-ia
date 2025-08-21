import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { JobRequisitionList } from './components/JobRequisitionList';
import { PipelineView } from './components/PipelineView';
import { CandidateDetail } from './components/CandidateDetail';
import { Modal } from './components/Modal';
import { CandidateDatabaseView } from './components/CandidateDatabaseView';
import { AddCandidateModal } from './components/AddCandidateModal';
import { AddRequisitionModal } from './components/AddRequisitionModal';
import { DashboardView } from './components/DashboardView';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsView } from './components/SettingsView';
import { SettingsModal } from './components/SettingsModal';
import type { Candidate, JobRequisition, PipelineStage, Application, Recruiter, Region, Department, Source } from './types';
import { MOCK_CANDIDATES, MOCK_REQUISITIONS, MOCK_RECRUITERS, MOCK_REGIONS, MOCK_DEPARTMENTS, MOCK_SOURCES } from './constants';

type View = 'positions' | 'candidates' | 'dashboards' | 'settings';
type SettingType = 'recruiter' | 'region' | 'department' | 'source';

type ModalState = {
  viewingCandidate?: Candidate | null;
  editingCandidate?: Candidate | null;
  deletingCandidateId?: number | null;
  addingCandidate?: boolean;
  editingRequisition?: JobRequisition | null;
  deletingRequisitionId?: number | null;
  addingRequisition?: boolean;
  settingsModalState?: {
    type: SettingType;
    data?: Recruiter | Region | Department | Source;
  } | null;
  deletingSettingId?: { type: SettingType; id: number } | null;
};


const App: React.FC = () => {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(MOCK_REQUISITIONS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [recruiters, setRecruiters] = useState<Recruiter[]>(MOCK_RECRUITERS);
  const [regions, setRegions] = useState<Region[]>(MOCK_REGIONS);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);

  const [currentView, setCurrentView] = useState<View>('positions');
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<number | null>(null);
  const [modalState, setModalState] = useState<ModalState>({});

  const selectedRequisition = useMemo(
    () => requisitions.find(r => r.id === selectedRequisitionId),
    [requisitions, selectedRequisitionId]
  );

  const candidatesForRequisition = useMemo(
    () => candidates.filter(c => c.applications.some(app => app.requisitionId === selectedRequisitionId)),
    [candidates, selectedRequisitionId]
  );

  const handleSelectRequisition = (id: number) => {
    setCurrentView('positions');
    setSelectedRequisitionId(id);
  };

  const handleBackToList = () => {
    setSelectedRequisitionId(null);
  };
  
  const handleUpdateCandidateStage = (candidateId: number, requisitionId: number, newStage: PipelineStage) => {
    setCandidates(prevCandidates =>
      prevCandidates.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            applications: c.applications.map(app => {
              if (app.requisitionId === requisitionId) {
                const newHistoryEntry = { stage: newStage, date: new Date().toISOString() };
                return { ...app, history: [...app.history, newHistoryEntry] };
              }
              return app;
            }),
          };
        }
        return c;
      })
    );
  };

  const handleAssignCandidateToRequisition = (candidateId: number, requisitionId: number) => {
     setCandidates(prevCandidates =>
      prevCandidates.map(c => {
        if (c.id === candidateId) {
          if (c.applications.some(app => app.requisitionId === requisitionId)) {
            return c;
          }
          const newApplication: Application = { 
            requisitionId, 
            history: [{ stage: 'Candidatou-se', date: new Date().toISOString() }] 
          };
          return {
            ...c,
            applications: [...c.applications, newApplication],
          };
        }
        return c;
      })
    );
  };

  const handleSaveCandidate = (candidateData: Omit<Candidate, 'id' | 'applications' | 'avatarUrl'> & { id?: number }) => {
    if (candidateData.id) { // Editing existing candidate
      setCandidates(prev => prev.map(c => c.id === candidateData.id ? { ...c, ...candidateData } : c));
    } else { // Adding new candidate
      const newCandidate: Candidate = {
        ...candidateData,
        id: Math.max(...candidates.map(c => c.id), 0) + 1,
        applications: [],
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      setCandidates(prev => [...prev, newCandidate]);
    }
    setModalState({});
  };

  const handleDeleteCandidate = (candidateId: number) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
    setModalState({});
  };
  
  const handleSaveRequisition = (requisitionData: Omit<JobRequisition, 'id' | 'status' | 'createdAt'> & { id?: number }) => {
     if (requisitionData.id) { // Editing
        setRequisitions(prev => prev.map(r => r.id === requisitionData.id ? { ...r, ...requisitionData } : r));
     } else { // Adding
        const newRequisition: JobRequisition = {
            ...requisitionData,
            id: Math.max(...requisitions.map(r => r.id), 0) + 1,
            status: 'Aberta',
            createdAt: new Date().toISOString(),
        };
        setRequisitions(prev => [newRequisition, ...prev]);
     }
     setModalState({});
  };
  
  const handleToggleRequisitionStatus = (requisitionId: number) => {
    setRequisitions(prev => prev.map(r => 
        r.id === requisitionId 
        ? { ...r, status: r.status === 'Aberta' ? 'Fechada' : 'Aberta', closedAt: r.status === 'Aberta' ? new Date().toISOString() : undefined } 
        : r
    ));
  };
  
  const handleDeleteRequisition = (requisitionId: number) => {
    setRequisitions(prev => prev.filter(r => r.id !== requisitionId));
    // Also remove applications associated with this requisition
    setCandidates(prev => prev.map(c => ({
        ...c,
        applications: c.applications.filter(app => app.requisitionId !== requisitionId)
    })));
    setModalState({});
  };

  const handleSaveSetting = (type: SettingType, item: { id?: number; name: string }) => {
    const stateSetterMap = {
      recruiter: setRecruiters,
      region: setRegions,
      department: setDepartments,
      source: setSources,
    };
    const stateMap = {
      recruiter: recruiters,
      region: regions,
      department: departments,
      source: sources,
    }

    const setter = stateSetterMap[type];
    const state = stateMap[type];

    if (item.id) { // Editing
      setter(prev => prev.map(i => i.id === item.id ? { ...i, ...item } : i));
    } else { // Adding
      const newItem = { ...item, id: Math.max(...state.map(i => i.id), 0) + 1 };
      setter(prev => [...prev, newItem]);
    }
    setModalState({});
  };
  
  const handleDeleteSetting = (type: SettingType, id: number) => {
     const stateSetterMap = {
      recruiter: setRecruiters,
      region: setRegions,
      department: setDepartments,
      source: setSources,
    };
    const setter = stateSetterMap[type];
    setter(prev => prev.filter(i => i.id !== id));
    setModalState({});
  }

  const renderMainContent = () => {
    if (currentView === 'positions') {
      return !selectedRequisition ? (
        <JobRequisitionList
          requisitions={requisitions}
          candidates={candidates}
          departments={departments}
          regions={regions}
          onSelectRequisition={handleSelectRequisition}
          onAddRequisition={() => setModalState({ addingRequisition: true })}
          onEditRequisition={(req) => setModalState({ editingRequisition: req })}
          onToggleStatus={handleToggleRequisitionStatus}
          onDeleteRequisition={(id) => setModalState({ deletingRequisitionId: id })}
        />
      ) : (
        <PipelineView
          requisition={selectedRequisition}
          candidates={candidatesForRequisition}
          recruiter={recruiters.find(rec => rec.id === selectedRequisition.recruiterId)}
          department={departments.find(d => d.id === selectedRequisition.departmentId)}
          region={regions.find(r => r.id === selectedRequisition.regionId)}
          onUpdateCandidateStage={handleUpdateCandidateStage}
          onViewCandidate={(candidate) => setModalState({ viewingCandidate: candidate })}
          onBack={handleBackToList}
          onEditRequisition={(req) => setModalState({ editingRequisition: req })}
          onToggleStatus={handleToggleRequisitionStatus}
          onDeleteRequisition={(id) => setModalState({ deletingRequisitionId: id })}
        />
      );
    }
    if (currentView === 'candidates') {
        return <CandidateDatabaseView 
                    candidates={candidates} 
                    onViewCandidate={(candidate) => setModalState({ viewingCandidate: candidate })} 
                    onAddCandidate={() => setModalState({ addingCandidate: true })} 
                />;
    }
    if (currentView === 'dashboards') {
        return <DashboardView candidates={candidates} requisitions={requisitions} recruiters={recruiters} sources={sources} />;
    }
    if (currentView === 'settings') {
      return <SettingsView 
        recruiters={recruiters}
        regions={regions}
        departments={departments}
        sources={sources}
        onAddItem={(type) => setModalState({ settingsModalState: { type }})}
        onEditItem={(type, data) => setModalState({ settingsModalState: { type, data }})}
        onDeleteItem={(type, id) => setModalState({ deletingSettingId: { type, id }})}
      />
    }
    return null;
  }
  
  const getSettingTypeName = (type: SettingType | undefined) => {
      if (!type) return '';
      return {
          recruiter: 'Recrutador',
          region: 'Região',
          department: 'Departamento',
          source: 'Origem'
      }[type];
  }


  return (
    <div className="flex flex-col h-screen font-sans text-slate-800 bg-slate-50">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {renderMainContent()}
      </main>
      
      <Modal isOpen={!!modalState.viewingCandidate} onClose={() => setModalState({})}>
        {modalState.viewingCandidate && (
          <div className="w-full max-w-4xl max-h-[90vh] bg-slate-50 rounded-lg shadow-xl flex flex-col">
             <CandidateDetail
                candidate={modalState.viewingCandidate}
                requisitions={requisitions}
                departments={departments}
                regions={regions}
                onAssignToRequisition={handleAssignCandidateToRequisition}
                jobDescription={selectedRequisition?.description || ''} 
                onEdit={(candidate) => setModalState({ viewingCandidate: null, editingCandidate: candidate })}
                onDelete={(id) => setModalState({ viewingCandidate: null, deletingCandidateId: id })}
                key={modalState.viewingCandidate.id}
              />
          </div>
        )}
      </Modal>

      <AddCandidateModal
        isOpen={!!modalState.addingCandidate || !!modalState.editingCandidate}
        onClose={() => setModalState({})}
        onSave={handleSaveCandidate}
        initialData={modalState.editingCandidate}
        sources={sources}
      />

      <AddRequisitionModal
        isOpen={!!modalState.addingRequisition || !!modalState.editingRequisition}
        onClose={() => setModalState({})}
        onSave={handleSaveRequisition}
        initialData={modalState.editingRequisition}
        recruiters={recruiters}
        regions={regions}
        departments={departments}
      />

      <SettingsModal 
        isOpen={!!modalState.settingsModalState}
        onClose={() => setModalState({})}
        onSave={handleSaveSetting}
        modalState={modalState.settingsModalState}
      />

      <ConfirmationModal
        isOpen={!!modalState.deletingRequisitionId || !!modalState.deletingCandidateId || !!modalState.deletingSettingId}
        onClose={() => setModalState({})}
        onConfirm={() => {
          if (modalState.deletingRequisitionId) {
            handleDeleteRequisition(modalState.deletingRequisitionId);
          } else if (modalState.deletingCandidateId) {
            handleDeleteCandidate(modalState.deletingCandidateId);
          } else if (modalState.deletingSettingId) {
            handleDeleteSetting(modalState.deletingSettingId.type, modalState.deletingSettingId.id);
          }
        }}
        title={`Excluir ${modalState.deletingRequisitionId ? 'Vaga' : modalState.deletingCandidateId ? 'Candidato' : getSettingTypeName(modalState.deletingSettingId?.type)}`}
        message={`Você tem certeza que deseja excluir ${modalState.deletingRequisitionId ? 'esta vaga' : modalState.deletingCandidateId ? 'este candidato' : 'este item'}? Esta ação não pode ser desfeita.`}
      />

    </div>
  );
};

export default App;