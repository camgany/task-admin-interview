# Task Admin

A lightweight operations dashboard to track tasks by status, priority, owner, and due date.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Flowbite React**.

## Features

- Dashboard KPIs: open tasks, to do, in progress, done, high priority
- Progress charts for status mix, owner workload, and priority distribution
- Create tasks with owner, priority, and due date
- Filter views: Dashboard / To do / In progress / Done
- Update status from Flowbite dropdowns
- Responsive layout with sidebar navigation

## Tech stack

| Tool | Role |
|------|------|
| React + TypeScript | UI |
| Vite | Build tooling |
| Tailwind CSS | Styling |
| Flowbite React | Dashboard components |

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

```bash
npm run dev      # start development server
npm run build    # type-check and production build
npm run preview  # preview production build
```

## Project structure

```
src/
  App.tsx       # dashboard, forms, and task table
  main.tsx      # app entry + Flowbite theme init
  index.css     # Tailwind base styles
```

## License

Private interview / demo project.
