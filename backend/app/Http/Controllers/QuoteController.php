<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Requests\QuoteRequest;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Quote::whereHas('project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        $fields = [
            'project_id',
            'reference',
            'status',
            'issue_date',
            'expiry_date',
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

    public function store(QuoteRequest $request)
    {
        $validated = $request->validated();
        $quote = Quote::create($validated);
        return new JsonResource($quote);
    }

    public function show(Quote $quote, Request $request)
    {
        if ($request->user()->id !== $quote->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        return new JsonResource($quote);
    }

    public function update(QuoteRequest $request, Quote $quote)
    {
        if ($request->user()->id !== $quote->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $validated = $request->validated();
        $quote->update($validated);
        return new JsonResource($quote);
    }

    public function destroy(Quote $quote, Request $request)
    {
        if ($request->user()->id !== $quote->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $quote->delete();
        return response()->json(['message' => 'Devis supprimé avec succès.']);
    }
}
