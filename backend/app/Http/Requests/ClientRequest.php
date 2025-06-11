<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'account_id' => 'required|exists:accounts,id',
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_first_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'email' => 'required|email',
        ];
    }

    public function messages(): array
    {
        return [
            'account_id.required' => 'L\'identifiant du compte est requis.',
            'account_id.exists' => 'Le compte spécifié n\'existe pas.',
            'name.required' => 'Le nom du client est requis.',
            'name.string' => 'Le nom du client doit être une chaîne de caractères.',
            'name.max' => 'Le nom du client ne doit pas dépasser 255 caractères.',
            'contact_name.required' => 'Le nom du contact est requis.',
            'contact_name.string' => 'Le nom du contact doit être une chaîne de caractères.',
            'contact_name.max' => 'Le nom du contact ne doit pas dépasser 255 caractères.',
            'contact_first_name.required' => 'Le prénom du contact est requis.',
            'contact_first_name.string' => 'Le prénom du contact doit être une chaîne de caractères.',
            'contact_first_name.max' => 'Le prénom du contact ne doit pas dépasser 255 caractères.',
            'address.required' => 'L\'adresse est requise.',
            'address.string' => 'L\'adresse doit être une chaîne de caractères.',
            'address.max' => 'L\'adresse ne doit pas dépasser 255 caractères.',
            'city.required' => 'La ville est requise.',
            'city.string' => 'La ville doit être une chaîne de caractères.',
            'city.max' => 'La ville ne doit pas dépasser 255 caractères.',
            'phone.required' => 'Le numéro de téléphone est requis.',
            'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',
            'phone.max' => 'Le numéro de téléphone ne doit pas dépasser 30 caractères.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être une adresse email valide.',
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
