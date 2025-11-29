import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';


interface ImportDropzoneProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export function ImportDropzone({ onFileSelect, isLoading }: ImportDropzoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const validateAndUpload = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== 'csv' && extension !== 'ofx') {
            setError('Formato inválido. Por favor, envie um arquivo .csv ou .ofx');
            return;
        }
        setError(null);
        onFileSelect(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${dragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".csv,.ofx"
                    disabled={isLoading}
                />

                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">Clique para enviar</span> ou arraste o arquivo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Suporta arquivos OFX (Extrato Bancário) e CSV
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
}
