<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\AccountRequest;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Requests\LoginAccountRequest;
use Illuminate\Support\Facades\Http;
use Laravel\Passport\RefreshTokenRepository;
use Laravel\Passport\TokenRepository;

class AccountAuthController extends BaseController
{
    public function register(AccountRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = bcrypt($validated['password']);
        $account = Account::create($validated);
        return $this->sendResponse(
            new JsonResource($account),
            'messages.register_success'
        );
    }

    public function checkEmail(Request $request)
    {
        $email = $request->input('email');
        $account = Account::where('email', $email)->first();
        return $this->sendResponse(['exists' => $account !== null]);
    }

    public function login(LoginAccountRequest $request)
    {
        $validated = $request->validated();

        try {
            $response = Http::asForm()->post(config('app.url') . '/oauth/token', [
                'grant_type' => 'password',
                'client_id' => '01976af6-a2c1-7082-a456-60fdc8e03c79',
                'client_secret' => 'hrD1HX7cEuhSgYYFx8g6SIRkLxyVm4QpLdyYQhAc',
                'username' => $validated['email'],
                'password' => $validated['password'],
                'scope' => '',
            ]);
        } catch (RequestException $e) {
            throw ValidationException::withMessages([
                'email' => ['messages.error'],
            ]);
        }

        if ($response->failed()) {
            throw ValidationException::withMessages([
                'email' => ['messages.login_error'],
            ]);
        }

        $account = Account::where('email', $validated['email'])->first();

        return $this->sendResponse([
            'token' => $response->json(),
            'account' => new JsonResource($account)
        ], 'messages.login_success');
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return $this->sendResponse(null, 'messages.logout_success');
    }

    public function user(Request $request)
    {
        return $this->sendResponse(new JsonResource($request->user()));
    }

    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);
        $http = Http::asForm()->post(config('app.url') . '/oauth/token', [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->refresh_token,
            'client_id' => config('passport.password_client_id'),
            'client_secret' => config('passport.password_client_secret'),
            'scope' => '',
        ]);
        if ($http->failed()) {
            return $this->sendError(__('messages.refresh_token_invalid'), [], 401);
        }
        return $this->sendResponse($http->json());
    }
}
