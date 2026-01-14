# Tree Graph Comparison Assignment

This repository contains a full-stack solution for visualizing hierarchical graph data.

## Structure
-   `frontend/`: Vue 3 + TypeScript + D3.js application.
-   `backend/`: Node.js + Express + TypeScript API.

## Prerequisites
-   Node.js (v20 recommended, check `.nvmrc`)

## Getting Started

### 1. Start the Backend
The backend serves the graph data at `http://localhost:3001/api/graph-data`.

```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
The frontend runs at `http://localhost:5173` (by default) and consumes the backend API.

```bash
cd frontend
npm install
npm run dev
```

## Features
-   **Hierarchical Visualization**: Renders a tree graph using D3.js.
-   **Backend Transformation**: The backend converts flat "database-style" data (Parent-Child) into a nested JSON tree.
-   **Interactivity**: Click nodes to highlight them and see details in a sidebar.
