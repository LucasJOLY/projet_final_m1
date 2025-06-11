<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'invoice_number' => $this->faker->unique()->numberBetween(1000, 9999),
            'status' => $this->faker->randomElement(['envoyée', 'payée', 'en retard']),
            'issue_date' => $this->faker->date(),
            'payment_due_date' => $this->faker->date(),
            'payment_type' => $this->faker->randomElement(['virement', 'chèque', 'espèces']),
            'actual_payment_date' => $this->faker->optional()->date(),
            'footer_note' => $this->faker->optional()->sentence(),
        ];
    }
}
