import React from "react";
import Button from "../ui/Button";

type ToolbarProps = {
  onAdd: () => void;
  onSort: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onAdd, onSort }) => (
  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
    <Button onClick={onAdd}>➕ Ajouter une tâche</Button>
    <Button onClick={onSort}>↕️ Réordonner (T… croissant)</Button>
    {/* TODO: autres boutons (ouvrir, sauvegarder, exporter, settings, etc.) */}
  </div>
);

export default Toolbar;
