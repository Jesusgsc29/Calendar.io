import { useState, useEffect } from 'react';
import { fetchTasks, fetchMe, logout, loginWithGoogle } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import TaskTable from '../components/TaskTable';
import FinishedTable from '../components/FinishedTable';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [me, taskList] = await Promise.all([fetchMe(), fetchTasks()]);
        setUser(me);
        setTasks(taskList);
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleTaskAdded(task) {
    setTasks(prev => [task, ...prev]);
  }

  function handleTaskUpdate(updated) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  function handleTaskDelete(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    setTasks([]);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Calendar.io</h1>
        <p className="text-gray-500">Tasks + Google Calendar in one place</p>
        <button
          onClick={loginWithGoogle}
          className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Calendar.io</span>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            📅 Open Google Calendar ↗
          </a>
        </div>
        <div className="flex items-center gap-4">
          <img src={user.picture} className="w-8 h-8 rounded-full" alt={user.name} />
          <span className="text-sm text-gray-700">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Form */}
        <TaskForm onTaskAdded={handleTaskAdded} />

        {/* Active tasks */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active tasks ({tasks.filter(t => !t.isFinished).length})
          </h2>
          <TaskTable
            tasks={tasks}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
          />
        </section>

        {/* Finished tasks */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <FinishedTable tasks={tasks} />
        </section>
      </main>
    </div>
  );
}