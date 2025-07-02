<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4880FF;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>

<body>
    <h2>Réinitialisation de votre mot de passe</h2>

    <p>Bonjour,</p>

    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

    <a href="{{ $resetLink }}" class="button">Réinitialiser mon mot de passe</a>

    <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>

    <p>Ce lien expirera dans 30 minutes.</p>

    <div class="footer">
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
</body>

</html>