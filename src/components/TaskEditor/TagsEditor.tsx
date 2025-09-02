import React, { useState } from "react";

type TagsEditorProps = {
  tags: string[];
  onChange?: (tags: string[]) => void;
  allTags?: string[];
};

const TagsEditor: React.FC<TagsEditorProps> = ({ tags, onChange, allTags }) => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered =
    allTags && input.trim()
      ? allTags.filter(
          t =>
            t.toLowerCase().includes(input.trim().toLowerCase()) &&
            !tags.includes(t)
        )
      : [];

  const handleAdd = (val?: string) => {
    const tag = (val ?? input).trim();
    if (tag && !tags.includes(tag)) {
      onChange?.([...tags, tag]);
      setInput("");
      setShowDropdown(false);
    }
  };

  const handleRemove = (i: number) => {
    onChange?.(tags.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", position: "relative" }}>
      {tags.map((tag, i) => (
        <span key={i} style={{
          background: "var(--tag-bg)",
          borderRadius: 2,
          padding: "1px 4px",
          marginRight: 2,
          marginBottom: 2,
          fontSize: "0.75em",
          display: "inline-flex",
          alignItems: "center",
          lineHeight: 1.2,
          maxWidth: 90,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          <span style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 70,
            display: "inline-block"
          }}>{tag}</span>
          {onChange && (
            <button
              type="button"
              style={{
                marginLeft: 2,
                background: "none",
                border: "none",
                color: "#aaa",
                cursor: "pointer",
                fontSize: "0.9em",
                lineHeight: 1
              }}
              onClick={() => handleRemove(i)}
              title="Supprimer le tag"
            >×</button>
          )}
        </span>
      ))}
      {onChange && (
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={input}
            onChange={e => {
              setInput(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setInput("");
            }}
            style={{ minWidth: 60, fontSize: "0.9em" }}
            placeholder="Ajouter…"
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            autoComplete="off"
          />
          {showDropdown && filtered.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 4,
                zIndex: 10,
                minWidth: 80,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              {filtered.map(tag => (
                <div
                  key={tag}
                  style={{
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "0.95em"
                  }}
                  onMouseDown={() => handleAdd(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          <button type="button" className="app-btn" onClick={() => handleAdd()} style={{ padding: "2px 8px", fontSize: "0.9em" }}>+</button>
        </div>
      )}
    </div>
  );
};

export default TagsEditor;
