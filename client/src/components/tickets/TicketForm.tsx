'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';
import { Ticket, TicketPriority, TicketStatus } from '@/types/api/tickets.types';
import { useProperties } from '@/hooks/useProperties';

export type TicketFormInput = {
    title?: string;
    description: string;
    priority?: TicketPriority;
    status?: TicketStatus;
    propertyId?: number;
}

interface TicketFormProps {
    mode: 'create' | 'edit';
    initialData?: Ticket;
    onSubmit: (data: TicketFormInput) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

// Common input classes
const inputClasses = "w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800";
const optionClasses = "text-gray-800";

export default function TicketForm({ mode, initialData, onSubmit, onCancel, isSubmitting = false }: TicketFormProps) {
    const [formData, setFormData] = useState<TicketFormInput>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'medium',
        status: initialData?.status || 'open',
        propertyId: initialData?.propertyId || undefined,
    });

    const { properties, loading: propertiesLoading } = useProperties();
    const [useAI, setUseAI] = useState(mode === 'create');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {mode === 'create' ? 'Create New Ticket' : 'Edit Ticket'}
            </h2>

            {mode === 'create' && (
                <div className="mb-6 flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="use-ai"
                        checked={useAI}
                        onChange={() => setUseAI(!useAI)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="use-ai" className="!inline text-sm text-gray-600">
                        Use AI to classify this ticket automatically
                    </Label>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {(!useAI || mode === 'edit') && (
                    <div className="mb-4">
                        <Label htmlFor="title">
                            Title
                        </Label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="Enter a title for the ticket"
                            required={!useAI}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <Label htmlFor="description">
                        Description
                    </Label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder={useAI ? "Describe the issue and we'll automatically classify it..." : "Describe the maintenance issue..."}
                        required
                    ></textarea>
                </div>

                {mode === 'create' && (
                    <div className="mb-4">
                        <Label htmlFor="propertyId">
                            Property
                        </Label>
                        <select
                            id="propertyId"
                            name="propertyId"
                            value={formData.propertyId || ''}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        >
                            <option value="" className={optionClasses}>Select a property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id} className={optionClasses}>
                                    {property.address}, {property.city}, {property.state}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {(!useAI || mode === 'edit') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="priority">
                                Priority
                            </Label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                            >
                                <option value="low" className={optionClasses}>Low</option>
                                <option value="medium" className={optionClasses}>Medium</option>
                                <option value="high" className={optionClasses}>High</option>
                                <option value="urgent" className={optionClasses}>Urgent</option>
                            </select>
                        </div>

                        {mode === 'edit' && (
                            <div>
                                <Label htmlFor="status">
                                    Status
                                </Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    required
                                >
                                    <option value="open" className={optionClasses}>Open</option>
                                    <option value="in_progress" className={optionClasses}>In Progress</option>
                                    <option value="pending" className={optionClasses}>Pending</option>
                                    <option value="resolved" className={optionClasses}>Resolved</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !formData.description.trim() || (mode === 'create' && !formData.propertyId)}
                        className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {mode === 'create' ? 'Creating...' : 'Updating...'}
                            </>
                        ) : (
                            mode === 'create' ? 'Create Ticket' : 'Update Ticket'
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}