# Installation Guide

## System Requirements

### Minimum Requirements
- **PHP**: 8.2 or higher
- **Node.js**: 18.0 or higher
- **NPM**: 9.0 or higher
- **Composer**: 2.0 or higher
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Web Server**: Apache 2.4+ or Nginx 1.18+

### Recommended Requirements
- **PHP**: 8.3 with OPcache enabled
- **Node.js**: 20.0 LTS
- **Memory**: 2GB RAM minimum, 4GB recommended
- **Storage**: 10GB free space
- **Database**: MySQL 8.0+ with InnoDB engine

### PHP Extensions Required
```bash
# Check if extensions are installed
php -m | grep -E "(pdo|pdo_mysql|mbstring|tokenizer|xml|ctype|json|bcmath|fileinfo|gd)"
```

Required extensions:
- `pdo`
- `pdo_mysql` (or `pdo_pgsql` for PostgreSQL)
- `mbstring`
- `tokenizer`
- `xml`
- `ctype`
- `json`
- `bcmath`
- `fileinfo`
- `gd` or `imagick`

## Installation Methods

### Method 1: Manual Installation (Recommended for Development)

#### Step 1: Clone the Repository
```bash
# Clone the repository
git clone <repository-url> laravel-react-ecommerce
cd laravel-react-ecommerce

# Or download and extract ZIP file
# wget <repository-zip-url>
# unzip laravel-react-ecommerce.zip
# cd laravel-react-ecommerce
```

#### Step 2: Install PHP Dependencies
```bash
# Install Composer dependencies
composer install

# For production, use:
# composer install --no-dev --optimize-autoloader
```

#### Step 3: Install Node.js Dependencies
```bash
# Install NPM dependencies
npm install

# Or using Yarn
# yarn install
```

#### Step 4: Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Step 5: Configure Environment Variables
Edit the `.env` file with your configuration:

```env
# Application Configuration
APP_NAME="Laravel React Ecommerce"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_ecommerce
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# File Storage
FILESYSTEM_DISK=local

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache Configuration
CACHE_STORE=database

# Queue Configuration
QUEUE_CONNECTION=database
```

#### Step 6: Database Setup
```bash
# Create database (MySQL example)
mysql -u root -p
CREATE DATABASE laravel_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

#### Step 7: Storage Setup
```bash
# Create symbolic link for storage
php artisan storage:link

# Set proper permissions (Linux/macOS)
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### Step 8: Build Frontend Assets
```bash
# For development
npm run dev

# For production
npm run build
```

#### Step 9: Start Development Server
```bash
# Start all services (recommended)
composer run dev

# Or start services individually:
# Laravel development server
php artisan serve

# Queue worker
php artisan queue:work

# Vite development server
npm run dev
```

### Method 2: Docker Installation

#### Prerequisites
- Docker 20.0+
- Docker Compose 2.0+

#### Step 1: Clone and Setup
```bash
git clone <repository-url> laravel-react-ecommerce
cd laravel-react-ecommerce
cp .env.example .env
```

#### Step 2: Docker Configuration
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - .:/var/www/html
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
    depends_on:
      - database
      - redis

  database:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: laravel_ecommerce
      MYSQL_USER: laravel
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: rootpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  node:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - .:/app
    command: npm run dev
    ports:
      - "5173:5173"

volumes:
  mysql_data:
```

#### Step 3: Build and Run
```bash
# Build and start containers
docker-compose up -d

# Install dependencies
docker-compose exec app composer install
docker-compose exec node npm install

# Setup application
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --seed
docker-compose exec app php artisan storage:link
```

### Method 3: Laravel Sail (Recommended for Laravel developers)

#### Step 1: Install via Composer
```bash
composer create-project laravel/laravel laravel-react-ecommerce
cd laravel-react-ecommerce

# Install Sail
composer require laravel/sail --dev
php artisan sail:install
```

#### Step 2: Configure Sail
```bash
# Start Sail
./vendor/bin/sail up -d

# Install project dependencies
./vendor/bin/sail composer install
./vendor/bin/sail npm install

