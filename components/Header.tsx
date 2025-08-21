import React from 'react';
import { LogoIcon, BriefcaseIcon, UsersIcon, ChartBarIcon, CogIcon } from './icons';

type View = 'positions' | 'candidates' | 'dashboards' | 'settings';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
    view: View;
    currentView: View;
    onNavigate: (view: View) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ view, currentView, onNavigate, icon, label }) => {
    const isActive = view === currentView;
    return (
        <button
            onClick={() => onNavigate(view)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    )
};


export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-10">
      <div className="flex items-center space-x-3">
        <LogoIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">Assistente de Recrutamento IA</h1>
      </div>
      <nav className="flex items-center space-x-2">
         <NavItem 
            view="positions"
            currentView={currentView}
            onNavigate={onNavigate}
            icon={<BriefcaseIcon className="h-5 w-5" />}
            label="Vagas"
        />
        <NavItem 
            view="candidates"
            currentView={currentView}
            onNavigate={onNavigate}
            icon={<UsersIcon className="h-5 w-5" />}
            label="Candidatos"
        />
        <NavItem 
            view="dashboards"
            currentView={currentView}
            onNavigate={onNavigate}
            icon={<ChartBarIcon className="h-5 w-5" />}
            label="Dashboards"
        />
        <NavItem 
            view="settings"
            currentView={currentView}
            onNavigate={onNavigate}
            icon={<CogIcon className="h-5 w-5" />}
            label="Cadastros"
        />
      </nav>
    </header>
  );
};