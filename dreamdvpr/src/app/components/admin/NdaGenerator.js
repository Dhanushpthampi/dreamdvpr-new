'use client';

import { useState, useEffect } from 'react';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';

export default function NdaGenerator({
    initialClientId = '',
    readOnlyContext = false,
    clients = []
}) {
    const [generating, setGenerating] = useState(false);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState(initialClientId);

    const [ndaData, setNdaData] = useState({
        client_name: '',
        counterparty_name: '',
        effective_date: new Date().toISOString().split('T')[0],
        jurisdiction: 'State of California'
    });

    const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

    // Handle Client Selection
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find(c => c._id === selectedClientId);
            if (client) {
                setNdaData(prev => ({
                    ...prev,
                    client_name: client.name
                }));
            }
        }
    }, [selectedClientId, clients]);

    useEffect(() => {
        if (initialClientId) setSelectedClientId(initialClientId);
    }, [initialClientId]);


    const handleGenerate = async () => {
        setGenerating(true);
        setGeneratedPdfUrl(null);
        try {
            const payload = {
                ...ndaData
            };

            const response = await fetch('https://doc-generator-service.onrender.com/generate/nda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to generate NDA');
            }

            const data = await response.json();
            setGeneratedPdfUrl(data.url);

        } catch (error) {
            console.error('Error generating NDA:', error);
            alert('Failed to generate NDA. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const clientOptions = clients.map(c => ({ value: c._id, label: c.name }));

    return (
        <div className="flex flex-col gap-6">
            {!readOnlyContext && (
                <div className="grid grid-cols-1 gap-6">
                    <ThemedSelect
                        label="Select Client (Disclosing Party)"
                        placeholder="Choose a client..."
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        options={clientOptions}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ThemedInput
                    label="Disclosing Party Name"
                    value={ndaData.client_name}
                    onChange={(e) => setNdaData({ ...ndaData, client_name: e.target.value })}
                    disabled={readOnlyContext}
                />
                <ThemedInput
                    label="Receiving Party Name"
                    value={ndaData.counterparty_name}
                    onChange={(e) => setNdaData({ ...ndaData, counterparty_name: e.target.value })}
                    placeholder="Name of person/entity signing"
                />
                <ThemedInput
                    label="Effective Date"
                    type="date"
                    value={ndaData.effective_date}
                    onChange={(e) => setNdaData({ ...ndaData, effective_date: e.target.value })}
                />
                <ThemedInput
                    label="Jurisdiction"
                    value={ndaData.jurisdiction}
                    onChange={(e) => setNdaData({ ...ndaData, jurisdiction: e.target.value })}
                />
            </div>


            <div className="mt-8 flex justify-end gap-4">
                {generatedPdfUrl && (
                    <a
                        href={generatedPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-[#c53030] text-[#c53030] font-semibold rounded-lg hover:bg-[#c53030]/10 transition-colors flex items-center gap-2"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        View NDA
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
