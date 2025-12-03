# Grocify Frontend

## Project Overview
Grocify is a modern grocery product management dashboard built with **Next.js 13 (App Router)**, **Firebase Firestore**, **Tailwind CSS**, and **ShadCN UI** components.  
This frontend allows real-time product management, including adding, editing, deleting products, uploading images, and viewing analytics charts.

## Features

### Authentication
- Login with demo credentials.
- JWT + cookies for secure login.

### Product Management
- View all products in a real-time table.
- Add new products via a modal form.
- Edit or delete existing products.
- Change product status (Active / Disabled).
- Direct image upload to Firebase Storage.
- Form validation with React Hook Form.

### Analytics
- View total products.
- Active vs Inactive products chart.
- Products by category chart.
- Fully responsive charts using ShadCN Charts.

### UI Components
- Sidebar with navigation.
- Reusable Product Table and Product Modal.
- Dark/light theme support with Tailwind gradient backgrounds.

## Demo Credentials
Email: admin@demo.com
Password: 123456

shell
Copy code

## Project Structure
frontend/
├─ src/
│ ├─ app/
│ │ ├─ dashboard/
│ │ │ ├─ layout.tsx # Sidebar + Header layout
│ │ │ ├─ products/ # Product management page
│ │ │ └─ analytics/ # Analytics charts page
│ │ └─ login/ # Login page
│ ├─ components/ # Reusable UI components
│ │ ├─ Sidebar.tsx
│ │ ├─ ProductTable.tsx
│ │ ├─ ProductModal.tsx
│ │ └─ ChartCard.tsx
│ ├─ lib/
│ │ └─ firebase.ts # Firebase config & initialization
│ ├─ redux/ # Redux slices
│ └─ types/
│ └─ index.d.ts # TypeScript interfaces
├─ public/ # Static assets
├─ next.config.js # Next.js config
├─ tailwind.config.js # Tailwind config
└─ package.json

bash
Copy code

## Installation

Clone the repo:
```bash
git clone https://github.com/souravMitra02/grocify-client
cd frontend
Install dependencies:

bash
Copy code
npm install
# or
yarn
Add Firebase environment variables in .env.local:

env
Copy code
NEXT_PUBLIC_FIREBASE_API_KEY=yourKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourProjectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourStorageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_ID=yourSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=yourAppId
Running the Project
bash
Copy code
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser.

How to Add a Product
Login using demo credentials.

Go to Products page via sidebar.

Click Add Product button.

Fill the form:

Name (required)

Price (required)

Category (required)

Image (direct upload)

Status (Active / Disabled)

Click Add → product appears instantly in the table.

How to Edit/Delete/Change Status
Edit: Click the pencil icon → update form → click Update.

Delete: Click trash icon → confirm → removes from Firestore.

Change Status: Click toggle → Active ↔ Inactive.

Image Upload Notes
All images are uploaded directly to Firebase Storage.
Only image files supported (jpg, png).
Maximum recommended size: 2–3MB.

Analytics Page
Displays total products.

Active vs Inactive Products (Pie Chart)

Products by Category (Bar Chart)

Real-time updates from Firestore.

Responsive and dark mode friendly.

Styling
Tailwind CSS with dark/light gradient backgrounds.

ShadCN UI for buttons, modals, inputs, tables.

Fully responsive across all devices.

Dependencies
next – Next.js 13

react – React 18

firebase – Firestore & Storage

@tanstack/react-table – Product table

framer-motion – Animations

react-hook-form – Form validation

lucide-react – Icons

tailwindcss – Styling

shadcn/ui – UI components