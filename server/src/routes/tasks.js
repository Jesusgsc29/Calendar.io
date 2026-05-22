import express from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '../services/googleCalendar.js';

const router = express.Router();
router.use(requireAuth);

// GET /tasks — get all tasks for logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isFinished: 'asc' }, { date: 'asc' }],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks — create a task and sync to Google Calendar
router.post('/', async (req, res) => {
  try {
    const {
      name, type, description, date, time,
      isRecurring, birthdayPerson, reminderDays,
    } = req.body;

    // Create task in DB first
    const task = await prisma.task.create({
      data: {
        userId: req.user.id,
        name,
        type,         // 'TASK' | 'EVENT' | 'BIRTHDAY'
        description,
        date: new Date(date),
        time: time || null,
        isRecurring: isRecurring || false,
        birthdayPerson: birthdayPerson || null,
        reminderDays: reminderDays || null,
      },
    });

    // Sync to Google Calendar
    if (type === 'EVENT' || type === 'BIRTHDAY') {
    try {
      const googleEventId = await createCalendarEvent(req.user, task);
      const updatedTask = await prisma.task.update({
        where: { id: task.id },
        data: { googleEventId },
      });
      return res.status(201).json(updatedTask);
    } catch (calendarErr) {
      // Calendar sync failed — still return the task
      console.error('Calendar sync error:', calendarErr.message);
      return res.status(201).json({ ...task, calendarError: 'Could not sync to Google Calendar' });
    }
    }

    // TASKs skip Calendar and return immediately
    return res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /tasks/:id — update (edit or mark finished)
router.patch('/:id', async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const {
      name, type, description, date, time,
      isRecurring, birthdayPerson, reminderDays, isFinished,
    } = req.body;

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(time !== undefined && { time }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(birthdayPerson !== undefined && { birthdayPerson }),
        ...(reminderDays !== undefined && { reminderDays }),
        ...(isFinished !== undefined && {
          isFinished,
          finishedAt: isFinished ? new Date() : null,
        }),
      },
    });

    // Sync update to Google Calendar
    if (existing.googleEventId && existing.type !== 'TASK') {
      try {
        await updateCalendarEvent(req.user, existing.googleEventId, updated);
      } catch (calendarErr) {
        console.error('Calendar update error:', calendarErr.message);
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    // Delete from Google Calendar first
    if (existing.googleEventId) {
      try {
        await deleteCalendarEvent(req.user, existing.googleEventId);
      } catch (calendarErr) {
        console.error('Calendar delete error:', calendarErr.message);
      }
    }

    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;