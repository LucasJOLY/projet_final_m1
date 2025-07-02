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
        $rules = [
            'account_id' => ['required', 'exists:accounts,id'],
            'is_company' => ['required', 'boolean'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('clients')->where(function ($query) {
                    return $query->where('account_id', $this->input('account_id'));
                })->ignore($this->client),
            ],
        ];

        // Règles conditionnelles selon le type (entreprise ou personne)
        if ($this->input('is_company') == 1) {
            // Pour une entreprise
            $rules['name'] = ['required', 'string', 'max:255'];
            $rules['contact_name'] = ['required', 'string', 'max:255'];
            $rules['contact_first_name'] = ['nullable', 'string', 'max:255'];
        } else {
            // Pour une personne
            $rules['name'] = ['nullable', 'string', 'max:255'];
            $rules['contact_name'] = ['required', 'string', 'max:255'];
            $rules['contact_first_name'] = ['required', 'string', 'max:255'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'account_id.required' => 'messages.validation.account_id.required',
            'account_id.exists' => 'messages.validation.account_id.exists',
            'is_company.required' => 'messages.validation.is_company.required',
            'is_company.boolean' => 'messages.validation.is_company.boolean',
            'name.required' => 'messages.validation.name.required',
            'name.string' => 'messages.validation.name.string',
            'name.max' => 'messages.validation.name.max',
            'contact_name.required' => 'messages.validation.contact_name.required',
            'contact_name.string' => 'messages.validation.contact_name.string',
            'contact_name.max' => 'messages.validation.contact_name.max',
            'contact_first_name.required' => 'messages.validation.contact_first_name.required',
            'contact_first_name.string' => 'messages.validation.contact_first_name.string',
            'contact_first_name.max' => 'messages.validation.contact_first_name.max',
            'address.required' => 'messages.validation.address.required',
            'address.string' => 'messages.validation.address.string',
            'address.max' => 'messages.validation.address.max',
            'city.required' => 'messages.validation.city.required',
            'city.string' => 'messages.validation.city.string',
            'city.max' => 'messages.validation.city.max',
            'phone.required' => 'messages.validation.phone.required',
            'phone.string' => 'messages.validation.phone.string',
            'phone.max' => 'messages.validation.phone.max',
            'email.required' => 'messages.validation.email.required',
            'email.email' => 'messages.validation.email.email',
            'email.max' => 'messages.validation.email.max',
            'email.unique' => 'messages.validation.email.unique',
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
