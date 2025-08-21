import React, { useState, useEffect } from 'react';
import type { JobRequisition, Recruiter, Region, Department, RequisitionPriority, RequisitionReason } from '../types';
import { Modal } from './Modal';
import { LoadingSpinnerIcon } from './icons';

interface AddRequisitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (requisitionData: Omit<JobRequisition, 'id' | 'status' | 'createdAt'> & { id?: number }) => void;
    initialData?: JobRequisition | null;
    recruiters: Recruiter[];
    regions: Region[];
    departments: Department[];
}

const priorities: RequisitionPriority[] = ['Baixa', 'Média', 'Alta'];
const reasons: RequisitionReason[] = ['Implantação', 'Substituição', 'Temporária'];

export const AddRequisitionModal: React.FC<AddRequisitionModalProps> = ({ isOpen, onClose, onSave, initialData, recruiters, regions, departments }) => {
    const [formData, setFormData] = useState({
        title: '',
        departmentId: '',
        regionId: '',
        recruiterId: '',
        priority: 'Média' as RequisitionPriority,
        reason: 'Substituição' as RequisitionReason,
        description: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                departmentId: String(initialData.departmentId),
                regionId: String(initialData.regionId),
                recruiterId: String(initialData.recruiterId),
                priority: initialData.priority,
                reason: initialData.reason,
                description: initialData.description,
            });
        } else {
             setFormData({
                title: '',
                departmentId: '',
                regionId: '',
                recruiterId: '',
                priority: 'Média',
                reason: 'Substituição',
                description: '',
             });
        }
    }, [initialData, isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        setTimeout(() => {
            const requisitionData = {
                ...formData,
                departmentId: parseInt(formData.departmentId),
                regionId: parseInt(formData.regionId),
                recruiterId: parseInt(formData.recruiterId),
            }
            const dataToSave = isEditing ? { ...requisitionData, id: initialData.id } : requisitionData;
            onSave(dataToSave);
            setIsSaving(false);
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-3xl max-h-[90vh] bg-slate-50 rounded-lg shadow-xl flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800" id="modal-title">
                        {isEditing ? 'Editar Vaga' : 'Criar Nova Vaga'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Título da Vaga</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="departmentId" className="block text-sm font-medium text-slate-700">Departamento</label>
                            <select id="departmentId" name="departmentId" required value={formData.departmentId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                <option value="" disabled>Selecione...</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="regionId" className="block text-sm font-medium text-slate-700">Região</label>
                            <select id="regionId" name="regionId" required value={formData.regionId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                <option value="" disabled>Selecione...</option>
                                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                          <div>
                            <label htmlFor="recruiterId" className="block text-sm font-medium text-slate-700">Recrutador Responsável</label>
                            <select id="recruiterId" name="recruiterId" required value={formData.recruiterId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                <option value="" disabled>Selecione...</option>
                                {recruiters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Prioridade</label>
                            <select id="priority" name="priority" required value={formData.priority} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Motivo da Solicitação</label>
                            <select id="reason" name="reason" required value={formData.reason} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrição da Vaga</label>
                        <textarea name="description" id="description" required rows={8} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-sm font-medium text-slate-700 border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving || !formData.departmentId || !formData.regionId || !formData.recruiterId} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400">
                           {isSaving && <LoadingSpinnerIcon className="w-5 h-5 mr-2" />}
                           {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Vaga')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};