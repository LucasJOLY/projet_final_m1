<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use App\Models\Account;
use App\Models\PasswordResetToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends BaseController
{
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email',
        ], [
            'email.required' => __('messages.validation.email.required'),
            'email.email' => __('messages.validation.email.email'),
            'email.exists' => __('messages.validation.email.exists')
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
        $resetLink = env('FRONTEND_URL') . '/reset-password/' . $token;
        Mail::send('emails.reset-password', ['resetLink' => $resetLink], function ($message) use ($account) {
            $message->to($account->email)
                ->subject('Réinitialisation de votre mot de passe');
        });

        return $this->sendResponse(null, __('messages.password_reset_sent'));
    }

    public function verifyResetToken(string $token)
    {
        $resetToken = PasswordResetToken::where('token', $token)->first();

        if (!$resetToken || !$resetToken->isValid()) {
            return $this->sendResponse(['valid' => false]);
        }

        return $this->sendResponse(['valid' => true]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.required' => __('messages.validation.password.required'),
            'password.min' => __('messages.validation.password.min'),
            'password.confirmed' => __('messages.validation.password.confirmed'),
        ]);

        $resetToken = PasswordResetToken::where('token', $request->token)->first();

        if (!$resetToken || !$resetToken->isValid()) {
            return $this->sendError(__('messages.password_reset_error'), [], 400);
        }

        $account = $resetToken->account;
        $account->password = Hash::make($request->password);
        $account->save();

        // Supprimer le token utilisé
        $resetToken->delete();

        return $this->sendResponse(null, __('messages.password_reset_success'));
    }
}
