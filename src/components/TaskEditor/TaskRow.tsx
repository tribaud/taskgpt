import React from "react";
import TagsEditor from "./TagsEditor";
import { Task } from "./TaskEditor";

type TaskRowProps = {
  task: Task;
  index: number;
  onEdit: (index: number, updated: Partial<Task>) => void;
  onDelete: (index: number) => void;
};

const TaskRow: React.FC<TaskRowProps> = ({ task, index, onEdit, onDelete }) => {
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
        <input
          type="text"
          value={task.description}
          onChange={e => onEdit(index, { description: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={task.priority}
          onChange={e => onEdit(index, { priority: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={task.dependencies.join(", ")}
          onChange={e =>
            onEdit(index, {
              dependencies: e.target.value
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
            })
          }
        />
      </td>
      <td>
        <TagsEditor tags={task.tags} />
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
