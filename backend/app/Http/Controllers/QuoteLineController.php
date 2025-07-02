<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\QuoteLine;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Requests\QuoteLineRequest;

class QuoteLineController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = QuoteLine::whereHas('quote.project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        $fields = [
            'quote_id',
            'description',
            'unit_price',
            'quantity',
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
        return $this->sendResponse(JsonResource::collection($query->paginate($perPage)));
    }

    public function store(QuoteLineRequest $request)
    {
        $validated = $request->validated();
        $quoteLine = QuoteLine::create($validated);
        return $this->sendCreated(new JsonResource($quoteLine), 'quote_line');
    }

    public function show(QuoteLine $quoteLine, Request $request)
    {
        if ($request->user()->id !== $quoteLine->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        return $this->sendResponse(new JsonResource($quoteLine));
    }

    public function update(QuoteLineRequest $request, QuoteLine $quoteLine)
    {
        if ($request->user()->id !== $quoteLine->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $quoteLine->update($validated);
        return $this->sendUpdated(new JsonResource($quoteLine), 'quote_line');
    }

    public function destroy(QuoteLine $quoteLine, Request $request)
    {
        if ($request->user()->id !== $quoteLine->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $quoteLine->delete();
        return $this->sendDeleted('quote_line');
    }
}
