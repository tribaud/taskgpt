import React from "react";
import Button from "../ui/Button";

type ToolbarProps = {
  onAdd: () => void;
  onSort: () => void;
  onOpen?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  onAdd,
  onSort,
  onOpen,
  onSave,
  onExport,
  onSettings
}) => (
  <div style={{ marginBottom: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
    <Button onClick={onAdd}>➕ Ajouter une tâche</Button>
    <Button onClick={onSort}>↕️ Réordonner (T… croissant)</Button>
    <Button onClick={onOpen}>📂 Ouvrir</Button>
    <Button onClick={onSave}>💾 Sauvegarder JSON</Button>
    <Button onClick={onExport}>📄 Exporter Markdown</Button>
    <Button onClick={onSettings}>⚙️ Paramètres</Button>
  </div>
);

export default Toolbar;
