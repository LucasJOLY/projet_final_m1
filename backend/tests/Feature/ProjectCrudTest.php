<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Client;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_crud()
    {
        $account = Account::factory()->create();
        $client = Client::factory()->create(['account_id' => $account->id]);
        // Création
        $data = Project::factory()->make(['client_id' => $client->id])->toArray();
        $project = Project::create($data);
        $this->assertDatabaseHas('projects', ['name' => $data['name']]);

        // Lecture
        $found = Project::find($project->id);
        $this->assertNotNull($found);
        $this->assertEquals($data['name'], $found->name);

        // Modification
        $project->update(['name' => 'NouveauProjet']);
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'NouveauProjet']);

        // Suppression
        $project->delete();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
