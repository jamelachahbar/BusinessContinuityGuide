# Azure Business Continuity Guide - Web Application

A modern web version of the Azure Business Continuity Guide (ABCG), built with React, Vite, and FluentUI.

## Overview

This web application provides an interactive, browser-based version of the Azure Business Continuity Guide. It covers all three phases of BCDR planning:

1. **Phase 1: Prepare** - Fundamental concepts, criticality models, and planning templates
2. **Phase 2: Application Continuity** - Assessment, implementation, and testing for individual applications
3. **Phase 3: Business Continuity** - Portfolio-wide planning and ongoing management

## Features

- ✨ Modern, responsive UI built with FluentUI components
- 🎨 Clean, accessible design with Azure brand colors
- 📱 Mobile-friendly responsive layout
- ⚡ Fast performance with Vite
- 🔍 Easy navigation between phases and topics
- 📊 Interactive cards and accordions for content organization

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
cd web-app
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
web-app/
├── src/
│   ├── components/
│   │   ├── Home.tsx                          # Landing page
│   │   ├── Phase1Prepare.tsx                 # Phase 1 content
│   │   ├── Phase2ApplicationContinuity.tsx   # Phase 2 content
│   │   └── Phase3BusinessContinuity.tsx      # Phase 3 content
│   ├── App.tsx                               # Main app with navigation
│   ├── main.tsx                              # Entry point
│   └── index.css                             # Global styles
├── index.html
├── package.json
└── vite.config.ts
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **FluentUI React v9** - Microsoft's design system
- **FluentUI Icons** - Icon library

## Contributing

Contributions are welcome! Please see the main repository's [Contributing Guidelines](../CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Related Resources

- [Excel Workbook Version](https://github.com/Azure/BusinessContinuityGuide/releases)
- [Getting Started Guide](../getting-started.md)
- [Main Repository](https://github.com/Azure/BusinessContinuityGuide)
