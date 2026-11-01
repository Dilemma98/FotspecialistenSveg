
import type { ReactNode, FormEvent } from "react";
import "./editModal.css";

interface EditModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  isSaving?: boolean;
}

export default function EditModal({
  isOpen,
  title,
  children,
  onClose,
  onSave,
  isSaving = false,
}: EditModalProps) {

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="editModalOverlay">
      <div className="editModal">
        <div className="editModalHeader">
          <div>
            <span className="editModalEyebrow">
              FOTSPECIALISTEN
            </span>
            <h2>{title}</h2>
          </div>

          <button
            type="button"
            className="editModalClose"
            onClick={onClose}
            aria-label="Stäng redigeraren"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="editModalBody">
            {children}
          </div>

          <div className="editModalFooter">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="editModalCancel"
            >
              Avbryt
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="editModalSave"
            >
              {isSaving ? "Sparar..." : "Spara ändringar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
