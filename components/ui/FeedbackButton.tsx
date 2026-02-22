'use client';

import { Mail, MessageCircle, MessageSquare, Send, X } from 'lucide-react';
import { useState } from 'react';
import { ToastContainer, useToast } from './Toast';

type FeedbackType = 'question' | 'bug' | 'feature' | 'other';

export function FeedbackButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<FeedbackType>('question');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toasts, addToast, removeToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !subject || !message) {
            addToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        setIsSubmitting(true);

        // Simulation d'envoi
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Ici, vous intégrerez l'envoi réel vers votre backend
        console.log('Feedback envoyé:', { feedbackType, email, subject, message });

        addToast('Votre message a été envoyé avec succès !', 'success');
        
        // Reset form
        setEmail('');
        setSubject('');
        setMessage('');
        setFeedbackType('question');
        setIsOpen(false);
        setIsSubmitting(false);
    };

    const feedbackTypes = [
        { value: 'question', label: 'Question', icon: MessageSquare, color: 'blue' },
        { value: 'bug', label: 'Bug / Problème', icon: MessageCircle, color: 'red' },
        { value: 'feature', label: 'Suggestion', icon: MessageCircle, color: 'green' },
        { value: 'other', label: 'Autre', icon: MessageCircle, color: 'gray' },
    ];

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
                aria-label="Envoyer un message"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Une question ? Contactez-nous
                </span>
            </button>

            {/* Drawer/Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed right-0 top-0 bottom-0 w-full sm:w-112.5 bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <MessageCircle className="h-6 w-6" />
                                    Contactez-nous
                                </h2>
                                <p className="text-blue-100 text-sm mt-1">
                                    Nous sommes là pour vous aider
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                aria-label="Fermer"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Type de feedback */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                    Type de message
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {feedbackTypes.map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFeedbackType(type.value as FeedbackType)}
                                                className={`p-3 rounded-lg border-2 transition-all text-left ${
                                                    feedbackType === type.value
                                                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <Icon className={`h-5 w-5 mb-1 ${
                                                    feedbackType === type.value
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`} />
                                                <div className={`text-sm font-medium ${
                                                    feedbackType === type.value
                                                        ? 'text-blue-900 dark:text-blue-100'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {type.label}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="feedback-email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Votre email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="feedback-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Sujet */}
                            <div>
                                <label htmlFor="feedback-subject" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Sujet
                                </label>
                                <input
                                    id="feedback-subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Ex: Question sur les factures"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="feedback-message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="feedback-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Décrivez votre question ou préoccupation en détail..."
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>💡 Temps de réponse:</strong> Nous répondons généralement sous 24-48h.
                                </p>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Envoyer le message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </>
    );
}
