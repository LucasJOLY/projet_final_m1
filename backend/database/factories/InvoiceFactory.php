<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Quote;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        return [
            'quote_id' => Quote::factory(),
            'invoice_number' => $this->faker->unique()->numberBetween(1000, 9999),
            'status' => $this->faker->randomElement([0, 1, 2, 3]),
            'issue_date' => $this->faker->date(),
            'payment_due_date' => $this->faker->date(),
            'payment_type' => $this->faker->randomElement(['bank_transfer', 'check', 'paypal', 'other']),
            'actual_payment_date' => $this->faker->optional()->date(),
            'footer_note' => $this->faker->optional()->sentence(),
        ];
    }
}