# Setup application
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
```

## Production Deployment

### Server Requirements
- **Web Server**: Nginx or Apache with PHP-FPM
- **PHP**: 8.2+ with OPcache enabled
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Redis**: For caching and sessions
- **SSL Certificate**: Required for production

### Step 1: Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx mysql-server redis-server php8.2-fpm php8.2-mysql php8.2-xml php8.2-gd php8.2-mbstring php8.2-curl php8.2-zip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Step 2: Application Deployment
```bash
# Clone repository
git clone <repository-url> /var/www/laravel-react-ecommerce
cd /var/www/laravel-react-ecommerce

# Install dependencies
composer install --no-dev --optimize-autoloader
npm install && npm run build

# Set permissions
sudo chown -R www-data:www-data /var/www/laravel-react-ecommerce
sudo chmod -R 755 /var/www/laravel-react-ecommerce
sudo chmod -R 775 /var/www/laravel-react-ecommerce/storage
sudo chmod -R 775 /var/www/laravel-react-ecommerce/bootstrap/cache
```

### Step 3: Environment Configuration
```bash
# Copy and configure environment
cp .env.example .env
php artisan key:generate

# Configure production environment
nano .env
```

Production `.env` configuration:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_ecommerce_prod
DB_USERNAME=laravel_user
DB_PASSWORD=secure_password

# Cache and Sessions
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail (production SMTP)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
```

### Step 4: Database Setup
```bash
# Create production database
mysql -u root -p
CREATE DATABASE laravel_ecommerce_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'laravel_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON laravel_ecommerce_prod.* TO 'laravel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
php artisan migrate --force
php artisan db:seed --force
```

### Step 5: Web Server Configuration

#### Nginx Configuration
Create `/etc/nginx/sites-available/laravel-ecommerce`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/laravel-react-ecommerce/public;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    index index.php;

    charset utf-8;

    # Handle Laravel routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM Configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/laravel-ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Process Management
Create systemd service for queue worker:

```bash
# Create service file
sudo nano /etc/systemd/system/laravel-worker.service
```

Service configuration:
```ini
[Unit]
Description=Laravel queue worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/laravel-react-ecommerce/artisan queue:work --sleep=3 --tries=3 --max-time=3600
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable laravel-worker
sudo systemctl start laravel-worker
sudo systemctl status laravel-worker
```

### Step 7: Optimization
```bash
# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Optimize Composer autoloader
composer dump-autoload --optimize
```

### Step 8: SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Post-Installation

### Verification Checklist
- [ ] Application loads without errors
- [ ] Database connection works
- [ ] File uploads work (test product images)
- [ ] Email sending works (test registration)
- [ ] Queue processing works
- [ ] Admin panel accessible at `/admin`
- [ ] SSL certificate valid (production)

### Default Admin Access
```
Email: admin@example.com
Password: password
```

**Important**: Change the default admin password immediately after installation.

### Monitoring Setup
```bash
# Install monitoring tools
sudo apt install htop iotop

# Setup log rotation
sudo nano /etc/logrotate.d/laravel
```

Log rotation configuration:
```
/var/www/laravel-react-ecommerce/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

## Troubleshooting

### Common Issues

#### Permission Errors
```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### Database Connection Issues
```bash
# Check database service
sudo systemctl status mysql

# Test connection
php artisan tinker
DB::connection()->getPdo();
```

#### Queue Not Processing
```bash
# Check queue worker status
sudo systemctl status laravel-worker

# Restart queue worker
sudo systemctl restart laravel-worker

# Check queue jobs
php artisan queue:work --once
```

#### Asset Compilation Issues
```bash
# Clear Node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild assets
npm run build
```

### Performance Issues
```bash
# Enable OPcache
sudo nano /etc/php/8.2/fpm/php.ini

# Add/modify these settings:
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### Backup Strategy
```bash
# Database backup
mysqldump -u laravel_user -p laravel_ecommerce_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/laravel-react-ecommerce/storage/app/public
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor disk space and logs
- Backup database weekly
- Update SSL certificates (automatic with Let's Encrypt)
- Monitor application performance
- Review security logs

### Update Process
```bash
# Backup before updates
php artisan down

# Update dependencies
composer update
npm update && npm run build

# Run migrations
php artisan migrate --force

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan up
```

This installation guide provides comprehensive instructions for setting up the Laravel React e-commerce platform in various environments, from local development to production deployment.