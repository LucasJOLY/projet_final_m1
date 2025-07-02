<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Requests\CreateInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;

class InvoiceController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Invoice::with(['invoiceLines', 'project.client'])
            ->whereHas('project.client', function ($q) use ($user) {
                $q->where('account_id', $user->id);
            });

        if ($request->filled('client_id')) {
            $query->whereHas('project.client', function ($q) use ($request) {
                $q->where('id', $request->input('client_id'));
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

        // Filtre pour les factures en retard uniquement
        if ($request->filled('overdue_only') && $request->boolean('overdue_only')) {
            $query->where('status', 2) // Statut "envoyée"
                ->where('payment_due_date', '<', now()->toDateString());
        }

        // Filtre de recherche par terme
        if ($request->filled('search_term')) {
            $searchTerm = $request->input('search_term');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('invoice_number', 'like', '%' . $searchTerm . '%')
                    ->orWhere('footer_note', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('project', function ($projectQuery) use ($searchTerm) {
                        $projectQuery->where('name', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

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
            'total',
        ];

        // foreach ($fields as $field) {
        //     if ($request->filled($field)) {
        //         $query->where($field, $request->input($field));
        //     }
        //     if ($request->filled($field . '_min')) {
        //         $query->where($field, '>=', $request->input($field . '_min'));
        //     }
        //     if ($request->filled($field . '_max')) {
        //         $query->where($field, '<=', $request->input($field . '_max'));
        //     }
        // }

        $sort = $request->input('sort_by', 'id');
        $order = $request->input('sort_order', 'asc');

        // Tri spécial pour le total (attribut calculé)
        if ($sort === 'total') {
            $query->select('invoices.*')
                ->selectSub(function ($subQuery) {
                    $subQuery->selectRaw('COALESCE(SUM(unit_price * quantity), 0)')
                        ->from('invoice_lines')
                        ->whereColumn('invoice_lines.invoice_id', 'invoices.id');
                }, 'calculated_total')
                ->orderBy('calculated_total', $order);
        } elseif (in_array($sort, $fields) && in_array($order, ['asc', 'desc'])) {
            $query->orderBy($sort, $order);
        }

        if ($request->input('sort_by') === 'created_at') {
            $query->orderBy('created_at', $order);
        }

        $perPage = $request->integer('per_page', 20);
        return $this->sendResponse($query->paginate($perPage));
    }

    public function store(CreateInvoiceRequest $request)
    {
        $validated = $request->validated();
        $invoiceLines = $validated['invoice_lines'];
        unset($validated['invoice_lines']);

        $invoice = Invoice::create($validated);

        // Créer les lignes de facture
        foreach ($invoiceLines as $lineData) {
            $invoice->invoiceLines()->create($lineData);
        }

        $invoice->load(['invoiceLines', 'project.client']);
        return $this->sendCreated($invoice, 'invoice');
    }

    public function show(Invoice $invoice, Request $request)
    {
        if ($request->user()->id !== $invoice->project->client->account_id) {
            return $this->sendForbidden();
        }
        $invoice->load(['invoiceLines', 'project.client']);
        return $this->sendResponse($invoice);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        if ($request->user()->id !== $invoice->project->client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $invoiceLines = $validated['invoice_lines'];
        unset($validated['invoice_lines']);

        $invoice->update($validated);

        // Supprimer les anciennes lignes et créer les nouvelles
        $invoice->invoiceLines()->delete();
        foreach ($invoiceLines as $lineData) {
            $invoice->invoiceLines()->create($lineData);
        }

        $invoice->load(['invoiceLines', 'project.client']);
        return $this->sendUpdated($invoice, 'invoice');
    }

    public function destroy(Invoice $invoice, Request $request)
    {
        if ($request->user()->id !== $invoice->project->client->account_id) {
            return $this->sendForbidden();
        }
        $invoice->delete();
        return $this->sendDeleted('invoice');
    }

    public function getNextNumber(Request $request)
    {
        $user = $request->user();
        $lastInvoice = Invoice::whereHas('project.client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        })->orderBy('id', 'desc')->first();
        // enlève la partie FAC-
        $lastNumber = $lastInvoice ? (int) substr($lastInvoice->invoice_number, 4) : 0;

        $nextNumber = $lastNumber + 1;
        return $this->sendResponse(['next_number' => sprintf('FAC-%03d', $nextNumber)]);
    }
}
