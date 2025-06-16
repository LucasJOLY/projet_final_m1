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
            'status' => ['required', 'string', 'in:draft,in_progress,completed,cancelled'],
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
            'client_id.required' => __('messages.validation.client_id.required'),
            'client_id.exists' => __('messages.validation.client_id.exists'),
            'name.required' => __('messages.validation.name.required'),
            'name.string' => __('messages.validation.name.string'),
            'name.max' => __('messages.validation.name.max'),
            'status.required' => __('messages.validation.status.required'),
            'status.string' => __('messages.validation.status.string'),
            'status.in' => __('messages.validation.status.in'),
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
