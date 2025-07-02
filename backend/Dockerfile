FROM php:8.2-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    netcat-traditional \
    sudo

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands with shell access
RUN useradd -G www-data,root -u 1000 -d /home/dev -s /bin/bash dev
RUN mkdir -p /home/dev/.composer && \
    chown -R dev:dev /home/dev

# Allow dev user to run commands without password
RUN echo "dev ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set working directory
WORKDIR /var/www

# Copy endpoint script
COPY endpoint.sh /usr/local/bin/endpoint.sh
RUN chmod +x /usr/local/bin/endpoint.sh

# Make sure the working directory is owned by dev
RUN chown -R dev:www-data /var/www

# Set the entrypoint (will run as root initially)
ENTRYPOINT ["/usr/local/bin/endpoint.sh"] 