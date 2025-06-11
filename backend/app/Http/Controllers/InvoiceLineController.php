<?php

namespace App\Http\Controllers;

use App\Models\InvoiceLine;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\InvoiceLineRequest;

class InvoiceLineController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = InvoiceLine::whereHas('invoice.quote.project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        $fields = [
            'invoice_id',
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
            if ($request->filled($field + '_min')) {
                $query->where($field, '>=', $request->input($field + '_min'));
            }
            if ($request->filled($field + '_max')) {
                $query->where($field, '<=', $request->input($field + '_max'));
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

    public function store(InvoiceLineRequest $request)
    {
        $validated = $request->validated();
        $item = InvoiceLine::create($validated);
        return new JsonResource($item);
    }

    public function show(InvoiceLine $invoiceItem, Request $request)
    {
        if ($request->user()->id !== $invoiceItem->invoice->quote->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        return new JsonResource($invoiceItem);
    }

    public function update(InvoiceLineRequest $request, InvoiceLine $invoiceItem)
    {
        if ($request->user()->id !== $invoiceItem->invoice->quote->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $validated = $request->validated();
        $invoiceItem->update($validated);
        return new JsonResource($invoiceItem);
    }

    public function destroy(InvoiceLine $invoiceItem, Request $request)
    {
        if ($request->user()->id !== $invoiceItem->invoice->quote->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $invoiceItem->delete();
        return response()->json(['message' => 'Ligne de facture supprimée avec succès.']);
    }
}
