import { useState, useEffect, useCallback } from 'react';
import service from '@/services/database';

export default function useFileHandler(userData) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fetch Files
    const fetchFiles = useCallback(async () => {
        if (!userData?.$id) return;
        setLoading(true);
        try {
            const response = await service.getFiles(userData.$id);
            if (response) {
                setFiles(response.documents);
            }
        } catch (err) {
            setError("Failed to load files.");
        } finally {
            setLoading(false);
        }
    }, [userData]);

    // Initial Load
    useEffect(() => {
        if (userData?.$id) {
            fetchFiles();
        }
    }, [userData, fetchFiles]);

    // 2. Upload Handler
    const uploadFiles = async (fileList) => {
        if (!userData?.$id || !fileList.length) return 0;
        
        setUploading(true);
        let successCount = 0;

        // Parallel Uploads allowed, but sequential is safer for rate limits
        for (const file of fileList) {
            const res = await service.uploadFile(file, userData.$id);
            if (res) successCount++;
        }

        if (successCount > 0) {
            await fetchFiles(); // Refresh list
        }
        setUploading(false);
        return successCount;
    };

    // 3. Delete Handler
    const deleteFile = async (docId, bucketFileId) => {
        const success = await service.deleteFile(docId, bucketFileId);
        if (success) {
            setFiles(prev => prev.filter(f => f.$id !== docId));
        }
        return success;
    };

    return {
        files,
        loading,
        uploading,
        uploadFiles,
        deleteFile,
        refreshFiles: fetchFiles
    };
}