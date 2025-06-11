<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'address' => 'required|string|max:255',
            'email' => 'required|email|unique:accounts,email',
            'phone' => 'required|string|max:30',
            'max_annual_revenue' => 'required|numeric',
            'expense_rate' => 'required|numeric',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|max:50',
        ];
    }
}
