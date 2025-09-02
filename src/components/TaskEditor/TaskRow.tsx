import React from "react";
import TagsEditor from "./TagsEditor";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  done: boolean;
  dependencies: string[];
  tags: string[];
};

type TaskRowProps = {
  task: Task;
  index: number;
};

const TaskRow: React.FC<TaskRowProps> = ({ task, index }) => {
  return (
    <tr>
      <td>
        <input type="checkbox" checked={task.done} readOnly />
      </td>
      <td title="Double-clic pour éditer">{task.id}</td>
      <td>{task.title}</td>
      <td>{task.description}</td>
      <td>{task.priority}</td>
      <td>{task.dependencies.join(", ")}</td>
      <td>
        <TagsEditor tags={task.tags} />
      </td>
      <td>
        <button>↑</button>
        <button>↓</button>
        <button>🗑️</button>
      </td>
    </tr>
  );
};

export default TaskRow;
