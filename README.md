# Skibookers - AI-Powered Ski Trip Booking Platform

A modern React TypeScript application for customizing and booking ski trips with AI-powered recommendations and real-time pricing.

## 🏗️ Architecture

### Feature-Sliced Design (FSD)
The project follows Feature-Sliced Design methodology for scalable and maintainable architecture:

```
src/
├── app/           # Application layer (root configuration)
├── pages/         # Page components (route-level)
├── widgets/       # Complex UI blocks (trip-overview, price-summary)
├── features/      # Business logic features (modal system)
└── shared/        # Shared utilities, types, API, stores
```

### Core Principles
- **Layered Architecture**: Clear separation of concerns
- **Upward Dependencies**: Lower layers can't depend on higher layers
- **Component Isolation**: Each layer has specific responsibilities
- **Shared Foundation**: Common utilities accessible to all layers

## 🚀 Key Features

### Trip Customization
- **Component Selection**: Choose resort, hotel, room, ski pass, transfer, flight, insurance
- **Addon System**: Multiple addon selection with real-time pricing
- **Visual Selection**: Image-based component selection with detailed information
- **Unselect Functionality**: Users can deselect components for flexibility

### AI-Powered Recommendations
- **User Preferences**: Vibe, budget, and group preferences
- **Personalized Suggestions**: AI analyzes preferences for optimal recommendations
- **Context-aware UI**: Explanations tailored to user preferences

### Real-time Pricing
- **Dynamic Calculation**: Instant price updates on selection changes
- **Transparent Breakdown**: Detailed price breakdown by component
- **Per-person Pricing**: Clear pricing structure for group bookings

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Full type safety and developer experience
- **Material-UI (MUI)** - Component library with custom Airbnb-inspired theme
- **Vite** - Fast development and build tool
- **CSS Modules** - Scoped styling approach

### State Management
- **Nanostores** - Reactive state management with minimal boilerplate
- **@nanostores/react** - React integration for nanostores
- **Computed Values** - Efficient reactive updates

### Data & Configuration
- **YAML** - Configuration data format for trip components
- **js-yaml** - YAML parsing for configuration
- **Type-safe Data** - Comprehensive TypeScript types for all data

### Build & Deployment
- **GitHub Pages** - Automated deployment with GitHub Actions
- **gh-pages** - Deployment tooling
- **ESLint** - Modern linting configuration
- **Base Path Handling** - Production-ready asset management

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/XXXVII/skibookers.git
cd skibookers

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality

# Deployment
npm run deploy       # Build and deploy to GitHub Pages
npm run predeploy    # Pre-deployment build hook
```

## 📄 License

This project is private and proprietary.
