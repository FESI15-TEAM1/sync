'use client';

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
} from 'react';

import IconButton from './IconButton';

type ModalContextType = {
  onClose: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Modal 컴포넌트 안에서 사용해야 합니다.');
  }
  return context;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  children: ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  closeOnBackdropClick = true,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        onClick={handleBackdropClick}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="bg-bg-primary flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl p-5 shadow-xl"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { onClose } = useModal();

  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 id="modal-title" className="text-text-primary text-lg font-bold">
        {children}
      </h2>

      <IconButton
        size="md"
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="text-text-primary cursor-pointer px-1 text-xl leading-none"
      >
        ✕
      </IconButton>
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 scrollbar-none overflow-y-auto">{children}</div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {children}
    </div>
  );
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
