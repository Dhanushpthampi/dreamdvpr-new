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
                    project_name: project.name,
                    total_amount: project.budget || prev.total_amount
                }));
                // Auto-select client if not already selected
                if (!selectedClientId && project.clientId && !readOnlyContext) {
                    setSelectedClientId(project.clientId);
                }
            }

            // Fetch project timeline to set end date
            const fetchTimeline = async () => {
                try {
                    const res = await fetch(`/api/timeline?projectId=${selectedProjectId}`);
                    const data = await res.json();
                    if (res.ok && data.events && data.events.length > 0) {
                        // Find latest due date
                        const latestDate = data.events.reduce((latest, event) => {
                            if (!event.dueDate) return latest;
                            return event.dueDate > latest ? event.dueDate : latest;
                        }, '');

                        if (latestDate) {
                            setContractData(prev => ({
                                ...prev,
                                end_date: new Date(latestDate).toISOString().split('T')[0]
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching timeline:', error);
                }
            };
            fetchTimeline();
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


    const [sending, setSending] = useState(false);

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

    const handleSendToDrive = async () => {
        if (!generatedPdfUrl || !selectedProjectId) return;

        setSending(true);
        try {
            const fileName = `Contract_${contractData.client_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            const res = await fetch(`/api/projects/${selectedProjectId}/send-document`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentUrl: generatedPdfUrl,
                    fileName
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Contract sent to Google Drive successfully!');
            } else {
                alert(`Failed to send: ${data.error}`);
            }
        } catch (error) {
            console.error('Error sending to Drive:', error);
            alert('Failed to send contract to Google Drive.');
        } finally {
            setSending(false);
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
                />
                <ThemedInput
                    label="Project Name"
                    value={contractData.project_name}
                    onChange={(e) => setContractData({ ...contractData, project_name: e.target.value })}
                />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Scope of Work</h3>

                {/* Scope Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['Web Development', 'Hosting', 'Domain Setup', 'SEO Optimization', 'E-commerce Integration', 'Delivery Integration', 'Analytics Setup', 'UI/UX Design', 'Content Managment'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                // Add to last empty field or create new one
                                const currentScopes = [...contractData.scope_of_work];
                                const lastIndex = currentScopes.length - 1;

                                if (currentScopes[lastIndex] === '') {
                                    handleScopeChange(lastIndex, tag);
                                } else {
                                    setContractData({
                                        ...contractData,
                                        scope_of_work: [...currentScopes, tag]
                                    });
                                }
                            }}
                            className="px-3 py-1 text-xs font-semibold bg-gray-100 hover:bg-[#c53030]/10 hover:text-[#c53030] text-gray-600 rounded-full transition-colors border border-gray-200"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>

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
                    className="self-start px-4 py-2 text-[#c53030] font-medium hover:bg-[#c53030]/10 rounded-lg transition-colors flex items-center gap-2"
                >
                    + Add Deliverable
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ThemedInput
                    label="Total Contract Amount (₹)"
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
                    <>
                        <a
                            href={generatedPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-[#c53030] text-[#c53030] font-semibold rounded-lg hover:bg-[#c53030]/10 transition-colors flex items-center gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                            View Contract
                        </a>
                        <button
                            onClick={handleSendToDrive}
                            disabled={sending}
                            className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {sending ? (
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                                </svg>
                            )}
                            Send to Drive
                        </button>
                    </>
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
