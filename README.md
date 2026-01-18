# 📊 SAP Stack Exploration: Social Explorer

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

A  full-stack social dashboard utilizing a **Go backend** and **React frontend**. This project demonstrates complex **GraphQL integrations**, automated code generation, and strict database type management.

**[🔴 Live Demo]()** *(Link coming soon)*

---

## 🛠️ Features

* **Multi-User Context Switching:** Persistent session management using URL parameters, allowing seamless switching between users without state loss.
* **Global Activity Feed:** Unified feed fetching data from multiple users via optimized PostgreSQL inner joins.
* **Automated Schema-First Development:** Full backend type safety generated from GraphQL schemas using **gqlgen**.
* **Strict Type-Safe DB Layer:** Explicit Go-side type conversion and SQL casting to bridge GraphQL string IDs with PostgreSQL integer columns.
* **Responsive Dashboard:** Clean, dual-column layout featuring user-specific profile management and a global feed.
* **History Synchronization:** Integrated popstate listeners to keep React state perfectly in sync with browser navigation.

---

## 🧠 Skills & Technologies Demonstrated

This project serves as a technical showcase for modern full-stack development patterns:

| Category | Technologies |
| :--- | :--- |
| **Backend Architecture** | **Go (Golang)**, **gqlgen**, **GraphQL** |
| **Database & Storage** | **PostgreSQL**, **pgx Connection Pooling**, SQL Casting |
| **Frontend UI/UX** | **React (TypeScript)**, **Apollo Client**, **Material-UI (MUI)** |
| **State Management** | URL SearchParams, React Hooks (`useEffect`, `useCallback`) |
| **Code Generation** | Automated GraphQL resolver & struct generation |

---

## 📦 Requirements

Before running the project locally, ensure you have the following installed:

* **Go** (v1.20 or higher)
* **Node.js** (v18 or higher)
* **PostgreSQL** (v14 or higher)
* **Git**

---

## 🔧 Usage (Run Locally)

Follow these steps to set up the Go server and React frontend simultaneously.

### 1. Clone the Repository
```bash
git clone https://github.com/Urmee63/sap-stack-exploration.git
cd sap-stack-exploration
```
### 2. Database Initialization

Create your PostgreSQL database and initialize the tables:

```bash
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    author_id INT REFERENCES users(id) ON DELETE CASCADE
);
```
### 3. Backend Setup


```bash
cd backend-go
go mod tidy

# Generate GraphQL code
go run github.com/99designs/gqlgen generate

# Start the Go server (set your DATABASE_URL first)
# Windows PowerShell example:
# $env:DATABASE_URL="postgres://user:pass@localhost:5432/dbname"
go run cmd/main.go

```
### 4. Frontend Setup
```bash
cd frontend-react
yarn install
yarn start
```

Open your browser to http://localhost:3000

## 5. 🎮 Interactive Exploration

The backend includes an embedded GraphQL Playground, allowing you to test queries and mutations directly in the browser without using the React frontend.

1. Start the Go server: go run cmd/main.go.

2. Navigate to http://localhost:4000/graphql in your browser.

3. Execute queries like allPosts or getUser to inspect the real-time state of your PostgreSQL data.
