# VideoConnect

VideoConnect is a full-stack web application designed for real-time communication. It includes features like user registration, user login, chat room creation, real-time chatting, and group video calls using Zego Cloud WebRTC. The frontend is built with React (using Vite), and the backend is powered by Django.

Repository: [VideoConnect GitHub Repo](https://github.com/bithulmb/Video-Chat-App.git)

---

## Features

- User Registration and Login (Authentication)
- Real-Time Chatting using WebSockets (Django Channels)
- Chat Room Creation and Management
- Group Video Calls using Zego Cloud WebRTC
- Responsive and Modern UI
- Secure Authentication with JWT

---

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS / CSS Modules
- **Backend**: Django, Django REST Framework, Django Channels
- **WebRTC**: Zego Cloud API
- **Authentication**: JWT (JSON Web Tokens)
- **WebSockets**: Django Channels for real-time communication
- **Database**: PostgreSQL / SQLite (development)

---

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.x
- PostgreSQL (optional for production)
- Git
- Zego Cloud account

### Backend Setup (Django)

1. Clone the repository:
   ```bash
   git clone https://github.com/bithulmb/Video-Chat-App.git
   cd Video-Chat-App/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables (`.env` file):
   ```env
   SECRET_KEY=
   DEBUG=
   ALLOWED_HOSTS=
   DATABASE_NAME=
   DATABASE_USER=
   DATABASE_PASSWORD=
   DATABASE_HOST=
   DATABASE_PORT=
   CORS_ALLOWED_ORIGINS=
   CORS_ALLOW_CREDENTIALS=
   ZEGO_APP_ID=
   ZEGO_SERVER_SECRET=
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React with Vite)

1. Navigate to frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (`.env` file):
   ```env
   VITE_BASE_URL=
   VITE_WEB_SOCKET_URL=
   VITE_ZEGO_APP_ID=
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (default Vite port).

---

## Project Structure

```
Video-Chat-App/
├── backend/
│   ├── manage.py
│   ├── core/
│   ├── chat/
│   ├── authentication/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── public/
├── README.md
└── ...
```

---
