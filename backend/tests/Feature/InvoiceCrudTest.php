<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\Client;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_crud()
    {
        $account = Account::factory()->create();
        $client = Client::factory()->create(['account_id' => $account->id]);
        $project = Project::factory()->create(['client_id' => $client->id]);
        // Création
        $data = Invoice::factory()->make(['project_id' => $project->id])->toArray();
        $invoice = Invoice::create($data);
        $this->assertDatabaseHas('invoices', ['invoice_number' => $data['invoice_number']]);

        // Lecture
        $found = Invoice::find($invoice->id);
        $this->assertNotNull($found);
        $this->assertEquals($data['invoice_number'], $found->invoice_number);

        // Modification
        $invoice->update(['status' => 'payée']);
        $this->assertDatabaseHas('invoices', ['id' => $invoice->id, 'status' => 'payée']);

        // Suppression
        $invoice->delete();
        $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
    }
}
