# Remindo AI 🧠

**Your Second Brain for Learning, Memory, and AI-Powered Productivity**

Remindo AI helps users capture knowledge, organize memories, review information using spaced repetition, and interact with their personal knowledge base through AI.

Instead of losing valuable notes, screenshots, ideas, and insights across multiple apps, Remindo AI transforms them into a searchable, reviewable, and AI-assisted memory system.

---
## 📺 See Remindo in Action
![Free Universe Stars Video Gif Animated Zoom Virtual Background](https://github.com/user-attachments/assets/7e818a8e-0423-4566-9150-4661fba44710)

## ✨ Features

### 📝 Smart Memory Capture

* Save notes, ideas, insights, and learning resources
* Organize information into a centralized knowledge base
* Tag and categorize memories
* Full CRUD support (Create, Read, Update, Delete)

### 🎯 Mission-Based Learning

* Create long-term learning missions
* Set deadlines and milestones
* Link memories to specific goals
* Track progress toward outcomes

### 🔄 Spaced Repetition System (SRS)

* Automatically schedule reviews
* Reinforce learning at optimal intervals
* Reduce forgetting
* Build long-term retention

### 🤖 AI Assistant

* Chat with your knowledge base
* Summarize memories
* Generate explanations
* Ask questions about saved information
* Personalized AI-powered learning assistance

### 💬 AI Chat History

* Save conversations
* Continue previous discussions
* Build contextual learning sessions

### ⚙️ User-Controlled AI Settings

* Choose AI provider
* Configure preferred model
* Store personal API keys
* Future support for multiple LLM providers

### 🔐 Authentication

* Secure user authentication with Clerk
* User-specific memories and missions
* Protected API routes

---

## 🏗️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Clerk Authentication

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* Google Gemini API
* Multi-provider architecture (planned)

### Authentication

* Clerk

### Documentation

* Swagger UI

---

## 📂 Project Structure

```text
backend/
│
├── server.js
│
├── src/
│
├── config/
│   ├── db.js
│   └── swagger.js
│
├── controllers/
│   ├── memory.controller.js
│   ├── mission.controller.js
│   ├── review.controller.js
│   ├── ai.controller.js
│   ├── chat.controller.js
│   └── settings.controller.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── Memory.js
│   ├── Mission.js
│   ├── Review.js
│   ├── Chat.js
│   └── AISettings.js
│
├── routes/
│   ├── memory.routes.js
│   ├── mission.routes.js
│   ├── review.routes.js
│   ├── ai.routes.js
│   ├── chat.routes.js
│   └── settings.routes.js
│
└── services/
    ├── ai.service.js
    ├── srs.service.js
    └── embedding.service.js
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/remindo-ai.git

cd remindo-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create:

```bash
.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret_key

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Start Server

```bash
npm run dev
```

or

```bash
node server.js
```

---

## 📖 API Documentation

Swagger UI:

```text
http://localhost:5000/api-docs
```

Available endpoints:

### Memories

```http
GET    /api/memories
POST   /api/memories
GET    /api/memories/:id
PUT    /api/memories/:id
DELETE /api/memories/:id
```

### Missions

```http
GET    /api/missions
POST   /api/missions
PUT    /api/missions/:id
DELETE /api/missions/:id
```

### Reviews

```http
GET    /api/reviews/today
POST   /api/reviews/:memoryId
```

### AI

```http
POST /api/ai/chat
POST /api/ai/summarize
```

### Settings

```http
GET /api/settings/ai
PUT /api/settings/ai
```

---

## 🌍 Vision

Most productivity tools help users store information.

Remindo AI aims to help users:

* Remember what matters
* Learn faster
* Retain knowledge longer
* Build a personal knowledge system
* Collaborate with AI as an extension of memory

The long-term goal is to create a true AI-powered second brain that continuously learns alongside the user.

---

## 🛣️ Roadmap

### Version 1

* Memory management
* Missions
* Reviews
* Gemini integration
* Authentication

### Version 2

* AI memory retrieval
* Semantic search
* Memory linking
* Knowledge graphs

### Version 3

* Voice capture
* Screenshot understanding
* Automatic memory extraction
* Agentic workflows

### Version 4

* Multi-agent learning assistant
* Personalized learning coach
* Long-term memory engine

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Ritik Sharma**

B.Tech Computer Science Engineering

Building technology that helps people learn, remember, and think better with AI.
