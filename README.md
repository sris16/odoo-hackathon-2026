# 🌍 Traveloop — Personalized Travel Planning Made Easy

> Odoo Hackathon 2026 Project Submission

Traveloop is a full-stack intelligent travel planning platform designed to simplify multi-city trip organization through dynamic itinerary generation, destination discovery, budget analytics, and collaborative travel planning.

Built with a scalable relational database architecture and a modern interactive frontend, Traveloop transforms travel planning into a smooth, engaging, and data-driven experience.

---

# ✨ Key Highlights

* 🧠 Smart itinerary generation engine
* 🌆 Dynamic global destination discovery
* 💰 Advanced budget analytics & visualizations
* 🗓️ Multi-city itinerary builder
* 🔐 Secure JWT-based authentication
* ⚡ Fast and responsive UI
* 🗄️ Fully normalized relational database architecture
* 📊 Interactive budget charts
* 🎯 Modular REST API architecture
* 📱 Responsive modern design

---

# 🚀 Tech Stack

| Layer           | Technology                 |
| --------------- | -------------------------- |
| Frontend        | React.js (Vite)            |
| Styling         | Tailwind CSS               |
| Icons           | Lucide React               |
| Charts          | Chart.js / React-ChartJS-2 |
| Backend         | Node.js + Express.js       |
| Database        | MySQL                      |
| ORM             | Prisma ORM                 |
| Authentication  | JWT (JSON Web Tokens)      |
| Version Control | Git + GitHub               |

---

# 🏗️ System Architecture

## Frontend

The frontend is designed using a component-based architecture with React and Tailwind CSS to ensure:

* Reusable UI components
* Dynamic rendering
* Fast state-driven updates
* Responsive layouts
* Smooth user flow

### Frontend Structure

```bash
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── layouts/
│   └── utils/
```

---

## Backend

The backend follows a modular Express architecture with scalable route separation.

### Backend Structure

```bash
backend/
│
├── controllers/
├── middleware/
├── prisma/
├── routes/
├── utils/
├── server.js
└── prismaClient.js
```

---

# 🗄️ Database Design

Traveloop uses a fully relational database architecture designed for scalability and normalized data management.

## Core Tables

### Users

Stores user authentication and profile details.

### Trips

Stores personalized trip information.

### Cities

Stores destination metadata such as:

* country
* popularity score
* cost index
* image references

### Activities

Stores destination-specific activities.

### Trip Stops

Represents the itinerary structure and city sequencing.

### Trip Activities

Associates activities with specific itinerary stops.

### Packing Checklist

Stores user packing items.

### Trip Notes

Stores travel journals and reminders.

---

# 🔥 Major Features

## 1️⃣ Authentication System

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Validation & Error Handling

---

## 2️⃣ Destination Discovery Engine

Users can:

* Explore global destinations
* View trending cities
* Browse budget-friendly destinations
* Search cities dynamically
* View city details through interactive modals

### Dynamic City Modal Includes

* Cost index
* Popularity score
* Top activities
* Destination imagery
* Quick trip creation

---

## 3️⃣ Smart Itinerary Generator

Traveloop features a custom heuristic-based itinerary generation engine.

### Engine Capabilities

* Automatically schedules activities
* Smart daily pacing
* Diverse activity rotation
* Time-based planning
* Handles long-duration trips intelligently

### Daily Scheduling Logic

Activities are intelligently distributed across:

* Morning
* Afternoon
* Evening

---

## 4️⃣ Interactive Itinerary Builder

Users can:

* Add city stops
* Define travel dates
* Attach activities
* Reorder itinerary flow
* Visualize trip timeline

---

## 5️⃣ Advanced Budget Analytics

Traveloop dynamically calculates:

* Accommodation expenses
* Activity costs
* Transport estimates
* Total trip spending

### Visualizations

#### Pie Chart

Displays category-wise spending.

#### Bar Chart

Displays city-wise budget distribution.

---

## 6️⃣ Packing Checklist

Users can:

* Add items
* Mark items as packed
* Organize packing tasks
* Track travel essentials

---

## 7️⃣ Notes & Journal System

Users can:

* Save trip notes
* Add reminders
* Store important travel information

---

# 📡 REST API Architecture

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Trips

```http
GET /api/trips
POST /api/trips
GET /api/trips/:id
PUT /api/trips/:id
DELETE /api/trips/:id
```

---

## Itinerary Builder

```http
POST /api/trips/:id/stops
POST /api/stops/:stop_id/activities
DELETE /api/stops/:stop_id
```

---

## Discovery APIs

```http
GET /api/cities/trending
GET /api/cities/popular
GET /api/cities/budget
GET /api/cities/:id/activities
```

---

## Budget APIs

```http
GET /api/trips/:id/budget
```

---

# 🎨 UI/UX Design Philosophy

Traveloop follows a clean modern design language focused on:

* usability
* spacing consistency
* visual clarity
* responsive layouts
* smooth interaction flow

### Design Elements

* Glassmorphism-inspired cards
* Rounded corners
* Soft shadows
* Hover interactions
* Interactive dashboards

---

# 🧪 Validation & Error Handling

The application includes robust validation mechanisms.

### Examples

* Invalid email detection
* Empty field validation
* Duplicate account prevention
* Date consistency checks
* Budget validation

---

# 📊 Scalability Considerations

Traveloop was architected with scalability in mind.

### Architectural Advantages

* Modular route structure
* Relational database normalization
* Reusable frontend components
* Separated business logic
* Dynamic API-driven rendering

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sris16/odoo-hackathon-2026.git
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 3️⃣ Backend Setup

```bash
cd backend
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file inside backend.

```env
DATABASE_URL="mysql://root:password@localhost:3306/traveloop"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

## 5️⃣ Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 6️⃣ Run Backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🧠 Intelligent Engineering Decisions

This project intentionally avoids overdependence on third-party APIs and instead focuses on:

* custom backend logic
* scalable relational database modeling
* heuristic itinerary generation
* modular software architecture

This aligns strongly with the engineering and problem-solving expectations of the Odoo Hackathon.

---

# 🏆 Hackathon Evaluation Alignment

Traveloop was designed specifically to demonstrate:

✅ Relational Database Design

✅ Thoughtful System Architecture

✅ Scalable Backend Logic

✅ Dynamic Frontend Experience

✅ Modularity & Maintainability

✅ User-Centric Workflow Design

✅ Clean UI/UX Principles

✅ Full-Stack Engineering Skills

---

# 👥 Team

## Team Name

Traveloop

## Developers

* Sri Sakthi R
* Jaisurya S

---

# 🔮 Future Enhancements

Potential production-scale improvements:

* Real-time flight APIs
* Hotel booking integration
* Google Maps integration
* AI recommendation engine
* Group trip collaboration
* Real-time chat system
* Offline itinerary access
* Mobile application version

---

# 📌 Conclusion

Traveloop is more than a travel planner — it is an intelligent itinerary orchestration platform built with scalable engineering principles, dynamic user interaction, and thoughtful database architecture.

The project demonstrates the team's capability in:

* Full-stack development
* Relational database modeling
* Modular architecture
* Product-oriented thinking
* Collaborative software engineering

---

# ⭐ Thank You

Built with passion for the Odoo Hackathon 2026 🚀
