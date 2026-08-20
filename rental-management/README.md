# 🏠 RentPro - Rental Management System

A full-stack rental property management system built with **Spring Boot**, **MySQL**, and **React**.

---

## 📋 Features

| Module | Features |
|--------|---------|
| **Authentication** | JWT login, role-based access (Admin / Manager / Tenant) |
| **Properties** | Add, edit, delete, filter by status/type |
| **Leases** | Create, manage, terminate leases, auto-update property status |
| **Payments** | Record payments, track overdue, filter by status |
| **Maintenance** | Submit requests, assign staff, track resolution |
| **Tenants** | Manage tenant profiles, view history |
| **Dashboard** | KPI stats, recent activity, revenue summary |

---

## 🛠 Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.0
- Lombok
- Maven

**Frontend:**
- React 18
- React Router v6
- Axios
- Recharts
- Lucide React
- React Toastify

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Requires Docker & Docker Compose
docker-compose up --build
```

Then open http://localhost:3000

### Option 2: Manual Setup (Linux/Mac)

**Prerequisites:**
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8.0

**Steps:**

1. **Set up MySQL:**
```bash
mysql -u root -p < database/init.sql
```

2. **Configure database** (if needed):
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rental_db?...
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

3. **Start everything:**
```bash
chmod +x start.sh
./start.sh
```

### Option 3: Manual Setup (Windows)

```batch
start.bat
```

### Option 4: Run Individually

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🔑 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| manager | admin123 | Manager |
| tenant1 | admin123 | Tenant |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/properties` | List/Create properties |
| PUT/DELETE | `/api/properties/{id}` | Update/Delete property |
| GET/POST | `/api/leases` | List/Create leases |
| PATCH | `/api/leases/{id}/terminate` | Terminate lease |
| GET/POST | `/api/payments` | List/Create payments |
| GET | `/api/payments/overdue` | Overdue payments |
| GET/POST | `/api/maintenance` | List/Create requests |
| GET/POST | `/api/users` | List/Create users |
| GET | `/api/users/tenants` | List tenants only |

All endpoints (except `/api/auth/**`) require Bearer token in `Authorization` header.

---

## 📁 Project Structure

```
rental-management/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/rental/
│   │   ├── config/             # Security config
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Error handling
│   │   ├── repository/         # Spring Data repos
│   │   ├── security/           # JWT filter & util
│   │   └── service/            # Business logic
│   └── pom.xml
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # Layout, Sidebar
│   │   ├── context/            # Auth context
│   │   ├── pages/              # All pages
│   │   └── services/           # API calls
│   └── package.json
├── database/
│   └── init.sql                # DB seed data
├── docker-compose.yml
├── start.sh                    # Linux/Mac startup
└── start.bat                   # Windows startup
```

---

## ⚙️ Configuration

**Backend** (`application.properties`):
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/rental_db
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000   # 24 hours in ms
```

**Frontend** (`.env`):
```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 🐳 Production Deployment

```bash
# Build images and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## 📝 License

MIT License - Free to use and modify.
