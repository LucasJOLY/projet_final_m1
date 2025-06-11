<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class InvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'invoice_number' => 'required|integer',
            'status' => 'required|string|max:100',
            'issue_date' => 'required|date',
            'payment_due_date' => 'required|date',
            'payment_type' => 'required|string|max:100',
            'actual_payment_date' => 'nullable|date',
            'footer_note' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'L\'identifiant du projet est requis.',
            'project_id.exists' => 'Le projet spécifié n\'existe pas.',
            'invoice_number.required' => 'Le numéro de facture est requis.',
            'invoice_number.integer' => 'Le numéro de facture doit être un entier.',
            'status.required' => 'Le statut est requis.',
            'status.string' => 'Le statut doit être une chaîne de caractères.',
            'status.max' => 'Le statut ne doit pas dépasser 100 caractères.',
            'issue_date.required' => 'La date d\'émission est requise.',
            'issue_date.date' => 'La date d\'émission doit être une date valide.',
            'payment_due_date.required' => 'La date d\'échéance est requise.',
            'payment_due_date.date' => 'La date d\'échéance doit être une date valide.',
            'payment_type.required' => 'Le type de paiement est requis.',
            'payment_type.string' => 'Le type de paiement doit être une chaîne de caractères.',
            'payment_type.max' => 'Le type de paiement ne doit pas dépasser 100 caractères.',
            'actual_payment_date.date' => 'La date de paiement réelle doit être une date valide.',
            'footer_note.string' => 'La note de bas de page doit être une chaîne de caractères.',
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
