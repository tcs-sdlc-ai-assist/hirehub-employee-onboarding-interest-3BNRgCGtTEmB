# HireHub Onboarding Portal

A modern employee onboarding portal built with Angular 17+ using standalone components. The application streamlines the new hire onboarding process by providing a guided, step-by-step experience for completing onboarding tasks, submitting personal information, and tracking progress.

## Features

- **Multi-Step Onboarding Wizard** — Guided onboarding flow with progress tracking
- **Personal Information Form** — Reactive forms with validation for collecting new hire details
- **Document Checklist** — Track required documents and their completion status
- **Task Management** — View and complete assigned onboarding tasks
- **Progress Dashboard** — Visual overview of onboarding completion status
- **Persistent State** — All progress is saved to localStorage so users can resume at any time
- **Responsive Design** — Fully responsive layout for desktop and mobile devices
- **Standalone Components** — Built entirely with Angular 17+ standalone components (no NgModules)

## Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 17+** | Frontend framework |
| **TypeScript** | Type-safe development |
| **Angular Router** | Client-side routing with lazy-loaded routes |
| **Angular Reactive Forms** | Form handling and validation |
| **RxJS** | Reactive data flows |
| **localStorage** | Client-side data persistence |
| **Vercel** | Deployment and hosting |

## Folder Structure

```
hirehub-onboarding-portal/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.css
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   ├── sidebar.component.html
│   │   │   │   └── sidebar.component.css
│   │   │   └── progress-bar/
│   │   │       ├── progress-bar.component.ts
│   │   │       ├── progress-bar.component.html
│   │   │       └── progress-bar.component.css
│   │   ├── pages/
│   │   │   ├── welcome/
│   │   │   │   ├── welcome.component.ts
│   │   │   │   ├── welcome.component.html
│   │   │   │   └── welcome.component.css
│   │   │   ├── personal-info/
│   │   │   │   ├── personal-info.component.ts
│   │   │   │   ├── personal-info.component.html
│   │   │   │   └── personal-info.component.css
│   │   │   ├── documents/
│   │   │   │   ├── documents.component.ts
│   │   │   │   ├── documents.component.html
│   │   │   │   └── documents.component.css
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.component.ts
│   │   │   │   ├── tasks.component.html
│   │   │   │   └── tasks.component.css
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.css
│   │   │   └── completion/
│   │   │       ├── completion.component.ts
│   │   │       ├── completion.component.html
│   │   │       └── completion.component.css
│   │   ├── services/
│   │   │   ├── onboarding.service.ts
│   │   │   └── storage.service.ts
│   │   ├── models/
│   │   │   ├── employee.model.ts
│   │   │   ├── task.model.ts
│   │   │   └── document.model.ts
│   │   ├── guards/
│   │   │   └── onboarding.guard.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── public/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vercel.json
└── README.md
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hirehub-onboarding-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
ng serve
```

The application will be available at **http://localhost:4200**.

### 4. Build for Production

```bash
ng build
```

The production build output will be generated in the `dist/hirehub-onboarding-portal/` directory.

### 5. Run Tests

```bash
ng test
```

## Deployment to Vercel

### Automatic Deployment

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel will auto-detect the Angular framework. Confirm the following settings:
   - **Build Command:** `ng build`
   - **Output Directory:** `dist/hirehub-onboarding-portal/browser`
   - **Install Command:** `npm install`
4. Click **Deploy**.

### Manual Deployment via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to link your project and deploy.

### Vercel Configuration

The project includes a `vercel.json` file that handles SPA routing by redirecting all requests to `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Environment Configuration

Environment-specific configuration is managed through Angular's environment files:

- **`src/environments/environment.ts`** — Development configuration
- **`src/environments/environment.prod.ts`** — Production configuration

These files contain settings such as API base URLs and feature flags. The production environment is automatically used when building with `ng build`.

## Data Persistence

This application uses **localStorage** for all data persistence. No backend server or database is required. All onboarding progress, personal information, task completion status, and document checklist state are stored locally in the browser.

> **Note:** Clearing browser data will reset all onboarding progress.

## Key Design Decisions

- **Standalone Components** — All components use `standalone: true` with no NgModules, following Angular 17+ best practices.
- **Lazy Loading** — Page components are lazy-loaded via `loadComponent` in the route configuration to minimize the initial bundle size.
- **Reactive Forms** — All forms use Angular Reactive Forms with built-in and custom validators for robust form handling.
- **localStorage** — Chosen for simplicity and zero-backend deployment; the `StorageService` abstracts all storage operations for easy future migration to an API.
- **Functional Guards** — Route guards use the modern functional guard pattern introduced in Angular 15+.

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.