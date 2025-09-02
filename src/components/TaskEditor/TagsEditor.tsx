import React from "react";

type TagsEditorProps = {
  tags: string[];
};

const TagsEditor: React.FC<TagsEditorProps> = ({ tags }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {tags.map((tag, i) => (
        <span key={i} style={{
          background: "#e1e4e8",
          borderRadius: 3,
          padding: "2px 6px",
          marginRight: 2,
          fontSize: "0.9em",
          display: "inline-flex",
          alignItems: "center"
        }}>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagsEditor;
