import { updateTask, deleteTask } from '../api/tasks';

function typeLabel(type) {
  if (type === 'BIRTHDAY') return '🎂';
  if (type === 'EVENT') return '📅';
  return '✅';
}

export default function TaskTable({ tasks, onUpdate, onDelete }) {
  const active = tasks.filter(t => !t.isFinished);

  async function handleCheck(task) {
    const updated = await updateTask(task.id, { isFinished: true });
    onUpdate(updated);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    await deleteTask(id);
    onDelete(id);
  }

  if (active.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No active tasks — add one above!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="pb-2 w-8"></th>
            <th className="pb-2 text-gray-500 font-medium">Task</th>
            <th className="pb-2 text-gray-500 font-medium">Type</th>
            <th className="pb-2 text-gray-500 font-medium">Date</th>
            <th className="pb-2 text-gray-500 font-medium">Time</th>
            <th className="pb-2 text-gray-500 font-medium">Recurring</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {active.map(task => (
            <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => handleCheck(task)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
              </td>
              <td className="py-3 font-medium text-gray-900">{task.name}</td>
              <td className="py-3 text-lg">{typeLabel(task.type)}</td>
              <td className="py-3 text-gray-600">
                {new Date(task.date).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
                })}
              </td>
              <td className="py-3 text-gray-600">{task.time || '—'}</td>
              <td className="py-3">
                {task.isRecurring
                  ? <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs">Daily</span>
                  : <span className="text-gray-400">—</span>
                }
              </td>
              <td className="py-3 text-right">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}