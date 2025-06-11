<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_crud()
    {
        $account = Account::factory()->create();
        // Création
        $data = Client::factory()->make(['account_id' => $account->id])->toArray();
        $client = Client::create($data);
        $this->assertDatabaseHas('clients', ['email' => $data['email']]);

        // Lecture
        $found = Client::find($client->id);
        $this->assertNotNull($found);
        $this->assertEquals($data['email'], $found->email);

        // Modification
        $client->update(['name' => 'NouveauClient']);
        $this->assertDatabaseHas('clients', ['id' => $client->id, 'name' => 'NouveauClient']);

        // Suppression
        $client->delete();
        $this->assertDatabaseMissing('clients', ['id' => $client->id]);
    }
}
