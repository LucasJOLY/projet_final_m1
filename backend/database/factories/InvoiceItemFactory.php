<?php

namespace Database\Factories;

use App\Models\InvoiceItem;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceItemFactory extends Factory
{
    protected $model = InvoiceItem::class;

    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'description' => $this->faker->sentence(3),
            'unit_price' => $this->faker->randomFloat(2, 10, 1000),
            'quantity' => $this->faker->numberBetween(1, 20),
        ];
    }
}
