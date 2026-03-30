import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    onSubmit?: (e: React.FormEvent) => void;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = '500px',
    onSubmit
}) => {
    // Escape key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; 
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div 
            className="modal-content animate-in zoom-in" 
            style={{ maxWidth }} 
            onClick={(e) => e.stopPropagation()}
        >
            <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                <button 
                    type="button"
                    className="btn btn-ghost" 
                    style={{ padding: '4px' }}
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="modal-body">
                {children}
            </div>

            {footer && (
                <div className="modal-footer">
                    {footer}
                </div>
            )}
        </div>
    );

    return (
        <div className="modal-overlay animate-in fade-in" onClick={onClose}>
            {onSubmit ? (
                <form 
                    onSubmit={onSubmit} 
                    className="modal-content animate-in zoom-in" 
                    style={{ maxWidth, display: 'flex', flexDirection: 'column' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button 
                            type="button"
                            className="btn btn-ghost" 
                            style={{ padding: '4px' }}
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {children}
                    </div>

                    {footer && (
                        <div className="modal-footer">
                            {footer}
                        </div>
                    )}
                </form>
            ) : modalContent}
        </div>
    );
};
