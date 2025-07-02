<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class QuoteRequest extends FormRequest
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
            'project_id' => ['required', 'exists:projects,id'],
            'quote_number' => ['required', 'string', 'max:255'],
            'status' => ['required', 'integer', 'in:0,1,2'],
            'issue_date' => ['required', 'date'],
            'note' => ['nullable', 'string'],
            'quote_lines' => ['required', 'array', 'min:1'],
            'quote_lines.*.description' => ['required', 'string', 'max:255'],
            'quote_lines.*.unit_price' => ['required', 'numeric', 'min:0'],
            'quote_lines.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'messages.validation.project_id.required',
            'project_id.exists' => 'messages.validation.project_id.exists',
            'quote_number.required' => 'messages.validation.quote_number.required',
            'quote_number.string' => 'messages.validation.quote_number.string',
            'quote_number.max' => 'messages.validation.quote_number.max',
            'status.required' => 'messages.validation.status.required',
            'status.integer' => 'messages.validation.status.integer',
            'status.in' => 'messages.validation.status.in',
            'issue_date.required' => 'messages.validation.issue_date.required',
            'issue_date.date' => 'messages.validation.issue_date.date',
            'quote_lines.required' => 'messages.validation.quote_lines.required',
            'quote_lines.array' => 'messages.validation.quote_lines.array',
            'quote_lines.min' => 'messages.validation.quote_lines.min',
            'quote_lines.*.description.required' => 'messages.validation.quote_lines.description.required',
            'quote_lines.*.description.string' => 'messages.validation.quote_lines.description.string',
            'quote_lines.*.description.max' => 'messages.validation.quote_lines.description.max',
            'quote_lines.*.unit_price.required' => 'messages.validation.quote_lines.unit_price.required',
            'quote_lines.*.unit_price.numeric' => 'messages.validation.quote_lines.unit_price.numeric',
            'quote_lines.*.unit_price.min' => 'messages.validation.quote_lines.unit_price.min',
            'quote_lines.*.quantity.required' => 'messages.validation.quote_lines.quantity.required',
            'quote_lines.*.quantity.integer' => 'messages.validation.quote_lines.quantity.integer',
            'quote_lines.*.quantity.min' => 'messages.validation.quote_lines.quantity.min',
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
