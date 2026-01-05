'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/app/components/ui/GlassCard';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';

export default function InvoiceGenerator({
    initialClientId = '',
    initialProjectId = '',
    readOnlyContext = false,
    clients = [],
    projects = []
}) {
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState(initialClientId);
    const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
    const [clientDetails, setClientDetails] = useState({
        client_name: '',
        client_address: '',
        client_city: '',
        client_country: '',
        project_name: '',
    });

    const [items, setItems] = useState([
        { description: 'Web Development Services', quantity: 1, price: 0 }
    ]);

    const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

    // Handle Client Selection
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find(c => c._id === selectedClientId);
            if (client) {
                setClientDetails(prev => ({
                    ...prev,
                    client_name: client.name,
                    client_address: client.address || '',
                    client_city: client.city || '',
                    client_country: client.country || '',
                }));
            }
        }
    }, [selectedClientId, clients]);

    // Handle Project Selection
    useEffect(() => {
        if (selectedProjectId) {
            const project = projects.find(p => p._id === selectedProjectId);
            if (project) {
                setClientDetails(prev => ({
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

    // Sync with props if they change (e.g. data loaded later)
    useEffect(() => {
        if (initialClientId) setSelectedClientId(initialClientId);
        if (initialProjectId) setSelectedProjectId(initialProjectId);
    }, [initialClientId, initialProjectId]);


    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setGeneratedPdfUrl(null);
        try {
            const subtotal = calculateTotal();
            const taxRate = 0.18; // Example tax rate
            const tax = subtotal * taxRate;
            const total = subtotal + tax;

            const payload = {
                client_name: clientDetails.client_name,
                client_address: clientDetails.client_address || '123 Tech Street',
                client_city: clientDetails.client_city || 'Innovation City',
                client_country: clientDetails.client_country || 'Digital World',
                items: items.map(item => ({
                    name: item.description,
                    price: (Number(item.price) * Number(item.quantity)).toFixed(2)
                })),
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                invoice_date: new Date().toISOString().split('T')[0],
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };

            // Call the Doc Generator API
            const response = await fetch('https://doc-generator-service.onrender.com/generate/invoice-premium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to generate invoice');
            }

            const data = await response.json();
            setGeneratedPdfUrl(data.url);

        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('Failed to generate invoice. Please try again.');
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
                    value={clientDetails.client_name}
                    onChange={(e) => setClientDetails({ ...clientDetails, client_name: e.target.value })}
                    disabled={readOnlyContext}
                />
                <ThemedInput
                    label="Project Name"
                    value={clientDetails.project_name}
                    onChange={(e) => setClientDetails({ ...clientDetails, project_name: e.target.value })}
                    disabled={readOnlyContext}
                />
                <div className="col-span-2">
                    <ThemedInput
                        label="Billing Address"
                        value={clientDetails.client_address}
                        onChange={(e) => setClientDetails({ ...clientDetails, client_address: e.target.value })}
                        placeholder="Street Address"
                        disabled={readOnlyContext}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-[#1d1d1f]">Line Items</h3>
                <div className="flex flex-col gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <ThemedInput
                                    label={index === 0 ? "Description" : ""}
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    placeholder="Service description"
                                />
                            </div>
                            <div className="w-24">
                                <ThemedInput
                                    label={index === 0 ? "Qty" : ""}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                />
                            </div>
                            <div className="w-32">
                                <ThemedInput
                                    label={index === 0 ? "Price" : ""}
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => removeItem(index)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-[2px]"
                                disabled={items.length === 1}
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addItem}
                        className="self-start px-4 py-2 text-[#e53e3e] font-medium hover:bg-[#e53e3e]/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                        + Add Item
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-end border-t border-gray-200 pt-6">
                <div className="w-full md:w-1/3 space-y-2">
                    <div className="flex justify-between text-[#86868b]">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#86868b]">
                        <span>Tax (18%)</span>
                        <span>${(calculateTotal() * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[#1d1d1f] pt-2 border-t border-gray-100">
                        <span>Total</span>
                        <span>${(calculateTotal() * 1.18).toFixed(2)}</span>
                    </div>
                </div>
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
                        View Invoice
                    </a>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-6 py-3 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#008c8e] transition-colors shadow-lg shadow-[#e53e3e]/30 flex items-center gap-2"
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
