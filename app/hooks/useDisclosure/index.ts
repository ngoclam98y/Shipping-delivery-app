import { useCallback, useState } from 'react';

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export const useDisclosure = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const closeWithoutBackdrop = (reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason && reason === 'backdropClick') {
            return;
        }

        if (reason && reason === 'escapeKeyDown') {
            return;
        }

        setIsOpen(false);
    };

    return { isOpen, open, close, closeWithoutBackdrop };
};