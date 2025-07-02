<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Requests\QuoteRequest;

class QuoteController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Quote::with(['quoteLines', 'project.client'])
            ->whereHas('project.client', function ($q) use ($user) {
                $q->where('account_id', $user->id);
            });

        if ($request->filled('client_id')) {
            $query->whereHas('project.client', function ($q) use ($request) {
                $q->where('id', $request->input('client_id'));
            });
        }

        $fields = [
            'project_id',
            'quote_number',
            'status',
            'issue_date',
            'expiry_date',
            'created_at',
            'updated_at',
        ];

        if ($request->filled('search_term')) {
            $searchTerm = $request->input('search_term');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('quote_number', 'like', '%' . $searchTerm . '%')
                    ->orWhere('note', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('project', function ($projectQuery) use ($searchTerm) {
                        $projectQuery->where('name', 'like', '%' . $searchTerm . '%');
                    });
            });
        }


        if ($request->filled('status')) {
            $statuses = $request->input('status');
            if (is_array($statuses)) {
                $query->whereIn('status', $statuses);
            } else {
                $query->where('status', $statuses);
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
        return $this->sendResponse($query->paginate($perPage));
    }

    public function store(QuoteRequest $request)
    {
        $validated = $request->validated();
        $quoteLines = $validated['quote_lines'];
        unset($validated['quote_lines']);

        $quote = Quote::create($validated);

        // Créer les lignes de devis
        foreach ($quoteLines as $lineData) {
            $quote->quoteLines()->create($lineData);
        }

        $quote->load(['quoteLines', 'project.client']);
        return $this->sendCreated($quote, 'quote');
    }

    public function show(Quote $quote, Request $request)
    {
        if ($request->user()->id !== $quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $quote->load(['quoteLines', 'project.client']);
        return $this->sendResponse($quote);
    }

    public function update(QuoteRequest $request, Quote $quote)
    {
        if ($request->user()->id !== $quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $quoteLines = $validated['quote_lines'];
        unset($validated['quote_lines']);

        $quote->update($validated);

        // Supprimer les anciennes lignes et créer les nouvelles
        $quote->quoteLines()->delete();
        foreach ($quoteLines as $lineData) {
            $quote->quoteLines()->create($lineData);
        }

        $quote->load(['quoteLines', 'project.client']);
        return $this->sendUpdated($quote, 'quote');
    }

    public function destroy(Quote $quote, Request $request)
    {
        if ($request->user()->id !== $quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $quote->delete();
        return $this->sendDeleted('quote');
    }

    public function getNextNumber(Request $request)
    {
        $user = $request->user();
        $lastQuote = Quote::whereHas('project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        })->orderBy('id', 'desc')->first();
        // enlève la partie DEV-
        $lastNumber = $lastQuote ? (int) substr($lastQuote->quote_number, 4) : 0;

        $nextNumber = $lastNumber + 1;
        return $this->sendResponse(['next_number' => sprintf('DEV-%03d', $nextNumber)]);
    }
}
