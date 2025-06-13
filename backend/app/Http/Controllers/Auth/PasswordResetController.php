<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\PasswordResetToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email',
        ]);

        $account = Account::where('email', $request->email)->first();

        // Supprimer les anciens tokens
        PasswordResetToken::where('account_id', $account->id)->delete();

        // Créer un nouveau token
        $token = Str::random(64);
        $expiresAt = Carbon::now()->addMinutes(30);

        PasswordResetToken::create([
            'account_id' => $account->id,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);

        // Envoyer l'email
        $resetLink = config('app.frontend_url') . '/reset-password/' . $token;
        Mail::send('emails.reset-password', ['resetLink' => $resetLink], function ($message) use ($account) {
            $message->to($account->email)
                ->subject('Réinitialisation de votre mot de passe');
        });

        return response()->json(['message' => 'Un email de réinitialisation a été envoyé.']);
    }

    public function verifyResetToken(string $token)
    {
        $resetToken = PasswordResetToken::where('token', $token)->first();

        if (!$resetToken || !$resetToken->isValid()) {
            return response()->json(['valid' => false]);
        }

        return response()->json(['valid' => true]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $resetToken = PasswordResetToken::where('token', $request->token)->first();

        if (!$resetToken || !$resetToken->isValid()) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 400);
        }

        $account = $resetToken->account;
        $account->password = Hash::make($request->password);
        $account->save();

        // Supprimer le token utilisé
        $resetToken->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }
}
