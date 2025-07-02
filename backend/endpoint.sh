#!/bin/bash

# Attendre que la base de données soit prête
echo "Attente de la base de données..."
while ! nc -z db 3306; do
  sleep 1
done
echo "Base de données prête!"

# Changer vers le répertoire de l'application
cd /var/www

# S'assurer que les permissions sont correctes
chown -R dev:www-data /var/www
chmod -R 755 /var/www/storage
chmod -R 755 /var/www/bootstrap/cache

# Exécuter les migrations en tant qu'utilisateur dev
echo "Exécution des migrations..."
su - dev -c "cd /var/www && php artisan migrate --force"

# Nettoyer et optimiser le cache
echo "Nettoyage et optimisation du cache..."
su - dev -c "cd /var/www && php artisan config:cache"
su - dev -c "cd /var/www && php artisan route:cache"
su - dev -c "cd /var/www && php artisan view:cache"

# Créer un script pour le scheduler
cat > /usr/local/bin/scheduler.sh << 'EOF'
#!/bin/bash
cd /var/www
while true; do
    php artisan schedule:run
    sleep 60
done
EOF

chmod +x /usr/local/bin/scheduler.sh

# Démarrer le scheduler en arrière-plan en tant qu'utilisateur dev
echo "Démarrage du scheduler Laravel..."
su - dev -c "/usr/local/bin/scheduler.sh" &

# Démarrer PHP-FPM
echo "Démarrage de PHP-FPM..."
exec php-fpm 