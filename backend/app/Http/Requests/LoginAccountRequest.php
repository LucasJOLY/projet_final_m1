<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être une adresse email valide.',
            'password.required' => 'Le mot de passe est requis.',
        ];
    }
}
