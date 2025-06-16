<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\InvoiceRequest;

class InvoiceController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Invoice::whereHas('quote.project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        $fields = [
            'quote_id',
            'invoice_number',
            'status',
            'issue_date',
            'payment_due_date',
            'payment_type',
            'actual_payment_date',
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

    public function store(InvoiceRequest $request)
    {
        $validated = $request->validated();
        $invoice = Invoice::create($validated);
        return $this->sendCreated(new JsonResource($invoice), 'invoice');
    }

    public function show(Invoice $invoice, Request $request)
    {
        if ($request->user()->id !== $invoice->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        return $this->sendResponse(new JsonResource($invoice));
    }

    public function update(InvoiceRequest $request, Invoice $invoice)
    {
        if ($request->user()->id !== $invoice->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $invoice->update($validated);
        return $this->sendUpdated(new JsonResource($invoice), 'invoice');
    }

    public function destroy(Invoice $invoice, Request $request)
    {
        if ($request->user()->id !== $invoice->quote->project->client->account_id) {
            return $this->sendForbidden();
        }
        $invoice->delete();
        return $this->sendDeleted('invoice');
    }
}
