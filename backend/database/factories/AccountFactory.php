<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->lastName(),
            'first_name' => $this->faker->firstName(),
            'birth_date' => $this->faker->date(),
            'address' => $this->faker->address(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'max_annual_revenue' => $this->faker->randomFloat(2, 10000, 1000000),
            'expense_rate' => $this->faker->randomFloat(2, 0, 1),
            'password' => bcrypt('password'),
            'is_admin' => $this->faker->boolean(),
        ];
    }
}
