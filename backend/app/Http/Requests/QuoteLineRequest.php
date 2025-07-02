<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

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

    public function messages(): array
    {
        return [
            'quote_id.required' => 'messages.validation.quote_id.required',
            'quote_id.exists' => 'messages.validation.quote_id.exists',
            'description.required' => 'messages.validation.description.required',
            'description.string' => 'messages.validation.description.string',
            'description.max' => 'messages.validation.description.max',
            'unit_price.required' => 'messages.validation.unit_price.required',
            'unit_price.numeric' => 'messages.validation.unit_price.numeric',
            'unit_price.min' => 'messages.validation.unit_price.min',
            'quantity.required' => 'messages.validation.quantity.required',
            'quantity.integer' => 'messages.validation.quantity.integer',
            'quantity.min' => 'messages.validation.quantity.min',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
