'use client';

import { useState, useEffect } from 'react';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';

export default function ProposalGenerator({
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

    const [proposalData, setProposalData] = useState({
        client_name: '',
        discovery: ['Initial Consultation', 'Requirements Gathering', 'Market Research'],
        solutions: ['Responsive Web Design', 'SEO Optimization', 'Content Management System'],
        timeline: [
            { phase: 'Phase 1', description: 'Design & Prototyping', time: '2 Weeks' },
            { phase: 'Phase 2', description: 'Development', time: '4 Weeks' }
        ],
        pricing: [
            ['Web Design', '$2,000'],
            ['Development', '$3,000'],
            ['SEO Setup', '$500']
        ],
        addons: [
            { title: 'Priority Support', price: '$200/mo' },
            { title: 'Content Writing', price: '$500' }
        ]
    });

    const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

    // Handle Client Selection
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find(c => c._id === selectedClientId);
            if (client) {
                setProposalData(prev => ({
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

    const handleArrayChange = (key, index, value) => {
        const newArray = [...proposalData[key]];
        newArray[index] = value;
        setProposalData({ ...proposalData, [key]: newArray });
    };

    const handleDictArrayChange = (key, index, field, value) => {
        const newArray = [...proposalData[key]];
        newArray[index] = { ...newArray[index], [field]: value };
        setProposalData({ ...proposalData, [key]: newArray });
    };

    const handleNestedArrayChange = (key, index, subIndex, value) => {
        const newArray = [...proposalData[key]];
        const newSubArray = [...newArray[index]];
        newSubArray[subIndex] = value;
        newArray[index] = newSubArray;
        setProposalData({ ...proposalData, [key]: newArray });
    };


    const handleGenerate = async () => {
        setGenerating(true);
        setGeneratedPdfUrl(null);
        try {
            const payload = {
                ...proposalData
            };

            const response = await fetch('https://doc-generator-service.onrender.com/generate/proposal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to generate proposal');
            }

            const data = await response.json();
            setGeneratedPdfUrl(data.url);

        } catch (error) {
            console.error('Error generating proposal:', error);
            alert('Failed to generate proposal. Please try again.');
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

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <ThemedInput
                    label="Client Name"
                    value={proposalData.client_name}
                    onChange={(e) => setProposalData({ ...proposalData, client_name: e.target.value })}
                    disabled={readOnlyContext}
                />
            </div>

            {/* Discovery Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Discovery Phase</h3>
                {proposalData.discovery.map((item, index) => (
                    <div key={index} className="mb-2">
                        <ThemedInput
                            value={item}
                            onChange={(e) => handleArrayChange('discovery', index, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            {/* Solutions Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Proposed Solutions</h3>
                {proposalData.solutions.map((item, index) => (
                    <div key={index} className="mb-2">
                        <ThemedInput
                            value={item}
                            onChange={(e) => handleArrayChange('solutions', index, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            {/* Timeline Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Timeline</h3>
                {proposalData.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                        <div className="w-1/4">
                            <ThemedInput
                                value={item.phase}
                                onChange={(e) => handleDictArrayChange('timeline', index, 'phase', e.target.value)}
                                placeholder="Phase"
                            />
                        </div>
                        <div className="flex-1">
                            <ThemedInput
                                value={item.description}
                                onChange={(e) => handleDictArrayChange('timeline', index, 'description', e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div className="w-1/4">
                            <ThemedInput
                                value={item.time}
                                onChange={(e) => handleDictArrayChange('timeline', index, 'time', e.target.value)}
                                placeholder="Duration"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Pricing</h3>
                {proposalData.pricing.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                        <div className="flex-1">
                            <ThemedInput
                                value={item[0]}
                                onChange={(e) => handleNestedArrayChange('pricing', index, 0, e.target.value)}
                                placeholder="Service"
                            />
                        </div>
                        <div className="w-1/3">
                            <ThemedInput
                                value={item[1]}
                                onChange={(e) => handleNestedArrayChange('pricing', index, 1, e.target.value)}
                                placeholder="Price"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Addons Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Optional Add-ons</h3>
                {proposalData.addons.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                        <div className="flex-1">
                            <ThemedInput
                                value={item.title}
                                onChange={(e) => handleDictArrayChange('addons', index, 'title', e.target.value)}
                                placeholder="Add-on Name"
                            />
                        </div>
                        <div className="w-1/3">
                            <ThemedInput
                                value={item.price}
                                onChange={(e) => handleDictArrayChange('addons', index, 'price', e.target.value)}
                                placeholder="Price"
                            />
                        </div>
                    </div>
                ))}
            </div>


            <div className="mt-8 flex justify-end gap-4">
                {generatedPdfUrl && (
                    <a
                        href={generatedPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-[#00abad] text-[#00abad] font-semibold rounded-lg hover:bg-[#00abad]/10 transition-colors flex items-center gap-2"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        View Proposal
                    </a>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-6 py-3 bg-[#00abad] text-white font-semibold rounded-lg hover:bg-[#008c8e] transition-colors shadow-lg shadow-[#00abad]/30 flex items-center gap-2"
                >
                    {generating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
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
