import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createServices } from '../../../services';
import { Sequence, SequenceCreate, SequenceUpdate } from '../../../services/contracts/sequence';
import { toast } from 'sonner';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, Plus, Settings } from 'lucide-react';

const services = createServices();

export const SequenceManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Fetch Sequences
    const { data: sequences, isLoading } = useQuery({
        queryKey: ['sequences'],
        queryFn: () => services.sequences.getAll()
    });

    // Create/Update Mutation
    const saveMutation = useMutation({
        mutationFn: (data: SequenceCreate | SequenceUpdate) => {
            if ('id' in data) {
                return services.sequences.update(data as SequenceUpdate);
            }
            return services.sequences.create(data as SequenceCreate);
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message);
                queryClient.invalidateQueries({ queryKey: ['sequences'] });
                setEditingSequence(null);
                setIsAdding(false);
            }
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => services.sequences.delete(id),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['sequences'] });
        }
    });

    const columns: ColumnDef<Sequence>[] = [
        {
            accessorKey: "sequenceKey",
            header: "SEQUENCE KEY",
            cell: ({ row }) => <span className="font-semibold text-primary">{row.original.sequenceKey}</span>
        },
        {
            accessorKey: "prefix",
            header: "PREFIX",
            cell: ({ row }) => <span>{row.original.prefix || '-'}</span>
        },
        {
            accessorKey: "currentValue",
            header: "CURRENT VALUE",
            cell: ({ row }) => <span className="font-bold">{row.original.currentValue}</span>
        },
        {
            accessorKey: "paddingLength",
            header: "PADDING",
            cell: ({ row }) => <span>{row.original.paddingLength}</span>
        },
        {
            accessorKey: "suffix",
            header: "SUFFIX",
            cell: ({ row }) => <span>{row.original.suffix || '-'}</span>
        },
        {
            accessorKey: "description",
            header: "DESCRIPTION",
            cell: ({ row }) => <span className="text-secondary">{row.original.description}</span>
        },
        {
            accessorKey: "updatedAt",
            header: "LAST UPDATED",
            cell: ({ row }) => <span className="text-muted" style={{ fontSize: '12px' }}>{new Date(row.original.updatedAt).toLocaleString()}</span>
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <button
                        className="btn btn-ghost"
                        style={{ padding: '4px 8px' }}
                        onClick={() => {
                            setEditingSequence(row.original);
                            setIsAdding(false);
                        }}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="btn btn-ghost"
                        style={{ padding: '4px 8px', color: 'var(--danger)' }}
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this sequence?')) {
                                deleteMutation.mutate(row.original.id);
                            }
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = {
            sequenceKey: formData.get('sequenceKey') as string,
            prefix: formData.get('prefix') as string || undefined,
            suffix: formData.get('suffix') as string || undefined,
            currentValue: parseInt(formData.get('currentValue') as string),
            paddingLength: parseInt(formData.get('paddingLength') as string),
            description: formData.get('description') as string || undefined,
        };

        if (editingSequence) {
            saveMutation.mutate({ ...data, id: editingSequence.id } as SequenceUpdate);
        } else {
            saveMutation.mutate(data as SequenceCreate);
        }
    };

    return (
        <div className="sequence-management">
            <DataTable
                columns={columns}
                data={sequences || []}
                isLoading={isLoading}
                title="Sequence Management"
                subtitle="Configure system-wide automatic numbering sequences"
                icon={<Settings size={22} />}
                headerActions={
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setIsAdding(true);
                            setEditingSequence(null);
                        }}
                    >
                        <Plus size={18} /> Add New Sequence
                    </button>
                }
            />

            <Modal
                isOpen={isAdding || !!editingSequence}
                onClose={() => { setIsAdding(false); setEditingSequence(null); }}
                title={isAdding ? 'Create New Sequence' : `Edit Sequence: ${editingSequence?.sequenceKey}`}
                onSubmit={handleSubmit}
                maxWidth="600px"
                footer={
                    <>
                        <button type="button" className="btn btn-ghost" onClick={() => { setIsAdding(false); setEditingSequence(null); }}>Cancel</button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending ? 'Saving...' : (isAdding ? 'Create Sequence' : 'Update Sequence')}
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Sequence Key (Unique Code)</label>
                        <input
                            name="sequenceKey"
                            className="form-input"
                            defaultValue={editingSequence?.sequenceKey}
                            placeholder="e.g. ORDER_NO"
                            required
                            readOnly={!!editingSequence}
                            style={editingSequence ? { background: 'var(--bg)', cursor: 'not-allowed' } : {}}
                        />
                        {!editingSequence && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>This will be used in code to identify the sequence.</p>}
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Prefix</label>
                            <input name="prefix" className="form-input" defaultValue={editingSequence?.prefix || ''} placeholder="ORD-" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Suffix</label>
                            <input name="suffix" className="form-input" defaultValue={editingSequence?.suffix || ''} placeholder="-2024" />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Current Value</label>
                            <input type="number" name="currentValue" className="form-input" defaultValue={editingSequence?.currentValue ?? 0} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Padding Length</label>
                            <input type="number" name="paddingLength" className="form-input" defaultValue={editingSequence?.paddingLength ?? 4} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            name="description" 
                            className="form-textarea" 
                            rows={3}
                            placeholder="Briefly describe what this sequence is used for..."
                            defaultValue={editingSequence?.description || ''}
                        ></textarea>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
