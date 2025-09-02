import React from "react";
type DropdownProps = {
  open: boolean;
  items: string[];
  selectedIndex?: number;
  onSelect: (item: string, index: number) => void;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
};
const Dropdown: React.FC<DropdownProps> = ({ open, items, selectedIndex, onSelect, onClose }) => {
  if (!open) return null;
  return (
    <div className="dropdown" tabIndex={-1} onBlur={onClose}>
      {items.map((item, i) => (
        <div
          key={item}
          className={"dropdown-item" + (i === selectedIndex ? " selected" : "")}
          onMouseDown={() => onSelect(item, i)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
export default Dropdown;
