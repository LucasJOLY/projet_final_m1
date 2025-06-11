<?php

namespace Tests\Feature;

use App\Models\InvoiceItem;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Client;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceItemCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_item_crud()
    {
        $account = Account::factory()->create();
        $client = Client::factory()->create(['account_id' => $account->id]);
        $project = Project::factory()->create(['client_id' => $client->id]);
        $invoice = Invoice::factory()->create(['project_id' => $project->id]);
        // Création
        $data = InvoiceItem::factory()->make(['invoice_id' => $invoice->id])->toArray();
        $item = InvoiceItem::create($data);
        $this->assertDatabaseHas('invoice_items', ['description' => $data['description']]);

        // Lecture
        $found = InvoiceItem::find($item->id);
        $this->assertNotNull($found);
        $this->assertEquals($data['description'], $found->description);

        // Modification
        $item->update(['description' => 'Nouveau produit']);
        $this->assertDatabaseHas('invoice_items', ['id' => $item->id, 'description' => 'Nouveau produit']);

        // Suppression
        $item->delete();
        $this->assertDatabaseMissing('invoice_items', ['id' => $item->id]);
    }
}
