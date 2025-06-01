import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const App = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', description: '' });
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!('Notification' in window)) return;

    Notification.requestPermission().then((param) => {
      if (param === 'granted') {
        const now = new Date();
        events.forEach((event) => {
          const eventDate = new Date(event.date);
          const diffInHours = (eventDate - now) / (1000 * 60 * 60);

          if (diffInHours > 0 && diffInHours < 24) {
            new Notification('Upcoming Event Reminder', {
              body: `${event.title} is happening soon!`,
            });
          }
        });
      }
    });
  }, [events]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setEvents([...events, { ...form, id: Date.now(), status: 'Upcoming' }]);
    setForm({ title: '', date: '', description: '' });
  };

  const updateStatus = (id, status) => {
    setEvents(events.map(e => (e.id === id ? { ...e, status } : e)));
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6">
<h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
  Event Planner Page
</h1>

        <form onSubmit={addEvent} className="space-y-4">
          <input
            type="text"
            placeholder="Name of the Event"
            className="w-full p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <textarea
            placeholder="Mention the Description of the event"
            className="w-full p-2 border rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Event
          </button>
        </form>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by title or status..."
            className="w-full p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-8 space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-sm text-gray-500">{format(new Date(event.date), 'PPP')}</p>
                  <p className="mt-1">{event.description}</p>
                </div>
                <select
                  value={event.status}
                  onChange={(e) => updateStatus(event.id, e.target.value)}
                  className="border rounded p-1 text-sm"
                >
                  <option>Upcoming</option>
                  <option>Done</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
