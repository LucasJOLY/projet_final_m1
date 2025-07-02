<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UpdateInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|integer|exists:projects,id',
            'invoice_number' => 'required|string|max:255',
            'status' => 'required|integer|in:0,1,2,3', // Tous les statuts possibles en modification
            'issue_date' => 'required|date',
            'payment_due_date' => 'required|date|after_or_equal:issue_date',
            'payment_type' => 'required|string|in:bank_transfer,check,paypal,other',
            'actual_payment_date' => 'nullable|date|after_or_equal:issue_date',
            'footer_note' => 'nullable|string',
            'invoice_lines' => 'required|array|min:1',
            'invoice_lines.*.description' => 'required|string|max:500',
            'invoice_lines.*.unit_price' => 'required|numeric|min:0',
            'invoice_lines.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'messages.validation.project_id.required',
            'project_id.exists' => 'messages.validation.project_id.exists',
            'invoice_number.required' => 'messages.validation.invoice_number.required',
            'invoice_number.max' => 'messages.validation.invoice_number.max',
            'status.required' => 'messages.validation.status.required',
            'status.in' => 'messages.validation.status.in',
            'issue_date.required' => 'messages.validation.issue_date.required',
            'issue_date.date' => 'messages.validation.issue_date.date',
            'payment_due_date.required' => 'messages.validation.payment_due_date.required',
            'payment_due_date.date' => 'messages.validation.payment_due_date.date',
            'payment_due_date.after_or_equal' => 'messages.validation.payment_due_date.after_or_equal',
            'payment_type.required' => 'messages.validation.payment_type.required',
            'payment_type.in' => 'messages.validation.payment_type.in',
            'actual_payment_date.date' => 'messages.validation.actual_payment_date.date',
            'actual_payment_date.after_or_equal' => 'messages.validation.actual_payment_date.after_or_equal',
            'invoice_lines.required' => 'messages.validation.invoice_lines.required',
            'invoice_lines.min' => 'messages.validation.invoice_lines.min',
            'invoice_lines.*.description.required' => 'messages.validation.invoice_lines.description.required',
            'invoice_lines.*.description.max' => 'messages.validation.invoice_lines.description.max',
            'invoice_lines.*.unit_price.required' => 'messages.validation.invoice_lines.unit_price.required',
            'invoice_lines.*.unit_price.numeric' => 'messages.validation.invoice_lines.unit_price.numeric',
            'invoice_lines.*.unit_price.min' => 'messages.validation.invoice_lines.unit_price.min',
            'invoice_lines.*.quantity.required' => 'messages.validation.invoice_lines.quantity.required',
            'invoice_lines.*.quantity.integer' => 'messages.validation.invoice_lines.quantity.integer',
            'invoice_lines.*.quantity.min' => 'messages.validation.invoice_lines.quantity.min',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
