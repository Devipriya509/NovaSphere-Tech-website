# NovaSphere Technologies - Full-Stack Corporate Web Suite

> "Building the Future with Technology"

NovaSphere Technologies is a premium, enterprise-level corporate website and analytical dashboard built using a modern **React (Vite) frontend** and a **Node.js (Express) backend**. It is suitable for college presentations, illustrating complete credentials authentication, interactive tools, database orchestration, and role-based access.

---

## Technical Highlights & Features

1. **Dual-Mode Database (MongoDB / Local JSON Fallback)**:
   - Out of the box, the server operates in a zero-dependency **JSON file database** mode. 
   - Connecting to a live MongoDB instance is as simple as inserting your `MONGO_URI` connection string in the `.env` file. The adapter handles transitions transparently.
2. **Comprehensive Admin Dashboard**:
   - Analytical counters for users, schedules, messages, and job listings.
   - SVG charts showing booking trends.
   - Full CRUD tables to Add, Edit, and Delete Services, Projects, Blogs, and Careers live.
   - Live confirmation actions for booking schedules and toggle reading tags for contact messages.
3. **Interactive User Hub**:
   - Personalized profiles, saving portfolio items, and marking notification feeds as read.
   - Booking wizard for scheduling consultations.
4. **Interactive Cost Calculator**:
   - Instantly estimates budgets and timelines based on scales, timelines, and feature checklist items. Saves results directly to scheduling wizards.
5. **AI Chat Assistant**:
   - Conversational bot that answers service inquiries, details company hours, and explains how to calculate costs.
6. **Careers Board & Resume Uploads**:
   - Dynamic job listing board. Candidate resume uploads are converted to Base64 strings, ensuring cross-platform database compatibility.
7. **Security Layers**:
   - Password hashing via `bcryptjs`, JWT state checks, CORS safeguards, Helmet HTTP headers, and route protections.

---

## Folder Structure

```
website/
├── client/                      # React (Vite) Client
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable widgets (AIChat, CostCalculator, BookingWizard)
│   │   ├── context/             # Theme, Auth, Toast contexts
│   │   ├── layouts/             # MainLayout, DashboardLayout, AdminLayout
│   │   ├── pages/               # Public pages (Home, Blog, Careers) & Dashboards
│   │   ├── services/            # API connection wrappers (Fetch API)
│   │   ├── App.jsx              # Routing configurations
│   │   ├── index.css            # Custom CSS Variables & Glassmorphism system
│   │   └── main.jsx
│   └── package.json
└── server/                      # Node/Express Backend
    ├── config/                  # DB, localDb configs and seeding scripts
    ├── controllers/             # CRUD controllers
    ├── data/                    # JSON database fallback files
    ├── middleware/              # JWT verification and error handlers
    ├── models/                  # Schemas (User, Service, Blog, etc.)
    ├── routes/                  # API endpoints
    ├── package.json
    └── server.js                # Backend entry point
```

---

## Installation & Launch Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Step 1: Clone & Install Dependencies

Open your terminal in the project root:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
JWT_SECRET=novasphere_secret_key_123_456
MONGO_URI=
```
*Note: Leave `MONGO_URI` empty to run using the offline JSON database automatically.*

### Step 3: Run the Application

You can start both layers in separate terminal windows:

**Start Server Backend**:
```bash
cd server
npm start
```
*Note: The server auto-seeds itself on the first boot if no user accounts exist.*

**Start React Client**:
```bash
cd client
npm run dev
```

Open your browser at: `http://localhost:5173`

---

## Presentation Credentials

To test both role dashboards, log in using the pre-seeded credentials:

*   **Administrator Account**:
    *   **Email**: `admin@novasphere.com`
    *   **Password**: `admin123`
*   **Standard Customer Account**:
    *   **Email**: `user@novasphere.com`
    *   **Password**: `user123`
