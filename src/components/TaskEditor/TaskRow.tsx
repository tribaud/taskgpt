import React from "react";
import TagsEditor from "./TagsEditor";
import { Task } from "./TaskEditor";

type TaskRowProps = {
  task: Task;
  index: number;
  onEdit: (index: number, updated: Partial<Task>) => void;
  onDelete: (index: number) => void;
  allTags: string[];
};

const TaskRow: React.FC<TaskRowProps> = ({ task, index, onEdit, onDelete, allTags }) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={task.done}
          onChange={e => onEdit(index, { done: e.target.checked })}
        />
      </td>
      <td title="Double-clic pour éditer">{task.id}</td>
      <td>
        <input
          type="text"
          value={task.title}
          onChange={e => onEdit(index, { title: e.target.value })}
        />
      </td>
      <td>
        <textarea
          value={task.description}
          onChange={e => onEdit(index, { description: e.target.value })}
          style={{
            width: "100%",
            minWidth: 180,
            maxWidth: 600,
            minHeight: 32,
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: "inherit"
          }}
        />
      </td>
      <td>
        <select
          value={task.priority}
          onChange={e => onEdit(index, { priority: e.target.value })}
          style={{ width: 90 }}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="blocked">blocked</option>
          <option value="cancelled">cancelled</option>
        </select>
      </td>
      {/* dependencies supprimé */}
      <td>
        <TagsEditor
          tags={task.tags}
          onChange={tags => onEdit(index, { tags })}
          allTags={allTags}
        />
      </td>
      <td>
        <button onClick={() => onEdit(index, { /* TODO: move up */ })}>↑</button>
        <button onClick={() => onEdit(index, { /* TODO: move down */ })}>↓</button>
        <button onClick={() => onDelete(index)}>🗑️</button>
      </td>
    </tr>
  );
};

export default TaskRow;
