<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\InvoiceLine;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\InvoiceLineRequest;

class InvoiceLineController extends BaseController
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

    public function store(InvoiceLineRequest $request)
    {
        $validated = $request->validated();
        $item = InvoiceLine::create($validated);
        return $this->sendCreated(new JsonResource($item), 'invoice_line');
    }

    public function show(InvoiceLine $invoiceItem, Request $request)
    {
        if ($request->user()->id !== $invoiceItem->invoice->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        return $this->sendResponse(new JsonResource($invoiceItem));
    }

    public function update(InvoiceLineRequest $request, InvoiceLine $invoiceItem)
    {
        if ($request->user()->id !== $invoiceItem->invoice->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $invoiceItem->update($validated);
        return $this->sendUpdated(new JsonResource($invoiceItem), 'invoice_line');
    }

    public function destroy(InvoiceLine $invoiceItem, Request $request)
    {
        if ($request->user()->id !== $invoiceItem->invoice->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $invoiceItem->delete();
        return $this->sendDeleted('invoice_line');
    }
}
