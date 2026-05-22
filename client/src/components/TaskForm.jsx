import { useState } from 'react';
import { createTask } from '../api/tasks';

const defaultForm = {
  type: 'TASK',
  name: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  time: '',
  hasTime: false,
  isRecurring: false,
  birthdayPerson: '',
  reminderDays: 7,
};

export default function TaskForm({ onTaskAdded }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: form.type === 'BIRTHDAY' ? (form.birthdayPerson + "'s Birthday") : form.name,
        type: form.type,
        date: form.date,
        time: form.hasTime ? form.time : null,
        description: form.description || null,
        isRecurring: form.isRecurring,
        birthdayPerson: form.type === 'BIRTHDAY' ? form.birthdayPerson : null,
        reminderDays: form.type === 'BIRTHDAY' ? form.reminderDays : null,
      };

      const task = await createTask(payload);
      onTaskAdded(task);
      setForm(defaultForm);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Add new entry</h2>

      {/* Type selector */}
      <div className="flex gap-2">
        {['TASK', 'EVENT', 'BIRTHDAY'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => set('type', t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              form.type === t
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'TASK' ? '✅ Task' : t === 'EVENT' ? '📅 Event' : '🎂 Birthday'}
          </button>
        ))}
      </div>

      {/* Birthday fields */}
      {form.type === 'BIRTHDAY' && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Person's name</label>
            <input
              required
              value={form.birthdayPerson}
              onChange={e => set('birthdayPerson', e.target.value)}
              placeholder="e.g. Mom"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Birthday date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Remind me (days before)</label>
            <input
              type="number"
              min={0}
              max={30}
              value={form.reminderDays}
              onChange={e => set('reminderDays', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </>
      )}

      {/* Event fields */}
      {form.type === 'EVENT' && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Event name</label>
            <input
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Team dinner"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasTime}
              onChange={e => set('hasTime', e.target.checked)}
            />
            Set a specific time?
          </label>
          {form.hasTime && (
            <input
              type="time"
              value={form.time}
              onChange={e => set('time', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          )}
        </>
      )}

      {/* Task fields */}
      {form.type === 'TASK' && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Task name</label>
            <input
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Review project proposal"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasTime}
              onChange={e => set('hasTime', e.target.checked)}
            />
            Set a specific time?
          </label>
          {form.hasTime && (
            <input
              type="time"
              value={form.time}
              onChange={e => set('time', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          )}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isRecurring}
              onChange={e => set('isRecurring', e.target.checked)}
            />
            Repeat every day?
          </label>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2 text-sm transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Add to calendar'}
      </button>
    </form>
  );
}