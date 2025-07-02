<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Client;
use App\Models\Project;
use App\Models\Invoice;
use App\Models\Account;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $currentYear = Carbon::now()->year;
            $lastYear = $currentYear - 1;

            // Récupération des données principales
            $data = [
                'clients' => $this->getClientsData($user->id, $currentYear, $lastYear),
                'projects' => $this->getProjectsData($user->id, $currentYear, $lastYear),
                'revenue' => $this->getRevenueData($user->id),
                'pending_payments' => $this->getPendingPayments($user->id),
                'draft_invoices' => $this->getDraftInvoices($user->id),
            ];

            return $this->sendResponse($data);
        } catch (\Exception $e) {
            return $this->sendError('dashboard.error.loading', [], 500);
        }
    }

    public function getQuarterData(Request $request)
    {
        try {
            $user = $request->user();
            $quarter = $request->input('quarter', 'current'); // current, previous, next

            $quarterData = $this->getQuarterDates($quarter);

            $data = [
                'period' => $quarterData,
                'paid_revenue' => $this->getQuarterPaidRevenue($user->id, $quarterData['start'], $quarterData['end']),
                'estimated_revenue' => $this->getQuarterEstimatedRevenue($user->id, $quarterData['start'], $quarterData['end']),
                'expenses_to_pay' => $this->getQuarterExpensesToPay($user->id, $quarterData['start'], $quarterData['end']),
                'estimated_expenses' => $this->getQuarterEstimatedExpenses($user->id, $quarterData['start'], $quarterData['end']),
            ];

            return $this->sendResponse($data);
        } catch (\Exception $e) {
            return $this->sendError('dashboard.error.quarter', [], 500);
        }
    }

    public function getChartsData(Request $request)
    {
        try {
            $user = $request->user();
            $year = $request->input('year', Carbon::now()->year);

            $data = [
                'monthly_revenue' => $this->getMonthlyRevenue($user->id, $year),
                'cumulative_revenue' => $this->getCumulativeRevenue($user->id, $year),
                'available_years' => $this->getAvailableYears($user->id),
                'selected_year' => $year,
            ];

            return $this->sendResponse($data);
        } catch (\Exception $e) {
            return $this->sendError('dashboard.error.charts', [], 500);
        }
    }

    private function getClientsData($accountId, $currentYear, $lastYear)
    {
        // Total actuel de clients
        $currentTotalCount = Client::where('account_id', $accountId)->count();

        // Total de clients à la fin de l'année dernière (avant le 1er janvier de cette année)
        $lastYearTotalCount = Client::where('account_id', $accountId)
            ->where('created_at', '<', Carbon::create($currentYear, 1, 1))
            ->count();

        // Nouveaux clients créés cette année
        $newClientsThisYear = Client::where('account_id', $accountId)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Calcul du pourcentage d'évolution
        $percentage = $lastYearTotalCount > 0
            ? round((($currentTotalCount - $lastYearTotalCount) / $lastYearTotalCount) * 100, 1)
            : ($currentTotalCount > 0 ? $currentTotalCount * 100 : 0);

        return [
            'total' => $currentTotalCount,
            'current_year' => $newClientsThisYear,
            'last_year' => $lastYearTotalCount,
            'percentage' => $percentage,
        ];
    }

    private function getProjectsData($accountId, $currentYear, $lastYear)
    {
        // Total actuel de projets
        $currentTotalCount = Project::whereHas('client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })->count();

        // Total de projets à la fin de l'année dernière (avant le 1er janvier de cette année)
        $lastYearTotalCount = Project::whereHas('client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })->where('created_at', '<', Carbon::create($currentYear, 1, 1))->count();

        // Nouveaux projets créés cette année
        $newProjectsThisYear = Project::whereHas('client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })->whereYear('created_at', $currentYear)->count();

        // Calcul du pourcentage d'évolution
        $percentage = $lastYearTotalCount > 0
            ? round((($currentTotalCount - $lastYearTotalCount) / $lastYearTotalCount) * 100, 1)
            : ($currentTotalCount > 0 ? $currentTotalCount * 100 : 0);

        return [
            'total' => $currentTotalCount,
            'current_year' => $newProjectsThisYear,
            'last_year' => $lastYearTotalCount,
            'percentage' => $percentage,
        ];
    }

    private function getRevenueData($accountId)
    {
        // CA actuel (factures payées - status = 3)
        $paidInvoices = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })->where('status', 3)->get();

        $currentRevenue = $paidInvoices->sum('total');

        // CA max (objectif)
        $account = Account::find($accountId);
        $maxRevenue = $account ? $account->max_annual_revenue : 0;

        // Restant à faire
        $remaining = $maxRevenue - $currentRevenue;

        return [
            'current' => $currentRevenue,
            'target' => $maxRevenue,
            'remaining' => $remaining,
            'target_reached' => $remaining <= 0,
        ];
    }

    private function getPendingPayments($accountId)
    {
        // Factures envoyées non payées (status = 2)
        $pendingInvoices = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })->where('status', 2)->get();

        return $pendingInvoices->sum('total');
    }

    private function getDraftInvoices($accountId)
    {
        // Factures éditées non envoyées (status = 1)
        $draftInvoices = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })->where('status', 1)->get();

        return $draftInvoices->sum('total');
    }

    private function getQuarterDates($quarter)
    {
        $now = Carbon::now();

        switch ($quarter) {
            case 'previous':
                $start = $now->copy()->subMonths(3)->firstOfQuarter();
                $end = $now->copy()->subMonths(3)->lastOfQuarter();
                break;
            case 'next':
                $start = $now->copy()->addMonths(3)->firstOfQuarter();
                $end = $now->copy()->addMonths(3)->lastOfQuarter();
                break;
            default: // current
                $start = $now->copy()->firstOfQuarter();
                $end = $now->copy()->lastOfQuarter();
                break;
        }

        return [
            'start' => $start->format('Y-m-d'),
            'end' => $end->format('Y-m-d'),
            'start_formatted' => $start->format('j F Y'),
            'end_formatted' => $end->format('j F Y'),
            'quarter' => $quarter,
        ];
    }

    private function getQuarterPaidRevenue($accountId, $start, $end)
    {
        $quarterPaidInvoices = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })
            ->where('status', 3)
            ->whereBetween('actual_payment_date', [$start, $end])
            ->get();

        return $quarterPaidInvoices->sum('total');
    }

    private function getQuarterEstimatedRevenue($accountId, $start, $end)
    {
        $quarterEstimatedInvoices = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })
            ->whereIn('status', [1, 2]) // Éditées et envoyées
            ->whereBetween('payment_due_date', [$start, $end])
            ->get();

        return $quarterEstimatedInvoices->sum('total');
    }

    private function getQuarterExpensesToPay($accountId, $start, $end)
    {
        $account = Account::find($accountId);
        $expenseRate = $account ? $account->expense_rate / 100 : 0;

        $revenue = $this->getQuarterPaidRevenue($accountId, $start, $end);

        return $revenue * $expenseRate;
    }

    private function getQuarterEstimatedExpenses($accountId, $start, $end)
    {
        $account = Account::find($accountId);
        $expenseRate = $account ? $account->expense_rate / 100 : 0;

        $estimatedRevenue = $this->getQuarterEstimatedRevenue($accountId, $start, $end);

        return $estimatedRevenue * $expenseRate;
    }

    private function getMonthlyRevenue($accountId, $year)
    {
        $monthlyData = [];

        for ($month = 1; $month <= 12; $month++) {
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            $monthRevenue = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
                $query->where('account_id', $accountId);
            })
                ->where('status', 3) // Factures payées
                ->whereBetween('actual_payment_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                ->get()
                ->sum('total');

            $monthlyData[] = [
                'month' => $month,
                'month_name' => $startDate->format('F'),
                'month_short' => $startDate->format('M'),
                'revenue' => $monthRevenue,
            ];
        }

        return $monthlyData;
    }

    private function getCumulativeRevenue($accountId, $year)
    {
        $cumulativeData = [];
        $runningTotal = 0;

        for ($month = 1; $month <= 12; $month++) {
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            $monthRevenue = Invoice::with('invoiceLines')->whereHas('project.client', function ($query) use ($accountId) {
                $query->where('account_id', $accountId);
            })
                ->where('status', 3) // Factures payées
                ->whereBetween('actual_payment_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                ->get()
                ->sum('total');

            $runningTotal += $monthRevenue;

            $cumulativeData[] = [
                'month' => $month,
                'month_name' => $startDate->format('F'),
                'month_short' => $startDate->format('M'),
                'cumulative_revenue' => $runningTotal,
            ];
        }

        return $cumulativeData;
    }

    private function getAvailableYears($accountId)
    {
        // Récupérer la première facture payée pour cet account
        $firstPaidInvoice = Invoice::whereHas('project.client', function ($query) use ($accountId) {
            $query->where('account_id', $accountId);
        })
            ->where('status', 3)
            ->whereNotNull('actual_payment_date')
            ->orderBy('actual_payment_date', 'asc')
            ->first();

        if (!$firstPaidInvoice) {
            return [Carbon::now()->year]; // Seulement l'année actuelle si pas de factures
        }

        $firstYear = Carbon::parse($firstPaidInvoice->actual_payment_date)->year;
        $currentYear = Carbon::now()->year;

        $years = [];
        for ($year = $firstYear; $year <= $currentYear; $year++) {
            $years[] = $year;
        }

        return $years;
    }
}
