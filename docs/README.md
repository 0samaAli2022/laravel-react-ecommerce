# Laravel React E-commerce Platform

## Overview

This is a modern e-commerce platform built with Laravel 12 as the backend API and React 18 with TypeScript as the frontend. The application features a multi-vendor marketplace with role-based access control, product management with variations, and a comprehensive admin panel powered by Filament.

## Table of Contents

-   [Architecture Overview](./ARCHITECTURE.md)
-   [Database Structure](./DATABASE.md)
-   [API Documentation](./API.md)
-   [Frontend Documentation](./FRONTEND.md)
-   [Admin Panel](./ADMIN.md)
-   [Installation Guide](./INSTALLATION.md)
-   [Development Guide](./DEVELOPMENT.md)
-   [Improvement Suggestions](./IMPROVEMENTS.md)

## Key Features

### 🛍️ E-commerce Core

-   **Product Management**: Full CRUD operations with variations, pricing, and inventory
-   **Category System**: Hierarchical categories with department organization
-   **Media Management**: Image uploads with automatic conversions (thumb, small, large)
-   **Product Variations**: Support for size, color, and custom variation types

### 👥 User Management

-   **Role-Based Access Control**: Admin, Vendor, and User roles
-   **Multi-vendor Support**: Vendors can manage their own products
-   **Authentication**: Laravel Breeze with Inertia.js integration

### 🎛️ Admin Panel

-   **Filament Admin**: Modern admin interface for content management
-   **Resource Management**: Departments, Categories, Products, and Users
-   **Media Library**: Integrated file management with Spatie Media Library

### 🎨 Frontend

-   **React 18**: Modern React with TypeScript
-   **Inertia.js**: SPA-like experience without API complexity
-   **Tailwind CSS + DaisyUI**: Utility-first styling with component library
-   **Responsive Design**: Mobile-first approach

### 🔧 Technical Stack

-   **Backend**: Laravel 12, PHP 8.2+
-   **Frontend**: React 18, TypeScript, Inertia.js
-   **Database**: MySQL/PostgreSQL with Eloquent ORM
-   **Styling**: Tailwind CSS, DaisyUI
-   **Build Tools**: Vite, Laravel Mix
-   **Testing**: Pest PHP

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd laravel-react-ecommerce

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Start development servers
composer run dev
```

## Project Structure

```
laravel-react-ecommerce/
├── app/
│   ├── Enums/              # Application enums
│   ├── Filament/           # Admin panel resources
│   ├── Http/               # Controllers, middleware, requests
│   ├── Models/             # Eloquent models
│   └── Services/           # Business logic services
├── database/
│   ├── migrations/         # Database migrations
│   └── seeders/           # Database seeders
├── resources/
│   ├── js/                # React frontend
│   │   ├── Components/    # Reusable components
│   │   ├── Layouts/       # Page layouts
│   │   ├── Pages/         # Page components
│   │   └── types/         # TypeScript definitions
│   └── views/             # Blade templates
├── routes/                # Route definitions
└── docs/                  # Documentation
```

## Contributing

Please read our [Development Guide](./DEVELOPMENT.md) for information on how to contribute to this project.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
