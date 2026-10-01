# MeetingMate

**MeetingMate** is a full-stack AI-powered meeting notes application that turns recorded meetings into transcripts, concise summaries, and actionable tasks.

Users can create meetings, upload audio recordings, automatically transcribe them using Whisper, and generate AI-powered summaries and action items using Google's Gemini API.

## Live Demo

**[MeetingMate](https://meetingmate-gn4o.onrender.com)**

> Audio transcription and AI summarisation may take some time depending on the recording length.

---

## Features

* User registration and login
* JWT authentication using secure HTTP-only cookies
* Create, view and delete meetings
* Upload meeting recordings
* Cloud-based audio storage
* Automatic speech-to-text transcription
* AI-generated meeting summaries
* Automatic action item extraction
* Persistent meeting data using PostgreSQL

---

## Tech Stack & Architecture

| Area           | Technology                     |
| -------------- | ------------------------------ |
| Frontend       | React, TypeScript, Vite        |
| Backend        | Node.js, Express, TypeScript   |
| Database       | PostgreSQL, Prisma, Neon       |
| Authentication | JWT, HTTP-only cookies, bcrypt |
| Transcription  | Python, faster-whisper, FFmpeg |
| AI             | Google Gemini API              |
| File Storage   | Cloudinary                     |
| Deployment     | Render                         |

The application is split into a React frontend and Node/Express backend, communicating through a REST API.

```text
React + Vite
     │
     │ REST API
     ▼
Node + Express
     │
     ├───────────────┐
     ▼               ▼
PostgreSQL       Cloudinary
  (Neon)          (Audio)
     │
     ▼
Gemini API
     │
     ▼
Summary + Action Items
```

### Meeting Processing

```text
Audio Upload
     │
     ▼
Cloudinary
     │
     ▼
faster-whisper
     │
     ▼
Transcript
     │
     ▼
Gemini
     │
     ├── Summary
     └── Action Items
          │
          ▼
      PostgreSQL
```

Audio is uploaded through the backend and stored in Cloudinary rather than on the server's local filesystem. When transcription is requested, the backend temporarily downloads the audio and runs `faster-whisper` through a Python process. The resulting transcript is stored in PostgreSQL.

The transcript can then be sent to Gemini to generate a structured summary and list of action items.

Example AI response:

```json
{
  "summary": "Concise meeting summary",
  "actionItems": [
    "Complete the budget review",
    "Send the updated figures"
  ]
}
```

The AI is instructed to only include action items that are mentioned or clearly implied by the transcript and not invent deadlines, names, or tasks.

---

## Database

MeetingMate uses PostgreSQL with Prisma ORM.

The core relationships are:

```text
User
 │
 └── Meetings
       │
       └── Action Items
```

Each user can have multiple meetings, while each meeting can contain multiple action items.

---

## Authentication & Security

Authentication uses JWTs stored in secure HTTP-only cookies.

Passwords are hashed using bcrypt before being stored in the database.

Meeting endpoints are protected by authentication middleware, and users can only access their own meetings.

API keys and other sensitive configuration are stored using environment variables rather than being committed to the repository.

---

## Key Technical Decisions

### Cloud Storage

Cloudinary is used for audio storage because relying on the local filesystem of a cloud server is not suitable for persistent user uploads.

### Hosted AI

During development, Ollama was initially used for local summarisation. After deployment, the Render server could not access the local Ollama instance.

The AI service was therefore moved to the Gemini API so summarisation could work in production without running a separate AI server.

### Node.js + Python

The main application backend is written in TypeScript, while speech transcription runs in Python using `faster-whisper`.

Node starts the Python process, receives the transcript, and stores the result in PostgreSQL.

---

## Local Development

### Prerequisites

* Node.js
* Python 3
* FFmpeg
* PostgreSQL/Neon database
* Cloudinary account
* Gemini API key

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Environment variables are required for the database, authentication, Cloudinary and Gemini API credentials.

---

## Deployment

MeetingMate is deployed using Render.

* **Frontend:** React/Vite on Render
* **Backend:** Node/Express on Render
* **Database:** Neon PostgreSQL
* **Audio:** Cloudinary
* **AI:** Google Gemini
* **Transcription:** faster-whisper

The production frontend is configured to support React Router routes when pages are refreshed directly.
