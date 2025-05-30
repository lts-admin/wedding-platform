# 💒 wedding-app-builder

The frontend of the **Wedding Platform**, built with **Next.js** and **Tailwind CSS**, allows couples to design their own personalized mobile wedding apps. Customize screens like RSVP, itinerary, family info, and more — all within a beautiful and intuitive web UI.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Authentication & Data**: Firebase Auth, Firestore, and Storage

---

## 📁 Directory Structure

```

wedding-app-builder/
├── public/             # Static assets
├── src/                # All app code lives here
│   ├── app/            # Next.js app directory (routing, layout)
│   ├── components/     # Reusable components
│   ├── context/        # Global context providers
│   ├── lib/            # Firebase setup and helpers
│   └── types/          # TypeScript types and interfaces
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wedding-platform.git
cd wedding-platform/wedding-app-builder
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Dev Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

---

## 🔐 Firebase Setup

1. Create a Firebase project
2. Enable:

   * Firebase Auth (Email/Password)
   * Firestore Database
   * Firebase Storage
3. Replace the config in `src/lib/firebaseConfig.ts` with your Firebase credentials

---

## ✨ Features

* Drag-and-drop wedding app builder
* Toggle screens like RSVP, Gallery, Story, Itinerary, etc.
* Autosave progress to Firestore
* Admin and app password support
* Fully responsive and mobile-friendly
* Generates ZIP of Flutter app via connected backend

---

## 🧪 Development Scripts

* `npm run dev` – Start development server
* `npm run build` – Production build
* `npm run lint` – Run ESLint

---

## 🌐 Deployment

You can deploy this app easily on **Vercel**:

1. Push the repo to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Set Firebase env variables in the Vercel dashboard


## 🧰 Backend: `app-generator/`

This Node.js backend is responsible for generating customized Flutter apps based on user form input. It processes templates, injects data, and outputs a downloadable ZIP.

### 📁 Directory Structure

```
app-generator/
├── app.js                    # Main server entry point
├── routes/
│   └── generateApp.js        # API route to handle generation requests
├── utils/
│   └── flutterGenerator.js   # Logic to replace placeholders in the Flutter template
├── templates/                # Flutter app base template
├── generated_apps/           # Output folder for ZIPs
├── package.json              # Dependencies and scripts
```

### ⚙️ Usage

```bash
cd app-generator
npm install
node app.js
```

This starts a server (typically on port `5000`) that listens for POST requests to `/generate`.

### 📦 Endpoint Example

```http
POST /generate
Content-Type: application/json

{
  "coupleName": "Jinal & Neeraj",
  "weddingDate": "2026-02-20",
  "weddingLocation": "Longwood Gardens, PA",
  "appPassword": "jinalneeraj2026",
  ...
}
```

Returns a `.zip` file of the customized Flutter project.

### 🔌 Integration

The frontend (`wedding-app-builder`) calls this backend when the user clicks **"Generate App"**, triggering the creation of the mobile app using their personalized data.

---

## 📄 License

MIT License

---

## 👰 Built by Lambda Technology Services

Empowering couples to bring their dream wedding apps to life.

---

```