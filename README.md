# DNNDON - Next.js Dashboard Application

A modern dashboard application built with Next.js 14, TypeScript, and Shadcn UI.

## Features

- 🚀 Next.js 14 App Router
- 💎 TypeScript
- 🎨 Tailwind CSS
- 📊 TanStack Table v8
- 🔍 Advanced Search & Filtering
- 🎯 Shadcn UI Components
- 📱 Responsive Design
- ♿ Accessibility Focus

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DNNDON.git
cd DNNDON
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Components

### Data Table
A powerful and reusable data table component with:
- Global search
- Column filtering
- Sorting
- Pagination
- Column visibility
- Responsive design

[View Data Table Documentation](./docs/data-table.md)

## Project Structure
```
src/
├── app/          # Next.js pages
├── components/   # React components
│   ├── ui/      # Shadcn UI components
│   └── ...      # Custom components
├── lib/         # Utilities
├── styles/      # Global styles
└── types/       # TypeScript types
```

## Technologies

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Table](https://tanstack.com/table/v8)
- [Lucide Icons](https://lucide.dev/)

## Development

### Prerequisites
- Node.js 18+
- npm or yarn or pnpm

### Commands
```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
