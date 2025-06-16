<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class InvoiceRequest extends FormRequest
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
            'quote_id' => ['required', 'exists:quotes,id'],
            'invoice_number' => ['required', 'string', 'max:255', 'unique:invoices,invoice_number,' . $this->invoice?->id],
            'status' => ['required', 'string', 'in:draft,sent,paid,overdue,cancelled'],
            'issue_date' => ['required', 'date'],
            'payment_due_date' => ['required', 'date', 'after:issue_date'],
            'payment_type' => ['required', 'string', 'in:bank_transfer,check,cash,credit_card'],
            'actual_payment_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'footer_note' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'quote_id.required' => __('messages.validation.quote_id.required'),
            'quote_id.exists' => __('messages.validation.quote_id.exists'),
            'invoice_number.required' => __('messages.validation.invoice_number.required'),
            'invoice_number.string' => __('messages.validation.invoice_number.string'),
            'invoice_number.max' => __('messages.validation.invoice_number.max'),
            'invoice_number.unique' => __('messages.validation.invoice_number.unique'),
            'status.required' => __('messages.validation.status.required'),
            'status.string' => __('messages.validation.status.string'),
            'status.in' => __('messages.validation.status.in'),
            'issue_date.required' => __('messages.validation.issue_date.required'),
            'issue_date.date' => __('messages.validation.issue_date.date'),
            'payment_due_date.required' => __('messages.validation.payment_due_date.required'),
            'payment_due_date.date' => __('messages.validation.payment_due_date.date'),
            'payment_due_date.after' => __('messages.validation.payment_due_date.after'),
            'payment_type.required' => __('messages.validation.payment_type.required'),
            'payment_type.string' => __('messages.validation.payment_type.string'),
            'payment_type.in' => __('messages.validation.payment_type.in'),
            'actual_payment_date.date' => __('messages.validation.actual_payment_date.date'),
            'actual_payment_date.after_or_equal' => __('messages.validation.actual_payment_date.after_or_equal'),
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
