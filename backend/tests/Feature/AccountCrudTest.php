<?php

namespace Tests\Feature;

use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_account_crud()
    {
        // Création
        $data = Account::factory()->make()->toArray();
        $data['password'] = 'password';
        $account = Account::create($data);
        $this->assertDatabaseHas('accounts', ['email' => $data['email']]);

        // Lecture
        $found = Account::find($account->id);
        $this->assertNotNull($found);
        $this->assertEquals($data['email'], $found->email);

        // Modification
        $account->update(['name' => 'NouveauNom']);
        $this->assertDatabaseHas('accounts', ['id' => $account->id, 'name' => 'NouveauNom']);

        // Suppression
        $account->delete();
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }
}
