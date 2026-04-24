FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev zip curl \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# CMD sh -c "php artisan migrate --force || true; php artisan serve --host=0.0.0.0 --port=$PORT"

CMD ["sh", "-c", "php artisan storage:link || true; php artisan migrate --force || true; php artisan serve --host=0.0.0.0 --port=$PORT"]