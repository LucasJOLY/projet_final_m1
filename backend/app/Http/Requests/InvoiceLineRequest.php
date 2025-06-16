<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class InvoiceLineRequest extends FormRequest
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
            'invoice_id' => ['required', 'exists:invoices,id'],
            'description' => ['required', 'string', 'max:1000'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'numeric', 'min:0'],
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
            'invoice_id.required' => __('messages.validation.invoice_id.required'),
            'invoice_id.exists' => __('messages.validation.invoice_id.exists'),
            'description.required' => __('messages.validation.description.required'),
            'description.string' => __('messages.validation.description.string'),
            'description.max' => __('messages.validation.description.max'),
            'unit_price.required' => __('messages.validation.unit_price.required'),
            'unit_price.numeric' => __('messages.validation.unit_price.numeric'),
            'unit_price.min' => __('messages.validation.unit_price.min'),
            'quantity.required' => __('messages.validation.quantity.required'),
            'quantity.numeric' => __('messages.validation.quantity.numeric'),
            'quantity.min' => __('messages.validation.quantity.min'),
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
