import React, { useState, useEffect } from 'react';
import type { Recruiter, Region, Department, Source } from '../types';
import { Modal } from './Modal';
import { LoadingSpinnerIcon } from './icons';

type SettingType = 'recruiter' | 'region' | 'department' | 'source';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: SettingType, item: { id?: number; name: string }) => void;
  modalState?: {
    type: SettingType;
    data?: Recruiter | Region | Department | Source;
  } | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, modalState }) => {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!modalState?.data;
  const type = modalState?.type;

  useEffect(() => {
    if (modalState?.data) {
      setName(modalState.data.name);
    } else {
      setName('');
    }
  }, [modalState]);

  const getTitle = () => {
    if (!type) return '';
    const action = isEditing ? 'Editar' : 'Adicionar';
    const entityName = {
      recruiter: 'Recrutador',
      region: 'Região',
      department: 'Departamento',
      source: 'Origem',
    }[type];
    return `${action} ${entityName}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    setIsSaving(true);
    setTimeout(() => {
      const dataToSave = {
        name,
        id: modalState?.data?.id,
      };
      onSave(type, dataToSave);
      setIsSaving(false);
    }, 500);
  };
  
  const handleClose = () => {
    setName('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-lg bg-slate-50 rounded-lg shadow-xl flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800" id="modal-title">
            {getTitle()}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="setting-name" className="block text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              type="text"
              name="setting-name"
              id="setting-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="bg-slate-100 p-4 flex justify-end gap-3 rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-white text-sm font-medium text-slate-700 border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400"
            >
              {isSaving && <LoadingSpinnerIcon className="w-5 h-5 mr-2" />}
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};