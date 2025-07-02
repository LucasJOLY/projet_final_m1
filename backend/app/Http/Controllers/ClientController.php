<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\ClientRequest;

class ClientController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Client::query()->where('account_id', $user->id);

        $fields = [
            'account_id',
            'is_company',
            'name',
            'contact_name',
            'contact_first_name',
            'address',
            'city',
            'phone',
            'email',
            'created_at',
            'updated_at',
        ];

        // Recherche globale avec LIKE
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('contact_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('contact_first_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('city', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('phone', 'LIKE', "%{$searchTerm}%");
            });
        }


        $sort = $request->input('sort_by', 'id');
        $order = $request->input('sort_order', 'asc');
        if (in_array($sort, $fields) && in_array($order, ['asc', 'desc'])) {
            $query->orderBy($sort, $order);
        }
        if ($request->input('sort_by') === 'created_at') {
            $query->orderBy('created_at', $order);
        }

        $perPage = $request->integer('per_page', 20);
        return $this->sendResponse($query->paginate($perPage));
    }

    public function store(ClientRequest $request)
    {
        $validated = $request->validated();
        $client = Client::create($validated);
        return $this->sendCreated($client, 'client');
    }

    public function show(Client $client, Request $request)
    {
        if ($request->user()->id !== $client->account_id) {
            return $this->sendForbidden();
        }
        return $this->sendResponse($client);
    }

    public function update(ClientRequest $request, Client $client)
    {
        if ($request->user()->id !== $client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $client->update($validated);
        return $this->sendUpdated($client, 'client');
    }

    public function destroy(Client $client, Request $request)
    {
        if ($request->user()->id !== $client->account_id) {
            return $this->sendForbidden();
        }
        if ($client->projects()->exists()) {
            return $this->sendError('client.delete.error.projects');
        }
        $client->delete();
        return $this->sendDeleted('client');
    }
}
