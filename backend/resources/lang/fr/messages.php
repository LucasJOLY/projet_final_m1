<?php

return [
    // Messages généraux
    'success' => 'Opération réussie.',
    'error' => 'Une erreur est survenue.',
    'forbidden' => 'Accès interdit.',
    'not_found' => 'Ressource non trouvée.',
    'validation_error' => 'Erreur de validation.',
    'unauthorized' => 'Non autorisé.',

    // Messages d'authentification
    'login_success' => 'Connexion réussie.',
    'login_error' => 'Les identifiants sont invalides.',
    'logout_success' => 'Déconnexion réussie.',
    'register_success' => 'Inscription réussie. Connectez-vous.',
    'password_reset_sent' => 'Un email de réinitialisation a été envoyé.',
    'password_reset_success' => 'Mot de passe réinitialisé avec succès.',
    'password_reset_error' => 'Token invalide ou expiré.',
    'refresh_token_invalid' => 'Token de rafraîchissement invalide.',

    // Messages CRUD
    'created' => ':resource créé avec succès.',
    'updated' => ':resource mis à jour avec succès.',
    'deleted' => ':resource supprimé avec succès.',
    'retrieved' => ':resource récupéré avec succès.',

    // Ressources
    'resources' => [
        'account' => 'Compte',
        'client' => 'Client',
        'project' => 'Projet',
        'quote' => 'Devis',
        'quote_line' => 'Ligne de devis',
        'invoice' => 'Facture',
        'invoice_line' => 'Ligne de facture',
    ],

    // Messages de validation
    'validation' => [
        'email' => [
            'required' => 'L\'adresse email est requise.',
            'email' => 'Veuillez entrer une adresse email valide.',
            'exists' => 'Aucun compte n\'est associé à cette adresse email.',
            'unique' => 'Cette adresse email est déjà utilisée.',
        ],
        'password' => [
            'required' => 'Le mot de passe est requis.',
            'min' => 'Le mot de passe doit contenir au moins :min caractères.',
            'confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ],
    ],
];
