<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Quote;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuoteFactory extends Factory
{
    protected $model = Quote::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'reference' => 'DEV-' . $this->faker->unique()->numberBetween(1000, 9999),
            'status' => $this->faker->randomElement([0, 1, 2]),
            'issue_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'expiry_date' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['issue_date'], '+30 days');
            },
            'note' => $this->faker->optional(0.7)->paragraph(),
        ];
    }

    public function sent(): self
    {
        return $this->state(fn(array $attributes) => [
            'status' => 0,
        ]);
    }

    public function accepted(): self
    {
        return $this->state(fn(array $attributes) => [
            'status' => 1,
        ]);
    }

    public function rejected(): self
    {
        return $this->state(fn(array $attributes) => [
            'status' => 2,
        ]);
    }
}
