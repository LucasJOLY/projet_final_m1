<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProjectRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'integer', 'between:0,5'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.required' => 'messages.validation.client_id.required',
            'client_id.exists' => 'messages.validation.client_id.exists',
            'name.required' => 'messages.validation.name.required',
            'name.string' => 'messages.validation.name.string',
            'name.max' => 'messages.validation.name.max',
            'status.required' => 'messages.validation.status.required',
            'status.integer' => 'messages.validation.status.integer',
            'status.between' => 'messages.validation.status.between',
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
