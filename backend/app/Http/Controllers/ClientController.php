<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\ClientRequest;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Client::query()->where('account_id', $user->id);

        $fields = [
            'account_id',
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
        foreach ($fields as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
            if ($request->filled($field . '_min')) {
                $query->where($field, '>=', $request->input($field . '_min'));
            }
            if ($request->filled($field . '_max')) {
                $query->where($field, '<=', $request->input($field . '_max'));
            }
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
        return JsonResource::collection($query->paginate($perPage));
    }

    public function store(ClientRequest $request)
    {
        $validated = $request->validated();
        $client = Client::create($validated);
        return new JsonResource($client);
    }

    public function show(Client $client, Request $request)
    {
        if ($request->user()->id !== $client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        return new JsonResource($client);
    }

    public function update(ClientRequest $request, Client $client)
    {
        if ($request->user()->id !== $client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $validated = $request->validated();
        $client->update($validated);
        return new JsonResource($client);
    }

    public function destroy(Client $client, Request $request)
    {
        if ($request->user()->id !== $client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $client->delete();
        return response()->json(['message' => 'Client supprimé avec succès.']);
    }
}
