import React, { useState, useEffect } from 'react';
import type { Candidate, Source } from '../types';
import { Modal } from './Modal';
import { LoadingSpinnerIcon } from './icons';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (candidateData: Omit<Candidate, 'id' | 'applications' | 'avatarUrl'> & { id?: number }) => void;
    initialData?: Candidate | null;
    sources: Source[];
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onSave, initialData, sources }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
        skills: '',
        resume: '',
        sourceId: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone,
                role: initialData.role,
                location: initialData.location,
                skills: initialData.skills.join(', '),
                resume: initialData.resume,
                sourceId: String(initialData.sourceId)
            });
        } else {
             setFormData({
                name: '', email: '', phone: '', role: '', location: '', skills: '', resume: '', sourceId: ''
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
            const { sourceId, ...rest } = formData;
            const candidateData = {
                ...rest,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                sourceId: parseInt(sourceId, 10),
                experience: initialData?.experience || [],
                education: initialData?.education || []
            };
            const dataToSave = isEditing ? { ...candidateData, id: initialData.id } : candidateData;
            onSave(dataToSave);
            setIsSaving(false);
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-2xl max-h-[90vh] bg-slate-50 rounded-lg shadow-xl flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800" id="modal-title">
                        {isEditing ? 'Editar Candidato' : 'Adicionar Novo Candidato'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700">Cargo Atual</label>
                            <input type="text" name="role" id="role" required value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
                            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefone</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                        </div>
                         <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Localização</label>
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="sourceId" className="block text-sm font-medium text-slate-700">Origem do Candidato</label>
                             <select name="sourceId" id="sourceId" required value={formData.sourceId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                <option value="" disabled>Selecione...</option>
                                {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="skills" className="block text-sm font-medium text-slate-700">Habilidades (separadas por vírgula)</label>
                            <input type="text" name="skills" id="skills" value={formData.skills} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="resume" className="block text-sm font-medium text-slate-700">Currículo (cole o texto)</label>
                        <textarea name="resume" id="resume" required rows={8} value={formData.resume} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-sm font-medium text-slate-700 border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving || !formData.sourceId} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400">
                           {isSaving && <LoadingSpinnerIcon className="w-5 h-5 mr-2" />}
                           {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Candidato')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};