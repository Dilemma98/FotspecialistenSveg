
interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      className="editButton"
      onClick={onClick}
      aria-label="Redigera innehåll"
      title="Redigera innehåll"
    >
      ✎
    </button>
  );
}
