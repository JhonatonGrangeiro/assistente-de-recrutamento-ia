import React from 'react';
import type { Recruiter, Region, Department, Source } from '../types';
import { PencilIcon, TrashIcon, PlusIcon, UsersIcon, GlobeAltIcon, OfficeBuildingIcon, LinkIcon } from './icons';

type SettingType = 'recruiter' | 'region' | 'department' | 'source';
type Item = Recruiter | Region | Department | Source;

interface ManagementListProps<T extends Item> {
  title: string;
  items: T[];
  icon: React.ReactNode;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
}

const ManagementList = <T extends Item>({ title, items, icon, onAdd, onEdit, onDelete }: ManagementListProps<T>) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-slate-800 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <button
        onClick={onAdd}
        className="flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-4 h-4 mr-1.5" />
        Adicionar
      </button>
    </div>
    <ul className="divide-y divide-slate-200">
      {items.map((item) => (
        <li key={item.id} className="py-3 flex justify-between items-center">
          <span className="text-slate-700">{item.name}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
      {items.length === 0 && (
          <li className="py-3 text-center text-slate-500 text-sm">Nenhum item cadastrado.</li>
      )}
    </ul>
  </div>
);

interface SettingsViewProps {
  recruiters: Recruiter[];
  regions: Region[];
  departments: Department[];
  sources: Source[];
  onAddItem: (type: SettingType) => void;
  onEditItem: (type: SettingType, item: Item) => void;
  onDeleteItem: (type: SettingType, id: number) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  recruiters,
  regions,
  departments,
  sources,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Cadastros Gerais</h1>
        <p className="mt-1 text-slate-500">Gerencie os dados mestres do sistema de recrutamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ManagementList
          title="Recrutadores"
          items={recruiters}
          icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
          onAdd={() => onAddItem('recruiter')}
          onEdit={(item) => onEditItem('recruiter', item)}
          onDelete={(id) => onDeleteItem('recruiter', id)}
        />
        <ManagementList
          title="Regiões"
          items={regions}
          icon={<GlobeAltIcon className="w-6 h-6 text-blue-600" />}
          onAdd={() => onAddItem('region')}
          onEdit={(item) => onEditItem('region', item)}
          onDelete={(id) => onDeleteItem('region', id)}
        />
        <ManagementList
          title="Departamentos"
          items={departments}
          icon={<OfficeBuildingIcon className="w-6 h-6 text-blue-600" />}
          onAdd={() => onAddItem('department')}
          onEdit={(item) => onEditItem('department', item)}
          onDelete={(id) => onDeleteItem('department', id)}
        />
        <ManagementList
          title="Origens"
          items={sources}
          icon={<LinkIcon className="w-6 h-6 text-blue-600" />}
          onAdd={() => onAddItem('source')}
          onEdit={(item) => onEditItem('source', item)}
          onDelete={(id) => onDeleteItem('source', id)}
        />
      </div>
    </div>
  );
};