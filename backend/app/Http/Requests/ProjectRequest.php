<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.required' => 'L\'identifiant du client est requis.',
            'client_id.exists' => 'Le client spécifié n\'existe pas.',
            'name.required' => 'Le nom du projet est requis.',
            'name.string' => 'Le nom du projet doit être une chaîne de caractères.',
            'name.max' => 'Le nom du projet ne doit pas dépasser 255 caractères.',
            'status.required' => 'Le statut est requis.',
            'status.string' => 'Le statut doit être une chaîne de caractères.',
            'status.max' => 'Le statut ne doit pas dépasser 100 caractères.',
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
