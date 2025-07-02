<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class AccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('account')->id ?? null;
        if (!$id) {
            $rules = [
                'name' => ['required', 'string', 'max:255'],
                'first_name' => ['required', 'string', 'max:255'],
                'birth_date' => ['required', 'date'],
                'address' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('accounts')->ignore($id),
                ],
                'phone' => ['required', 'string', 'max:20'],
                'max_annual_revenue' => ['required', 'numeric', 'min:0'],
                'expense_rate' => ['required', 'numeric', 'min:0', 'max:100'],
                'is_admin' => ['nullable', 'boolean'],
            ];
        } else {
            $rules = [
                'name' => ['nullable', 'string', 'max:255'],
                'first_name' => ['nullable', 'string', 'max:255'],
                'birth_date' => ['nullable', 'date'],
                'address' => ['nullable', 'string', 'max:255'],
                'email' => [
                    'nullable',
                    'email',
                    'max:255',
                    Rule::unique('accounts')->ignore($id),
                ],
                'phone' => ['nullable', 'string', 'max:20'],
                'max_annual_revenue' => ['nullable', 'numeric', 'min:0'],
                'expense_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
                'is_admin' => ['nullable', 'boolean'],
            ];
        }


        // Si c'est une création, ajouter la règle de mot de passe
        if (!$id) {
            $rules['password'] = ['required', 'string', 'min:8'];
        } else {
            $rules['password'] = ['nullable', 'string', 'min:8'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'messages.validation.name.required',
            'name.string' => 'messages.validation.name.string',
            'name.max' => 'messages.validation.name.max',
            'first_name.required' => 'messages.validation.first_name.required',
            'first_name.string' => 'messages.validation.first_name.string',
            'first_name.max' => 'messages.validation.first_name.max',
            'birth_date.required' => 'messages.validation.birth_date.required',
            'birth_date.date' => 'messages.validation.birth_date.date',
            'address.required' => 'messages.validation.address.required',
            'address.string' => 'messages.validation.address.string',
            'address.max' => 'messages.validation.address.max',
            'email.required' => 'messages.validation.email.required',
            'email.email' => 'messages.validation.email.email',
            'email.max' => 'messages.validation.email.max',
            'email.unique' => 'messages.validation.email.unique',
            'phone.required' => 'messages.validation.phone.required',
            'phone.string' => 'messages.validation.phone.string',
            'phone.max' => 'messages.validation.phone.max',
            'max_annual_revenue.required' => 'messages.validation.max_annual_revenue.required',
            'max_annual_revenue.numeric' => 'messages.validation.max_annual_revenue.numeric',
            'max_annual_revenue.min' => 'messages.validation.max_annual_revenue.min',
            'expense_rate.required' => 'messages.validation.expense_rate.required',
            'expense_rate.numeric' => 'messages.validation.expense_rate.numeric',
            'expense_rate.min' => 'messages.validation.expense_rate.min',
            'expense_rate.max' => 'messages.validation.expense_rate.max',
            'password.required' => 'messages.validation.password.required',
            'password.string' => 'messages.validation.password.string',
            'password.min' => 'messages.validation.password.min',
            'password.confirmed' => 'messages.validation.password.confirmed',
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
