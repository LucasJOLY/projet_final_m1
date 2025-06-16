<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'account_id' => ['required', 'exists:accounts,id'],
            'name' => ['required', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_first_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('clients')->ignore($this->client),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'account_id.required' => __('messages.validation.account_id.required'),
            'account_id.exists' => __('messages.validation.account_id.exists'),
            'name.required' => __('messages.validation.name.required'),
            'name.string' => __('messages.validation.name.string'),
            'name.max' => __('messages.validation.name.max'),
            'contact_name.required' => __('messages.validation.contact_name.required'),
            'contact_name.string' => __('messages.validation.contact_name.string'),
            'contact_name.max' => __('messages.validation.contact_name.max'),
            'contact_first_name.required' => __('messages.validation.contact_first_name.required'),
            'contact_first_name.string' => __('messages.validation.contact_first_name.string'),
            'contact_first_name.max' => __('messages.validation.contact_first_name.max'),
            'address.required' => __('messages.validation.address.required'),
            'address.string' => __('messages.validation.address.string'),
            'address.max' => __('messages.validation.address.max'),
            'city.required' => __('messages.validation.city.required'),
            'city.string' => __('messages.validation.city.string'),
            'city.max' => __('messages.validation.city.max'),
            'phone.required' => __('messages.validation.phone.required'),
            'phone.string' => __('messages.validation.phone.string'),
            'phone.max' => __('messages.validation.phone.max'),
            'email.required' => __('messages.validation.email.required'),
            'email.email' => __('messages.validation.email.email'),
            'email.max' => __('messages.validation.email.max'),
            'email.unique' => __('messages.validation.email.unique'),
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
