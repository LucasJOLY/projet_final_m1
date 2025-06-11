<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class QuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'reference' => ['required', 'string', 'max:255', 'unique:quotes,reference,' . $this->quote?->id],
            'status' => ['required', 'integer', 'in:0,1,2'],
            'issue_date' => ['required', 'date'],
            'expiry_date' => ['required', 'date', 'after:issue_date'],
            'note' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'Le projet est obligatoire.',
            'project_id.exists' => 'Le projet sélectionné n\'existe pas.',
            'reference.required' => 'La référence est obligatoire.',
            'reference.unique' => 'Cette référence est déjà utilisée.',
            'status.required' => 'Le statut est obligatoire.',
            'status.in' => 'Le statut doit être envoyé (0), accepté (1) ou refusé (2).',
            'issue_date.required' => 'La date d\'émission est obligatoire.',
            'issue_date.date' => 'La date d\'émission doit être une date valide.',
            'expiry_date.required' => 'La date d\'expiration est obligatoire.',
            'expiry_date.date' => 'La date d\'expiration doit être une date valide.',
            'expiry_date.after' => 'La date d\'expiration doit être postérieure à la date d\'émission.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException($validator, response()->json([
            'message' => 'Les données fournies ne sont pas valides.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
