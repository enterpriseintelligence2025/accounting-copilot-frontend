# Accounting Copilot – Frontend Documentation

## 1. Frontend Overview

The **Accounting Copilot Frontend** is a React-based Single Page Application (SPA) that provides an intuitive UI for interacting with AI-powered accounting features such as invoice generation, PO–Invoice reconciliation, and conversational assistance.

### Goals
- Provide a clean, responsive, and intuitive user experience
- Enable seamless PDF uploads and previews
- Display AI-generated outputs clearly and interactively

---

## 2. Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit, React Hooks
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF

---

## 3. Frontend Architecture

- SPA with client-side routing
- REST-based communication with backend
- Handles file uploads, streaming chat responses, and PDF rendering

---

## 4. Folder Structure

```text
Frontend/
├── .env
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    ├── globalComponents/
    ├── hooks/
    ├── pages/
    └── redux/
```

---

## 5. Core Components

- **Chat Interface**: Streaming AI chat UI
- **Invoice Generation**: PO upload and invoice PDF generation
- **Reconciliation**: PO vs Invoice comparison UI

---

## 6. Environment Variables

```env
VITE_BACKEND_BASE_URL=http://localhost:8000
```

---

## 7. Local Development

```bash
cd Frontend
npm install
npm run dev
```

---

## 8. Build & Deployment

```bash
npm run build
```

Deployable to Vercel, Azure Static Web Apps, or Nginx.
