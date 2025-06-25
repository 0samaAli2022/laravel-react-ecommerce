# Frontend Documentation

## Overview

The frontend is built with React 18 and TypeScript, using Inertia.js for seamless integration with the Laravel backend. The application provides a modern, responsive user interface with server-side rendering capabilities.

## Technology Stack

### Core Technologies

-   **React 18**: Modern React with concurrent features
-   **TypeScript**: Type-safe JavaScript development
-   **Inertia.js**: SPA-like experience without API complexity
-   **Tailwind CSS**: Utility-first CSS framework
-   **DaisyUI**: Component library for Tailwind CSS
-   **Vite**: Fast build tool and development server

### Development Tools

-   **ESLint**: Code linting and style enforcement
-   **Prettier**: Code formatting
-   **TypeScript Compiler**: Type checking and compilation
-   **Vite HMR**: Hot module replacement for fast development

## Project Structure

```
resources/js/
├── Components/              # Reusable UI components
│   ├── Core/               # Basic UI elements
│   │   ├── Carousel.tsx    # Image carousel component
│   │   ├── Checkbox.tsx    # Form checkbox component
│   │   ├── CurrencyFormatter.tsx # Currency display utility
│   │   ├── DangerButton.tsx # Danger action button
│   │   ├── Dropdown.tsx    # Dropdown menu component
│   │   ├── InputError.tsx  # Form error display
│   │   ├── InputLabel.tsx  # Form input labels
│   │   ├── Modal.tsx       # Modal dialog component
│   │   ├── NavLink.tsx     # Navigation links
│   │   ├── PrimaryButton.tsx # Primary action button
│   │   ├── ResponsiveNavLink.tsx # Mobile navigation links
│   │   ├── SecondaryButton.tsx # Secondary action button
│   │   └── TextInput.tsx   # Text input component
│   └── App/                # Application-specific components
│       ├── ApplicationLogo.tsx # Brand logo component
│       ├── Navbar.tsx      # Main navigation bar
│       └── ProductItem.tsx # Product display card
├── Layouts/                # Page layout components
│   ├── AuthenticatedLayout.tsx # Layout for logged-in users
│   └── GuestLayout.tsx     # Layout for guest users
├── Pages/                  # Page-level components
│   ├── Auth/               # Authentication pages
│   │   ├── ConfirmPassword.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ResetPassword.tsx
│   │   └── VerifyEmail.tsx
│   ├── Product/            # Product-related pages
│   │   └── Show.tsx        # Product detail page
│   ├── Profile/            # User profile pages
│   │   ├── Edit.tsx        # Profile editing
│   │   └── Partials/       # Profile sub-components
│   ├── Dashboard.tsx       # User dashboard
│   └── Home.tsx           # Homepage/product listing
├── types/                  # TypeScript type definitions
│   ├── global.d.ts        # Global type declarations
│   ├── index.d.ts         # Main type definitions
│   └── vite-env.d.ts      # Vite environment types
├── app.tsx                # Main application entry point
├── bootstrap.ts           # Application bootstrap
├── helpers.ts             # Utility functions
└── ssr.tsx               # Server-side rendering entry
```

## Component Architecture

### Core Components

#### Form Components

```typescript
// TextInput.tsx - Reusable text input with validation
interface TextInputProps {
    id?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    name?: string;
    value?: string;
    className?: string;
    autoComplete?: string;
    required?: boolean;
    isFocused?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// InputError.tsx - Error message display
interface InputErrorProps {
    message?: string;
    className?: string;
}
```

#### Button Components

```typescript
// PrimaryButton.tsx - Main action buttons
interface PrimaryButtonProps {
    className?: string;
    disabled?: boolean;
    children: ReactNode;
    onClick?: () => void;
}

// DangerButton.tsx - Destructive action buttons
interface DangerButtonProps extends PrimaryButtonProps {
    // Inherits all PrimaryButton props
}
```

#### Navigation Components

```typescript
// NavLink.tsx - Navigation links with active state
interface NavLinkProps {
    active?: boolean;
    className?: string;
    children: ReactNode;
    href: string;
}

// Dropdown.tsx - Dropdown menu component
interface DropdownProps {
    children: ReactNode;
    trigger: ReactNode;
    align?: 'left' | 'right';
    width?: '48' | '96';
    contentClasses?: string;
}
```

### Application Components

#### Navbar Component

```typescript
// Navbar.tsx - Main navigation bar
interface NavbarProps {
    user?: User;
    canLogin?: boolean;
    canRegister?: boolean;
}

// Features:
// - Responsive design with mobile menu
// - User authentication state
// - Shopping cart integration
// - Search functionality
```

#### ProductItem Component

```typescript
// ProductItem.tsx - Product display card
interface ProductItemProps {
    product: ProductListResource;
}

// Features:
// - Product image with fallback
// - Price formatting
// - Quick view functionality
// - Add to cart button
// - Product rating display
```

### Layout Components

#### AuthenticatedLayout

```typescript
// AuthenticatedLayout.tsx - Layout for logged-in users
interface AuthenticatedLayoutProps {
    user: User;
    header?: ReactNode;
    children: ReactNode;
}

// Features:
// - User navigation menu
// - Profile dropdown
// - Notification system
// - Breadcrumb navigation
```

#### GuestLayout

```typescript
// GuestLayout.tsx - Layout for guest users
interface GuestLayoutProps {
    children: ReactNode;
}

// Features:
// - Public navigation
// - Login/register links
// - Minimal header/footer
```

## Page Components

### Home Page

```typescript
// Home.tsx - Product listing homepage
interface HomeProps {
    products: PaginatedResponse<ProductListResource>;
}

// Features:
// - Product grid display
// - Pagination
// - Category filtering
// - Search functionality
// - Featured products section
```

