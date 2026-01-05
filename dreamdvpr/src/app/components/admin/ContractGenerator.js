'use client';

import { useState, useEffect } from 'react';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';

export default function ContractGenerator({
    initialClientId = '',
    initialProjectId = '',
    readOnlyContext = false,
    clients = [],
    projects = []
}) {
    const [generating, setGenerating] = useState(false);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState(initialClientId);
    const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

    const [contractData, setContractData] = useState({
        client_name: '',
        project_name: '',
        scope_of_work: [''],
        payment_terms: '50% upfront, 50% upon completion',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        total_amount: ''
    });

    const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

    // Handle Client Selection
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find(c => c._id === selectedClientId);
            if (client) {
                setContractData(prev => ({
                    ...prev,
                    client_name: client.name
                }));
            }
        }
    }, [selectedClientId, clients]);

    // Handle Project Selection
    useEffect(() => {
        if (selectedProjectId) {
            const project = projects.find(p => p._id === selectedProjectId);
            if (project) {
                setContractData(prev => ({
                    ...prev,
                    project_name: project.name
                }));
                // Auto-select client if not already selected
                if (!selectedClientId && project.clientId && !readOnlyContext) {
                    setSelectedClientId(project.clientId);
                }
            }
        }
    }, [selectedProjectId, projects, selectedClientId, readOnlyContext]);

    useEffect(() => {
        if (initialClientId) setSelectedClientId(initialClientId);
        if (initialProjectId) setSelectedProjectId(initialProjectId);
    }, [initialClientId, initialProjectId]);

    const handleScopeChange = (index, value) => {
        const newScope = [...contractData.scope_of_work];
        newScope[index] = value;
        setContractData({ ...contractData, scope_of_work: newScope });
    };

    const addScopeItem = () => {
        setContractData({ ...contractData, scope_of_work: [...contractData.scope_of_work, ''] });
    };
    const removeScopeItem = (index) => {
        const newScope = contractData.scope_of_work.filter((_, i) => i !== index);
        setContractData({ ...contractData, scope_of_work: newScope });
    };


    const handleGenerate = async () => {
        setGenerating(true);
        setGeneratedPdfUrl(null);
        try {
            const payload = {
                ...contractData
            };

            const response = await fetch('https://doc-generator-service.onrender.com/generate/contract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to generate contract');
            }

            const data = await response.json();
            setGeneratedPdfUrl(data.url);

        } catch (error) {
            console.error('Error generating contract:', error);
            alert('Failed to generate contract. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const clientOptions = clients.map(c => ({ value: c._id, label: c.name }));
    const projectOptions = projects.map(p => ({ value: p._id, label: p.name }));

    return (
        <div className="flex flex-col gap-6">
            {!readOnlyContext && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ThemedSelect
                        label="Select Client"
                        placeholder="Choose a client..."
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        options={clientOptions}
                    />
                    <ThemedSelect
                        label="Select Project"
                        placeholder="Choose a project..."
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        options={projectOptions}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ThemedInput
                    label="Client Name"
                    value={contractData.client_name}
                    onChange={(e) => setContractData({ ...contractData, client_name: e.target.value })}
                    disabled={readOnlyContext}
                />
                <ThemedInput
                    label="Project Name"
                    value={contractData.project_name}
                    onChange={(e) => setContractData({ ...contractData, project_name: e.target.value })}
                    disabled={readOnlyContext}
                />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Scope of Work</h3>
                {contractData.scope_of_work.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <div className="flex-1">
                            <ThemedInput
                                value={item}
                                onChange={(e) => handleScopeChange(index, e.target.value)}
                                placeholder="Deliverable description"
                            />
                        </div>
                        <button
                            onClick={() => removeScopeItem(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-[2px]"
                            disabled={contractData.scope_of_work.length === 1}
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </button>
                    </div>
                ))}
                <button
                    onClick={addScopeItem}
                    className="self-start px-4 py-2 text-[#e53e3e] font-medium hover:bg-[#e53e3e]/10 rounded-lg transition-colors flex items-center gap-2"
                >
                    + Add Deliverable
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ThemedInput
                    label="Total Contract Amount ($)"
                    value={contractData.total_amount}
                    onChange={(e) => setContractData({ ...contractData, total_amount: e.target.value })}
                    placeholder="5000"
                />
                <ThemedInput
                    label="Payment Terms"
                    value={contractData.payment_terms}
                    onChange={(e) => setContractData({ ...contractData, payment_terms: e.target.value })}
                />
                <ThemedInput
                    label="Start Date"
                    type="date"
                    value={contractData.start_date}
                    onChange={(e) => setContractData({ ...contractData, start_date: e.target.value })}
                />
                <ThemedInput
                    label="End Date"
                    type="date"
                    value={contractData.end_date}
                    onChange={(e) => setContractData({ ...contractData, end_date: e.target.value })}
                    placeholder="Optional"
                />
            </div>


            <div className="mt-8 flex justify-end gap-4">
                {generatedPdfUrl && (
                    <a
                        href={generatedPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-[#e53e3e] text-[#e53e3e] font-semibold rounded-lg hover:bg-[#e53e3e]/10 transition-colors flex items-center gap-2"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        View Contract
                    </a>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-6 py-3 bg-[#1d1d1f] text-white font-semibold rounded-lg hover:bg-black transition-colors shadow-lg shadow-black/10 flex items-center gap-2 group"
                >
                    {generating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor">
                                <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-2h8zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z" />
                                <circle cx="18" cy="11.5" r="1" />
                            </svg>
                            Generate PDF
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
