<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'name' => $this->faker->word() . ' Project',
            'status' => $this->faker->randomElement([0, 1, 2, 3, 4, 5]),
        ];
    }
}
