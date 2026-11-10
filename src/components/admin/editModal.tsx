import { useRef, useState } from "react";
import type { ReactNode } from "react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragOffset = useRef({ x: 0, y: 0 });
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't drag when clicking the close button
    if ((e.target as HTMLElement).closest("button")) return;

    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="editModalOverlay">
      <div
        className="editModal"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div
          className="editModalHeader"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div>
            <span className="editModalEyebrow">FOTSPECIALISTEN</span>
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
          <div className="editModalBody">{children}</div>

          <div className="editModalFooter">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="editModalCancel"
            >
              Avbryt
            </button>

            <button type="submit" disabled={isSaving} className="editModalSave">
              {isSaving ? "Sparar..." : "Spara ändringar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
