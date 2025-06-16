<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class QuoteLineRequest extends FormRequest
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
            'description' => ['required', 'string', 'max:1000'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'],
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
            'description.required' => __('messages.validation.description.required'),
            'description.string' => __('messages.validation.description.string'),
            'description.max' => __('messages.validation.description.max'),
            'unit_price.required' => __('messages.validation.unit_price.required'),
            'unit_price.numeric' => __('messages.validation.unit_price.numeric'),
            'unit_price.min' => __('messages.validation.unit_price.min'),
            'quantity.required' => __('messages.validation.quantity.required'),
            'quantity.integer' => __('messages.validation.quantity.integer'),
            'quantity.min' => __('messages.validation.quantity.min'),
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
