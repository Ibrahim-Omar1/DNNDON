# Next.js Admin Dashboard

A modern admin dashboard built with Next.js 14, TypeScript, and Shadcn UI.

## Features

- 🚀 Next.js 14 App Router
- 💻 TypeScript
- 🎨 Tailwind CSS
- 📱 Responsive Design
- 🔒 Authentication Ready
- 📊 Server-Side Pagination
- 🌐 URL-Based State Management
- 🎯 Accessible Components
- 🔄 Real-time Data Updates
- 📝 Form Validation
- 🎭 Dark Mode Support

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **State Management:** TanStack Query
- **Forms:** React Hook Form
- **Validation:** Zod
- **Icons:** Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file:
```env
# Your environment variables
```

4. Start the development server:
```bash
pnpm dev
```

## Project Structure

```
src/
├── app/                # App Router pages
├── components/         # React components
│   ├── ui/            # Shadcn UI components
│   └── notifications/ # Feature components
├── hooks/             # Custom hooks
├── lib/              # Utilities
├── services/         # API services
├── styles/           # Global styles
└── types/            # TypeScript types
```

## Key Components

### Data Table

A flexible data table component with:
- Server-side pagination
- URL state management
- Fixed height states
- Accessible controls
- Loading states
- Row number calculations

```tsx
<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  pagination={{
    page: currentPage,
    pageSize: pageSize,
    total: totalItems,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  }}
/>
```

### Notification System

- Real-time notifications
- CRUD operations
- Status management
- Filtering capabilities
- Sort functionality

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write JSDoc comments
- Follow component naming conventions

### Component Structure

```tsx
// Component template
export interface ComponentProps {
  // Props interface
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX
  )
}
```

### State Management

- Use React Query for server state
- URL state for pagination/filters
- Local state for UI elements
- Context for theme/auth

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
