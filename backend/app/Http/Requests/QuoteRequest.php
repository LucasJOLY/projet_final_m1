<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

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
            'reference' => ['required', 'string', 'max:255', 'unique:quotes,reference,' . $this->quote?->id],
            'status' => ['required', 'string', 'in:draft,sent,accepted,rejected'],
            'issue_date' => ['required', 'date'],
            'expiry_date' => ['required', 'date', 'after:issue_date'],
            'note' => ['nullable', 'string'],
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
            'project_id.required' => __('messages.validation.project_id.required'),
            'project_id.exists' => __('messages.validation.project_id.exists'),
            'reference.required' => __('messages.validation.reference.required'),
            'reference.unique' => 'Cette référence est déjà utilisée.',
            'reference.string' => __('messages.validation.reference.string'),
            'reference.max' => __('messages.validation.reference.max'),
            'status.required' => __('messages.validation.status.required'),
            'status.string' => __('messages.validation.status.string'),
            'status.in' => __('messages.validation.status.in'),
            'issue_date.required' => __('messages.validation.issue_date.required'),
            'issue_date.date' => __('messages.validation.issue_date.date'),
            'expiry_date.required' => __('messages.validation.expiry_date.required'),
            'expiry_date.date' => __('messages.validation.expiry_date.date'),
            'expiry_date.after' => __('messages.validation.expiry_date.after'),
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
