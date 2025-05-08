'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';
import { Ticket, TicketPriority, TicketStatus } from '@/types/api/tickets.types';
import { useProperties } from '@/hooks/useProperties';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import AnimatedText from '@/components/common/AnimatedText';

export type TicketFormInput = {
    title?: string;
    description: string;
    priority?: TicketPriority;
    status?: TicketStatus;
    propertyId?: number;
    contactPhone?: string;
    contactEmail?: string;
    estimatedCost?: string;
    dueDate?: string;
    attachments?: File[];
    notes?: string;
    useAI?: boolean;
}

interface TicketFormProps {
    mode: 'create' | 'edit';
    initialData?: Ticket;
    onSubmit: (data: TicketFormInput) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function TicketForm({ mode, initialData, onSubmit, onCancel, isSubmitting = false }: TicketFormProps) {
    const [formData, setFormData] = useState<TicketFormInput>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'medium',
        status: initialData?.status || 'in_progress_by_ai',
        propertyId: initialData?.propertyId || undefined,
        contactPhone: initialData?.metadata?.contactPhone || '',
        contactEmail: initialData?.metadata?.contactEmail || '',
        estimatedCost: initialData?.metadata?.estimatedCost || '',
        dueDate: initialData?.metadata?.dueDate ? String(initialData.metadata.dueDate) : '',
        notes: initialData?.metadata?.notes || '',
        useAI: mode === 'create' ? true : false
    });

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<any[]>(
        initialData?.metadata?.attachments || []
    );
    const { properties, loading: propertiesLoading } = useProperties();

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear the error for this field when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Handle file uploads
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);

            // Create preview URLs
            const newUrls = newFiles.map(file => URL.createObjectURL(file));
            setFilePreviewUrls(prev => [...prev, ...newUrls]);
        }
    };

    // Remove a file
    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));

        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(filePreviewUrls[index]);
        setFilePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // Clean up preview URLs when component unmounts
    useEffect(() => {
        return () => {
            filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [filePreviewUrls]);

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Basic validation
        if ((!formData.useAI || mode === 'edit') && !formData.title?.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'Description is required';
        }

        if (mode === 'create' && !formData.propertyId) {
            newErrors.propertyId = 'Property selection is required';
        }

        if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
        }

        if (formData.contactPhone && !/^\+?[\d\s-]{10,15}$/.test(formData.contactPhone)) {
            newErrors.contactPhone = 'Please enter a valid phone number';
        }

        // Set errors and return validation result
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Include attachments in the form data
            const finalFormData = {
                ...formData,
                attachments: selectedFiles,
                existingAttachments: existingAttachments
            };
            onSubmit(finalFormData);
        }
    };

    // Go to next step
    const goToNextStep = () => {
        if (step === 1) {
            // Validate first step fields
            const stepOneErrors: Record<string, string> = {};

            if ((!formData.useAI || mode === 'edit') && !formData.title?.trim()) {
                stepOneErrors.title = 'Title is required';
            }

            if (!formData.description?.trim()) {
                stepOneErrors.description = 'Description is required';
            }

            if (mode === 'create' && !formData.propertyId) {
                stepOneErrors.propertyId = 'Property selection is required';
            }

            if (Object.keys(stepOneErrors).length === 0) {
                setStep(2);
                setErrors({});
            } else {
                setErrors(stepOneErrors);
            }
        }
    };

    // Go back to previous step
    const goToPreviousStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    // Get badge variant for priority
    const getPriorityBadgeVariant = (priority: string): "default" | "danger" | "warning" | "info" | "success" => {
        switch (priority) {
            case 'urgent': return 'danger';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        <AnimatedText
                            text={mode === 'create' ? 'Create New Ticket' : 'Edit Ticket'}
                            animation="slide-up"
                            once={false}
                        />
                    </h2>
                    <Badge variant={mode === 'create' ? 'info' : 'warning'} className="px-3 py-1">
                        {mode === 'create' ? 'New Ticket' : 'Edit Mode'}
                    </Badge>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between">
                        <div className={`flex-1 text-center relative ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-muted'}`}>
                                1
                            </div>
                            <div className="text-sm">Basic Info</div>
                            <div className="absolute top-4 left-1/2 w-full h-0.5 -z-10 bg-border"></div>
                        </div>
                        <div className={`flex-1 text-center relative ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-muted'}`}>
                                2
                            </div>
                            <div className="text-sm">Additional Details</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {mode === 'create' && (
                                <div className="mb-6 p-4 bg-background rounded-lg border border-border">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">AI-Assisted Ticket Creation</h3>
                                            <p className="text-sm text-muted-foreground">Let AI help classify and organize your ticket</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-1">
                                        <input
                                            type="checkbox"
                                            id="useAI"
                                            name="useAI"
                                            checked={formData.useAI}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor="useAI" className="ml-2 !inline text-sm">
                                            Use AI to automatically classify this ticket
                                        </Label>
                                    </div>
                                </div>
                            )}

                            {(!formData.useAI || mode === 'edit') && (
                                <div className="mb-5">
                                    <Label htmlFor="title" className="block mb-1.5">
                                        Ticket Title
                                    </Label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="Enter a descriptive title for the ticket"
                                    />
                                    {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
                                </div>
                            )}

                            <div className="mb-5">
                                <Label htmlFor="description" className="block mb-1.5">
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    placeholder={formData.useAI ? "Describe the issue in detail and our AI will classify it automatically..." : "Provide a detailed description of the maintenance issue..."}
                                ></textarea>
                                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
                            </div>

                            {mode === 'create' && (
                                <div className="mb-5">
                                    <Label htmlFor="propertyId" className="block mb-1.5">
                                        Property
                                    </Label>
                                    <select
                                        id="propertyId"
                                        name="propertyId"
                                        value={formData.propertyId || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    >
                                        <option value="">Select a property</option>
                                        {properties.map((property) => (
                                            <option key={property.id} value={property.id}>
                                                {property.address}, {property.city}, {property.state}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.propertyId && <p className="text-destructive text-sm mt-1">{errors.propertyId}</p>}
                                </div>
                            )}

                            {(!formData.useAI || mode === 'edit') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                    <div>
                                        <Label htmlFor="priority" className="block mb-1.5">
                                            Priority
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="priority"
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-3 py-2 rounded-md border border-border bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Badge variant={getPriorityBadgeVariant(formData.priority || 'medium')} className="w-6 h-6 flex items-center justify-center p-0 rounded-full">
                                                    !
                                                </Badge>
                                            </div>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {mode === 'edit' && (
                                        <div>
                                            <Label htmlFor="status" className="block mb-1.5">
                                                Status
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 px-3 py-2 rounded-md border border-border bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                                >
                                                    <option value="in_progress_by_ai">In Progress by AI</option>
                                                    <option value="needs_manual_review">Needs Manual Review</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                                                        ${formData.status === 'in_progress_by_ai' ? 'bg-primary/15 text-primary' :
                                                            formData.status === 'needs_manual_review' ? 'bg-amber-500/15 text-amber-600' :
                                                                'bg-emerald-500/15 text-emerald-600'}`}>
                                                        {formData.status === 'in_progress_by_ai' ? '→' :
                                                            formData.status === 'needs_manual_review' ? '⏱' : '✓'}
                                                    </div>
                                                </div>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    className="mr-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={goToNextStep}
                                >
                                    Next Step
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <Label htmlFor="contactPhone" className="block mb-1.5">
                                        Contact Phone (Optional)
                                    </Label>
                                    <input
                                        id="contactPhone"
                                        name="contactPhone"
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="Phone number for contact"
                                    />
                                    {errors.contactPhone && <p className="text-destructive text-sm mt-1">{errors.contactPhone}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="contactEmail" className="block mb-1.5">
                                        Contact Email (Optional)
                                    </Label>
                                    <input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="Email for correspondence"
                                    />
                                    {errors.contactEmail && <p className="text-destructive text-sm mt-1">{errors.contactEmail}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <Label htmlFor="estimatedCost" className="block mb-1.5">
                                        Estimated Cost (Optional)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                                        <input
                                            id="estimatedCost"
                                            name="estimatedCost"
                                            type="text"
                                            value={formData.estimatedCost}
                                            onChange={handleChange}
                                            className="w-full pl-8 px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="dueDate" className="block mb-1.5">
                                        Target Completion Date (Optional)
                                    </Label>
                                    <input
                                        id="dueDate"
                                        name="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mb-5">
                                <Label htmlFor="notes" className="block mb-1.5">
                                    Additional Notes (Optional)
                                </Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    placeholder="Any additional details or context..."
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <Label className="block mb-1.5">
                                    Upload Photos or Documents (Optional)
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer bg-background hover:bg-muted/50 transition-colors">
                                    <input
                                        type="file"
                                        id="attachments"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="attachments" className="cursor-pointer flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-sm text-muted-foreground mb-1">Drag and drop files here, or click to select files</span>
                                        <span className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)</span>
                                    </label>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</p>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-background p-2 rounded-md border border-border">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                                                        {file.type.includes('image') ? (
                                                            <img
                                                                src={filePreviewUrls[index]}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="text-destructive hover:text-destructive/80 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {existingAttachments.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium mb-2">Existing Attachments ({existingAttachments.length})</p>
                                        {existingAttachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center justify-between bg-background p-2 rounded-md border border-border">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                                                        {attachment.type.includes('image') ? (
                                                            <img
                                                                src={attachment.url}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium truncate max-w-xs">{attachment.filename}</p>
                                                        <p className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setExistingAttachments(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="text-destructive hover:text-destructive/80 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goToPreviousStep}
                                    disabled={isSubmitting}
                                >
                                    Back
                                </Button>
                                <div className="space-x-3">
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
                                        disabled={isSubmitting}
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
                            </div>
                        </motion.div>
                    )}
                </form>
            </div>
        </Card>
    );
}