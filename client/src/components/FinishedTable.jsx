export default function FinishedTable({ tasks }) {
    const finished = tasks.filter(t => t.isFinished);
  
    if (finished.length === 0) return null;
  
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Finished tasks ({finished.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-2 w-8"></th>
                <th className="pb-2 text-gray-400 font-medium">Task</th>
                <th className="pb-2 text-gray-400 font-medium">Type</th>
                <th className="pb-2 text-gray-400 font-medium">Date</th>
                <th className="pb-2 text-gray-400 font-medium">Completed</th>
              </tr>
            </thead>
            <tbody>
              {finished.map(task => (
                <tr key={task.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <input type="checkbox" checked readOnly className="w-4 h-4 rounded accent-indigo-600" />
                  </td>
                  <td className="py-3">
                    {/* Task name in red as specified */}
                    <span className="text-red-500 line-through">{task.name}</span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {task.type === 'BIRTHDAY' ? '🎂' : task.type === 'EVENT' ? '📅' : '✅'}
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(task.date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td className="py-3 text-gray-400">
                    {task.finishedAt
                      ? new Date(task.finishedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }