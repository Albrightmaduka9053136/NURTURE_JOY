# 🌸 NurtureJoy

NurtureJoy is a full-stack web application designed to support pregnant mothers through emotional well-being tracking, chatbot interaction, and personalized user dashboards.

The project consists of:

* 🔹 **Flask Backend API**
* 🔹 **React Frontend**
* 🔹 **Token-Based Authentication**
* 🔹 **User Management System**

---

# 📁 Project Structure

```
NutureJoy/
│
├── nuture_joy_backend/   # Flask backend
│   ├── routes/
│   ├── models/
│   ├── database/
│   ├── app.py
│   └── requirements.txt
│
├── client/               # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 🚀 How to Run the Project

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/Lesley-w19/NutureJoy.git
cd NutureJoy
```

---

# 2️⃣ Backend Setup (Flask API)

## 🔹 Step 1: Navigate to Backend Folder

```bash
cd nuture_joy_backend
```

---

## 🔹 Step 2: Create Virtual Environment

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### Mac/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 🔹 Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing:

```bash
pip install flask flask_sqlalchemy flask_cors werkzeug python-dotenv
```

---

## 🔹 Step 4: Configure Environment Variables

Create a file:

```
nuture_joy_backend/.env
```

Add:

```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=super_secret_key
DATABASE_URL=sqlite:///nuturejoy.db
```

---

## 🔹 Step 5: Create Database

Inside backend folder:

```bash
python
```

Then:

```python
from database.db import db
from models.user_model import User
db.create_all()
exit()
```

This creates the SQLite database file.

---

## 🔹 Step 6: Run Backend

```bash
flask run
```

Backend will run at:

```
http://127.0.0.1:5000
```

---

# 3️⃣ Frontend Setup (React)

Open a new terminal.

---

## 🔹 Step 1: Navigate to Client

```bash
<<<<<<< HEAD
cd client
=======
cd nuturejoy
>>>>>>> 7da256caf439d11e9c06b570f9f2ff9c57422a1a
```

---

## 🔹 Step 2: Install Dependencies

```bash
npm install
```

---

## 🔹 Step 3: Start React App

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

# 🔐 Authentication Flow

NurtureJoy uses **token-based authentication**.

After login:

* A token is generated
* Token is saved in the database
* Token must be sent in request headers:

```
Authorization: Bearer <token>
```

---

# 🧪 API Testing Guide (Postman)

---

## 🔹 Register User

**POST**

```
http://127.0.0.1:5000/api/auth/register
```

Body (JSON):

```json
{
  "username": "lesley",
  "email": "lesley@example.com",
  "password": "password123",
  "age": 24,
  "trimester": "2nd"
}
```

---

## 🔹 Login

**POST**

```
http://127.0.0.1:5000/api/auth/login
```

Response:

```json
{
  "token": "abc123xyz..."
}
```

Save the token.

---

## 🔹 Get Current User

**GET**

```
http://127.0.0.1:5000/api/auth/me
```

Header:

```
Authorization: Bearer abc123xyz...
```

---

## 🔹 Get All Users

```
GET /api/users
```

---

## 🔹 Get User by ID

```
GET /api/users/1
```

---

# 🖥 How React Calls Protected Routes

Example fetch call:

```javascript
const token = localStorage.getItem("token");

fetch("http://127.0.0.1:5000/api/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

# ⚙️ Important Configuration

## Enable CORS in Backend

In `app.py`:

```python
from flask_cors import CORS
CORS(app)
```

---

# 🛠 Common Issues & Fixes

---

### ❌ 500 Error: `api_token` not found

Make sure your `User` model includes:

```python
api_token = db.Column(db.String(128), nullable=True)
```

Then recreate or migrate your database.

---

### ❌ Unauthorized Error

Ensure:

* Token exists in localStorage
* Token is sent as:

  ```
  Authorization: Bearer <token>
  ```



---

# 🧱 Technologies Used

* Flask
* Flask-SQLAlchemy
* React
* SQLite
* Token-Based Authentication
* RESTful API

---

# 📌 Future Improvements

* Replace custom token system with JWT
* Add refresh tokens
* Add role-based authorization
* Deploy backend (Render/Heroku)
* Deploy frontend (Vercel/Netlify)
* Add chatbot ML model integration

---

# 👩🏽‍💻 Author

Lesley Wanjiku
NurtureJoy – Emotional Well-being Support Platform