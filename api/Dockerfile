FROM php:8.3-cli

# Extensions nécessaires pour Symfony + Doctrine + PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libicu-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql intl zip opcache \
    && rm -rf /var/lib/apt/lists/*

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copier uniquement les fichiers de dépendances d'abord (optimisation du cache Docker)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copier le reste du code
COPY . .

# Finaliser l'installation (exécute les scripts Symfony/Composer maintenant que tout le code est là)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Render fournit le port via la variable d'environnement $PORT
EXPOSE 10000
CMD php -S 0.0.0.0:${PORT:-10000} -t public