'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/app/components/ui/GlassCard';

export default function FileExplorer({ projectId }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (projectId) {
            fetchFiles();
        }
    }, [projectId]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/projects/${projectId}/files`);
            const data = await res.json();
            if (res.ok) {
                setFiles(data.files || []);
            } else {
                setError(data.error || 'Failed to fetch files');
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch(`/api/projects/${projectId}/files`, {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Upload failed');
                }
            }
            await fetchFiles();
        } catch (error) {
            console.error('Error uploading files:', error);
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const res = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFiles(files.filter(f => f.id !== fileId));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Connection error');
        }
    };

    const handleDownload = (fileId, fileName) => {
        // Open in new tab or trigger download
        window.open(`/api/projects/${projectId}/files/${fileId}`, '_blank');
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.includes('image')) return '🖼️';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return '📊';
        if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
        if (mimeType.includes('folder')) return '📁';
        return '📎';
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading && files.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading files...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-bold" style={{ color: '#1d1d1f' }}>Shared Files</h2>
                <div className="relative">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    <button
                        className={`px-4 py-2 bg-[#10b981] text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 shadow-lg shadow-[#10b981]/10 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                                </svg>
                                Upload Files
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}

            {files.length === 0 ? (
                <GlassCard p={10} className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                            📁
                        </div>
                        <p className="text-lg font-medium" style={{ color: '#1d1d1f' }}>No files yet</p>
                        <p className="text-sm" style={{ color: '#86868b' }}>
                            Upload documents, images, and other files to share them with the project team.
                        </p>
                    </div>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                        <GlassCard key={file.id} p={4} className="hover:shadow-md transition-shadow group relative">
                            <div className="flex items-start gap-3">
                                <div className="text-3xl bg-gray-50 p-2 rounded-lg">
                                    {getFileIcon(file.mimeType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm truncate" title={file.name} style={{ color: '#1d1d1f' }}>
                                        {file.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs" style={{ color: '#86868b' }}>
                                            {formatSize(file.size)}
                                        </p>
                                        <span className="text-gray-300">•</span>
                                        <p className="text-xs" style={{ color: '#86868b' }}>
                                            {new Date(file.createdTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDownload(file.id, file.name)}
                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-[#e53e3e]"
                                        title="Download"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                                        title="Delete"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
