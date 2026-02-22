'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    isProcessing?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    isDangerous = false,
    isProcessing = false,
}: ConfirmModalProps) {
    // Fermer avec Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isProcessing) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Bloquer le scroll du body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isProcessing, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isProcessing) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className={`flex items-start justify-between p-6 pb-4 ${isDangerous ? 'border-b border-red-200 dark:border-red-900/30' : 'border-b border-gray-200 dark:border-gray-800'}`}>
                    <div className="flex items-center gap-3">
                        {isDangerous && (
                            <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                        )}
                        <h2 className={`text-xl font-semibold ${isDangerous ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-white'}`}>
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className={`flex-1 px-4 py-2.5 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                            isDangerous
                                ? 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800'
                                : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
                        }`}
                    >
                        {isProcessing ? 'Traitement...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
