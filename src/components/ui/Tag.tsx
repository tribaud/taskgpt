import React from "react";
const Tag: React.FC<{ label: string; onRemove?: () => void }> = ({ label, onRemove }) => (
  <span className="tag">
    {label}
    {onRemove && (
      <button className="tag-remove" onClick={onRemove} title="Supprimer le tag" style={{ marginLeft: 4 }}>
        ×
      </button>
    )}
  </span>
);
export default Tag;
