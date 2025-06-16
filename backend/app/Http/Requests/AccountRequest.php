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
            'role' => ['required', 'string', 'in:admin,user'],
        ];

        // Si c'est une création, ajouter la règle de mot de passe
        if (!$id) {
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        } else {
            $rules['password'] = ['nullable', 'string', 'min:8', 'confirmed'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => __('messages.validation.name.required'),
            'name.string' => __('messages.validation.name.string'),
            'name.max' => __('messages.validation.name.max'),
            'first_name.required' => __('messages.validation.first_name.required'),
            'first_name.string' => __('messages.validation.first_name.string'),
            'first_name.max' => __('messages.validation.first_name.max'),
            'birth_date.required' => __('messages.validation.birth_date.required'),
            'birth_date.date' => __('messages.validation.birth_date.date'),
            'address.required' => __('messages.validation.address.required'),
            'address.string' => __('messages.validation.address.string'),
            'address.max' => __('messages.validation.address.max'),
            'email.required' => __('messages.validation.email.required'),
            'email.email' => __('messages.validation.email.email'),
            'email.max' => __('messages.validation.email.max'),
            'email.unique' => __('messages.validation.email.unique'),
            'phone.required' => __('messages.validation.phone.required'),
            'phone.string' => __('messages.validation.phone.string'),
            'phone.max' => __('messages.validation.phone.max'),
            'max_annual_revenue.required' => __('messages.validation.max_annual_revenue.required'),
            'max_annual_revenue.numeric' => __('messages.validation.max_annual_revenue.numeric'),
            'max_annual_revenue.min' => __('messages.validation.max_annual_revenue.min'),
            'expense_rate.required' => __('messages.validation.expense_rate.required'),
            'expense_rate.numeric' => __('messages.validation.expense_rate.numeric'),
            'expense_rate.min' => __('messages.validation.expense_rate.min'),
            'expense_rate.max' => __('messages.validation.expense_rate.max'),
            'role.required' => __('messages.validation.role.required'),
            'role.string' => __('messages.validation.role.string'),
            'role.in' => __('messages.validation.role.in'),
            'password.required' => __('messages.validation.password.required'),
            'password.string' => __('messages.validation.password.string'),
            'password.min' => __('messages.validation.password.min'),
            'password.confirmed' => __('messages.validation.password.confirmed'),
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
