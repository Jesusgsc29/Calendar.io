import { google } from 'googleapis';

function getOAuthClient(user) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return oauth2Client;
}

// Build a Google Calendar event object from a task
function buildEventPayload(task) {
  const isBirthday = task.type === 'BIRTHDAY';
  const isAllDay = !task.time;

  let start, end;

  if (isBirthday) {
    // Birthday: all-day yearly recurring
    const dateStr = task.date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    start = { date: dateStr };
    end = { date: dateStr };
  } else if (isAllDay) {
    const dateStr = task.date.toISOString().split('T')[0];
    start = { date: dateStr };
    end = { date: dateStr };
  } else {
    // Timed event: combine date + time
    const dateStr = task.date.toISOString().split('T')[0];
    const startDateTime = new Date(`${dateStr}T${task.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour
    start = { dateTime: startDateTime.toISOString(), timeZone: 'America/New_York' };
    end = { dateTime: endDateTime.toISOString(), timeZone: 'America/New_York' };
  }

  const event = {
    summary: isBirthday ? `🎂 ${task.birthdayPerson || task.name}'s Birthday` : task.name,
    description: task.description || '',
    start,
    end,
  };

  // Birthday: repeat yearly
  if (isBirthday) {
    event.recurrence = ['RRULE:FREQ=YEARLY'];
  }

  // Daily recurring task
  if (task.isRecurring && task.type === 'TASK') {
    event.recurrence = ['RRULE:FREQ=DAILY'];
  }

  // Reminder for birthdays
  if (isBirthday && task.reminderDays) {
    event.reminders = {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: task.reminderDays * 24 * 60 },
        { method: 'popup', minutes: task.reminderDays * 24 * 60 },
      ],
    };
  }

  return event;
}

export async function createCalendarEvent(user, task) {
  const auth = getOAuthClient(user);
  const calendar = google.calendar({ version: 'v3', auth });
  const payload = buildEventPayload(task);

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: payload,
  });

  return response.data.id; // google event ID
}

export async function updateCalendarEvent(user, googleEventId, task) {
  const auth = getOAuthClient(user);
  const calendar = google.calendar({ version: 'v3', auth });
  const payload = buildEventPayload(task);

  await calendar.events.update({
    calendarId: 'primary',
    eventId: googleEventId,
    resource: payload,
  });
}

export async function deleteCalendarEvent(user, googleEventId) {
  const auth = getOAuthClient(user);
  const calendar = google.calendar({ version: 'v3', auth });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId: googleEventId,
  });
}