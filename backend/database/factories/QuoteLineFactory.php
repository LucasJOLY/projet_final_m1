<?php

namespace Database\Factories;

use App\Models\Quote;
use App\Models\QuoteLine;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuoteLineFactory extends Factory
{
    protected $model = QuoteLine::class;

    public function definition(): array
    {
        return [
            'quote_id' => Quote::factory(),
            'description' => $this->faker->sentence(),
            'unit_price' => $this->faker->randomFloat(2, 10, 1000),
            'quantity' => $this->faker->numberBetween(1, 10),
        ];
    }

    public function withHighPrice(): self
    {
        return $this->state(fn(array $attributes) => [
            'unit_price' => $this->faker->randomFloat(2, 1000, 5000),
        ]);
    }

    public function withLowPrice(): self
    {
        return $this->state(fn(array $attributes) => [
            'unit_price' => $this->faker->randomFloat(2, 1, 100),
        ]);
    }
}
