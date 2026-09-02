# Cricket Pagla Club Management Platform

Welcome to the **Cricket Pagla** web application! This is a modern, responsive, and secure club management platform built with React, Vite, TypeScript, Tailwind CSS, and Firebase.

## 1. Project Structure

```
src/
├── components/
│   ├── common/        # Shared UI (ProtectedRoute, Toast)
│   ├── layout/        # PublicLayout, DashboardLayout
│   └── ...
├── config/            # Firebase initialization (firebase.ts)
├── contexts/          # AuthContext for managing user state & roles
├── pages/
│   ├── admin/         # Admin Dashboard and management tools
│   ├── auth/          # Login & Registration
│   ├── management/    # Management Dashboard
│   ├── player/        # Player Dashboard
│   └── public/        # Public facing pages (Home, Players, Matches)
├── services/          # Firebase CRUD logic for auth, firestore, storage
├── types/             # Global TypeScript interfaces for Firestore schemas
└── App.tsx            # Main application router
```

## 2. Firebase Setup Instructions

To run this project, you need a Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Firestore Database** (start in production mode).
4. Enable **Firebase Storage** (start in production mode).
5. Go to Project Settings -> General -> Your apps -> Add Web App to get your config keys.

## 3. Environment Variable Instructions

Copy the `.env.example` file to `.env` in the root directory and populate it with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 4. Admin Creation Instructions

By default, any user who registers via the `/login` page is assigned the `PLAYER` role.
To create your first `ADMIN`:
1. Register an account normally through the UI.
2. Go to the Firebase Console -> Firestore Database.
3. Open the `users` collection.
4. Find the document with your `uid` (matching your Authentication UID).
5. Change the `role` field from `"PLAYER"` to `"ADMIN"`.
6. Refresh the app. You will now have access to the `/admin/dashboard`.

## 5. Firestore Rules Explanation

The `firestore.rules` file enforces strict role-based access:
- **Public**: Can read published content (matches, notices, players) but cannot write anything.
- **Player**: Can read their own private profile and edit specific fields (handled via frontend UI/backend validation).
- **Management**: Can create and edit matches, notices, and gallery images, but cannot manage users or settings.
- **Admin**: Has full read/write access to all collections and documents.

## 6. Storage Rules Explanation

The `storage.rules` file ensures:
- Anyone can read images (Gallery, Profile photos).
- **Players** can only upload to their specific `/users/{uid}/` folder (for profile pictures).
- **Management/Admin** can upload to any path (e.g., Gallery, Tournaments).

## 7. Local Development Commands

To run the project locally:
```bash
npm install
npm run dev
```

## 8. Production Build Command

To verify TypeScript and build the production bundle:
```bash
npm run build
```

## 9. Deployment Instructions

This project is optimized for Firebase Hosting or GitHub Pages/Vercel.

**For Firebase Hosting:**
1. Run `npm install -g firebase-tools`
2. Run `firebase login`
3. Run `firebase init hosting` (Select your project, set `dist` as public directory, configure as single-page app).
4. Run `npm run build`
5. Run `firebase deploy`

**For GitHub:**
- Ensure you don't commit your `.env` file.
- Push to your repository.

## 10. Remaining Limitations

- **Aggregated Stats**: The dashboard currently shows static placeholder stats. In a real-world scenario with thousands of matches, you should use Firebase Cloud Functions or a dedicated stats document to track counts (e.g., total matches, total runs) to avoid expensive querying.
- **Advanced Permissions**: The "Management" role is currently global. If you want granular permissions (e.g., `canEditMatch` but not `canEditGallery`), you will need to expand the `User` interface to include a `permissions` array and update the Firestore rules accordingly.
- **Full Form Implementations**: The UI is fully scaffolded, but you will need to connect the individual forms (e.g., "Add Match", "Upload Photo") to the `firebase/firestore` service functions depending on your specific data entry needs.
