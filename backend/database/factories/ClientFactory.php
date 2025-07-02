<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'account_id' => Account::factory(),
            'name' => $this->faker->company(),
            'contact_name' => $this->faker->lastName(),
            'contact_first_name' => $this->faker->firstName(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
        ];
    }
}