### Product Detail Page

```typescript
// Product/Show.tsx - Individual product page
interface ProductShowProps {
    product: ProductResource;
    variationOptions: Record<string, any>;
}

// Features:
// - Product image gallery
// - Variation selection (size, color, etc.)
// - Price calculation based on variations
// - Add to cart functionality
// - Product description and specifications
// - Related products
```

### Authentication Pages

All authentication pages follow consistent patterns:

-   Form validation with real-time feedback
-   Loading states during submission
-   Error handling and display
-   Responsive design
-   Accessibility compliance

## Type Definitions

### Core Types

```typescript
// types/index.d.ts
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles?: Role[];
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    status: ProductStatus;
    quantity?: number;
    department: Department;
    category: Category;
    variations?: ProductVariation[];
    media?: MediaFile[];
}

export interface ProductVariation {
    id: number;
    product_id: number;
    variation_type_option_ids: number[];
    quantity?: number;
    price?: number;
}

export interface Department {
    id: number;
    name: string;
    slug: string;
    active: boolean;
}

export interface Category {
    id: number;
    name: string;
    department_id: number;
    parent_id?: number;
    active: boolean;
}
```

### Inertia Types

```typescript
// Inertia.js page props
export interface PageProps {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash: {
        message?: string;
        error?: string;
    };
}

// Resource types for API responses
export interface ProductListResource {
    id: number;
    title: string;
    slug: string;
    price: number;
    image?: string;
    department: string;
    category: string;
}

export interface ProductResource extends ProductListResource {
    description: string;
    quantity?: number;
    variations: ProductVariationResource[];
    media: MediaResource[];
}
```

## State Management

### Local State with Hooks

```typescript
// useState for component-level state
const [selectedVariations, setSelectedVariations] = useState<
    Record<string, number>
>({});
const [quantity, setQuantity] = useState(1);
const [loading, setLoading] = useState(false);

// useEffect for side effects
useEffect(() => {
    // Calculate price based on selected variations
    const calculatedPrice = calculateVariationPrice(
        product,
        selectedVariations
    );
    setCurrentPrice(calculatedPrice);
}, [selectedVariations, product]);
```

### Form State Management

```typescript
// Inertia.js form helper
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
});

const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('register'));
};
```

## Styling System

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.tsx',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light', 'dark'],
    },
};
```

### Component Styling Patterns

```typescript
// Consistent styling with Tailwind classes
const buttonClasses = cn(
    'inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150',
    {
        'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
        'bg-gray-600 text-white hover:bg-gray-700': variant === 'secondary',
        'opacity-25 cursor-not-allowed': disabled,
    }
);
```

### Responsive Design

```typescript
// Mobile-first responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
        <ProductItem key={product.id} product={product} />
    ))}
</div>
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy loading for route-based code splitting
const ProductShow = lazy(() => import('./Pages/Product/Show'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));

// Suspense wrapper for loading states
<Suspense fallback={<div>Loading...</div>}>
    <ProductShow />
</Suspense>;
```

### Image Optimization

```typescript
// Responsive images with multiple sizes
<img
    src={product.media?.large || '/images/placeholder.jpg'}
    srcSet={`
        ${product.media?.small} 480w,
        ${product.media?.large} 1200w
    `}
    sizes="(max-width: 768px) 480px, 1200px"
    alt={product.title}
    loading="lazy"
    className="w-full h-64 object-cover"
/>
```

### Memoization

```typescript
// Memoize expensive calculations
const calculatedPrice = useMemo(() => {
    return calculateVariationPrice(product, selectedVariations);
}, [product, selectedVariations]);

// Memoize callback functions
const handleVariationChange = useCallback(
    (typeId: number, optionId: number) => {
        setSelectedVariations((prev) => ({
            ...prev,
            [typeId]: optionId,
        }));
    },
    []
);
```

## Testing Strategy

### Component Testing

```typescript
// Example test for ProductItem component
import { render, screen } from '@testing-library/react';
import ProductItem from '../Components/App/ProductItem';

test('renders product information correctly', () => {
    const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        slug: 'test-product',
        image: '/test-image.jpg',
        department: 'Electronics',
        category: 'Phones',
    };

    render(<ProductItem product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
});
```

### Integration Testing

```typescript
// Test user interactions
import { fireEvent, waitFor } from '@testing-library/react';

test('adds product to cart when button clicked', async () => {
    render(<ProductShow product={mockProduct} />);

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
        expect(screen.getByText('Added to cart!')).toBeInTheDocument();
    });
});
```

## Build and Deployment

### Development Build

```bash
# Start development server with HMR
npm run dev

# Build for development
npm run build
```

### Production Build

```bash
# Build for production with optimizations
npm run build

# Build with SSR support
npm run build && npm run build:ssr
```

### Environment Configuration

```typescript
// vite.config.js
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Validation**: Use TypeScript interfaces for prop validation
3. **Composition over Inheritance**: Favor composition patterns
4. **Accessibility**: Include ARIA attributes and semantic HTML

### Performance

1. **Lazy Loading**: Load components and images on demand
2. **Memoization**: Cache expensive calculations and callbacks
3. **Bundle Optimization**: Use code splitting and tree shaking
4. **Image Optimization**: Use responsive images and lazy loading

### Code Quality

1. **TypeScript**: Use strict type checking
2. **ESLint**: Enforce coding standards
3. **Prettier**: Maintain consistent formatting
4. **Testing**: Write comprehensive tests for components and interactions

This frontend architecture provides a solid foundation for building a modern, scalable e-commerce user interface with excellent developer experience and performance characteristics.
