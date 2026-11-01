export default function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="editButton" onClick={onClick}>
      ✎ Redigera avsnitt
    </button>
  );
}