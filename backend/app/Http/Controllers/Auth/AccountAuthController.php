<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Requests\RegisterAccountRequest;
use App\Http\Requests\LoginAccountRequest;

class AccountAuthController extends Controller
{
    public function register(RegisterAccountRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = bcrypt($validated['password']);
        $account = Account::create($validated);
        $token = $account->createToken('api_token')->plainTextToken;
        return response()->json([
            'account' => new JsonResource($account),
            'token' => $token,
        ], 201);
    }

    public function login(LoginAccountRequest $request)
    {
        $validated = $request->validated();
        $account = Account::where('email', $validated['email'])->first();
        if (! $account || ! Hash::check($validated['password'], $account->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont invalides.'],
            ]);
        }
        $token = $account->createToken('api_token')->plainTextToken;
        return response()->json([
            'account' => new JsonResource($account),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function user(Request $request)
    {
        return new JsonResource($request->user());
    }
}
