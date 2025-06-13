<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class AccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('account')->id ?? null;
        return [
            'name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'address' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('accounts')->ignore($id)],
            'phone' => 'required|string|max:30',
            'max_annual_revenue' => 'required|numeric',
            'expense_rate' => 'required|numeric',
            'password' => 'required|string|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est requis.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            'first_name.required' => 'Le prénom est requis.',
            'first_name.string' => 'Le prénom doit être une chaîne de caractères.',
            'first_name.max' => 'Le prénom ne doit pas dépasser 255 caractères.',
            'birth_date.required' => 'La date de naissance est requise.',
            'birth_date.date' => 'La date de naissance doit être une date valide.',
            'address.required' => 'L\'adresse est requise.',
            'address.string' => 'L\'adresse doit être une chaîne de caractères.',
            'address.max' => 'L\'adresse ne doit pas dépasser 255 caractères.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être une adresse email valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'phone.required' => 'Le numéro de téléphone est requis.',
            'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',
            'phone.max' => 'Le numéro de téléphone ne doit pas dépasser 30 caractères.',
            'max_annual_revenue.required' => 'Le revenu annuel maximum est requis.',
            'max_annual_revenue.numeric' => 'Le revenu annuel maximum doit être un nombre.',
            'expense_rate.required' => 'Le taux d\'expenses est requis.',
            'expense_rate.numeric' => 'Le taux d\'expenses doit être un nombre.',
            'password.required' => 'Le mot de passe est requis.',
            'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
