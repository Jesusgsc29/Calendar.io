# Calendar.io 📅

🌐 **Live app: https://calendario-tan-sigma.vercel.app**

> Replace the link above with your Vercel URL once deployed.

A task and event manager that syncs directly with your Google Calendar. Add tasks, events, and birthdays in one place — events and birthdays automatically appear in your Google Calendar, while your daily tasks stay organized in a clean table that resets every day.

---

## Features

- **Three entry types** — Tasks, Events, and Birthdays, each with their own settings
- **Google Calendar sync** — Events and birthdays are automatically added to your Google Calendar when created
- **Daily task reset** — Active tasks and finished tasks clear every night at midnight, keeping your list fresh every day
- **Recurring tasks** — Mark a task as "repeat every day" and it won't be cleared at midnight
- **Smart task table** — Events only appear on their actual day; birthdays never clutter the task list
- **Finished tasks table** — Completed tasks move to a separate table with red text, so you can see what you've done during the day
- **Quick Calendar access** — One-click link to open Google Calendar directly from the app
- **Google login** — Sign in with your Google account, no separate password needed

---

## How to use the app

### Signing in

Open the app and click **Sign in with Google**. You'll be asked to authorize access to your Google Calendar — this is required so the app can add events on your behalf. Each user's data is completely separate and tied to their own Google account.

---

### Adding a Task

Tasks are for things you need to do **today**.

1. Select **✅ Task** in the form
2. Enter the task name
3. Optionally set a specific time
4. Toggle **Repeat every day?** if you want it to persist across daily resets
5. Click **Add to calendar**

The task appears immediately in the **Active Tasks** table. It will **not** be added to Google Calendar.

> Tasks reset every night at midnight. Recurring tasks (repeat every day) are the only ones that survive the reset.

---

### Adding an Event

Events are for things happening on **a specific date** (today or in the future).

1. Select **📅 Event** in the form
2. Enter the event name and an optional description
3. Pick the date
4. Toggle **Set a specific time?** if it has a set time
5. Click **Add to calendar**

The event is added to **Google Calendar** immediately. It will only appear in the Task Table **on the day of the event** — future events stay out of the table until their date arrives.

---

### Adding a Birthday

Birthdays are yearly recurring events for the people you care about.

1. Select **🎂 Birthday** in the form
2. Enter the person's name
3. Pick their birthday date
4. Set how many days before you'd like a reminder (default is 7)
5. Click **Add to calendar**

The birthday is added to Google Calendar as a **yearly recurring event** with a reminder. A confirmation notification appears in the app. Birthdays never appear in the Task Table.

---

### Completing a Task

In the **Active Tasks** table, tick the checkbox on the left of any task to mark it as done. The task moves instantly to the **Finished Tasks** table below, where its name appears in red.

Finished tasks are cleared automatically at midnight along with the rest of the daily reset.

---

### Deleting a Task or Event

Click the **✕** button on the right side of any row in the Active Tasks table to delete it. If the entry was an event or birthday that was synced to Google Calendar, it will also be removed from your calendar automatically.

---

### Opening Google Calendar

Click **📅 Open Google Calendar ↗** in the top header bar to jump directly to your Google Calendar in a new tab.

---

## Task Table behavior summary

| Entry type | Appears in task table | Added to Google Calendar |
|---|---|---|
| Task (one-time) | ✅ Today only, clears at midnight | ❌ No |
| Task (recurring) | ✅ Every day, never clears | ❌ No |
| Event (today) | ✅ Only on the event's date | ✅ Yes |
| Event (future) | ❌ Not until the day arrives | ✅ Yes |
| Birthday | ❌ Never | ✅ Yes, yearly recurring |

---

## Daily reset summary

Every night at midnight the following happens automatically:

- All **finished tasks** are deleted
- All **non-recurring active tasks** are deleted
- **Recurring tasks** remain untouched
- **Events and birthdays** are unaffected (they live in Google Calendar)

The app refreshes automatically at midnight so you don't need to reload the page.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Authentication | Google OAuth 2.0 via Passport.js |
| Calendar integration | Google Calendar API |
| Scheduling | node-cron |
| Frontend hosting | Vercel |
| Backend + DB hosting | Railway |

---

## Running locally

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A Google Cloud project with Calendar API enabled and OAuth credentials created

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tasksync"
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
SESSION_SECRET=any_long_random_string
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=4000
```

Run database migrations and start the server:

```bash
npx prisma migrate dev --name init
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment

The app is deployed with:
- **Frontend** → [Vercel](https://vercel.com)
- **Backend + Database** → [Railway](https://railway.app)

See the deployment guide for full step-by-step instructions including setting up environment variables, updating Google OAuth redirect URIs, and publishing the OAuth consent screen so all users can sign in.

---

## Google Calendar permissions

When you sign in, the app requests access to your Google Calendar. This is used exclusively to:

- Create events and birthdays on your behalf
- Update events if you edit them
- Delete events if you remove them from the app

No calendar data is read or stored beyond the Google Event ID needed to update or delete entries.

---

## Privacy

- Each user's tasks are private and only accessible when signed in to their own Google account
- Google OAuth tokens are stored securely in the database and used only to interact with that user's own calendar
- No data is shared between users