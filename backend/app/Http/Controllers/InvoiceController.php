<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\InvoiceRequest;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Invoice::whereHas('project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        $fields = [
            'project_id',
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

    public function store(InvoiceRequest $request)
    {
        $validated = $request->validated();
        $invoice = Invoice::create($validated);
        return new JsonResource($invoice);
    }

    public function show(Invoice $invoice, Request $request)
    {
        if ($request->user()->id !== $invoice->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        return new JsonResource($invoice);
    }

    public function update(InvoiceRequest $request, Invoice $invoice)
    {
        if ($request->user()->id !== $invoice->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $validated = $request->validated();
        $invoice->update($validated);
        return new JsonResource($invoice);
    }

    public function destroy(Invoice $invoice, Request $request)
    {
        if ($request->user()->id !== $invoice->project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $invoice->delete();
        return response()->json(['message' => 'Facture supprimée avec succès.']);
    }
}
