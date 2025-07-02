<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Account;
use App\Models\Invoice;
use App\Mail\OverdueInvoicesNotification;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendOverdueInvoicesNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:send-overdue-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoie par email la liste des factures en retard à chaque compte';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Début de l\'envoi des notifications de factures en retard...');

        // Récupérer tous les comptes
        $accounts = Account::all();
        $totalNotificationsSent = 0;

        foreach ($accounts as $account) {
            // Récupérer les factures en retard pour ce compte
            $overdueInvoices = Invoice::with(['invoiceLines', 'project.client'])
                ->whereHas('project.client', function ($q) use ($account) {
                    $q->where('account_id', $account->id);
                })
                ->where('status', 2) // Statut "envoyée"
                ->where('payment_due_date', '<', Carbon::now()->toDateString())
                ->get();

            // Si il y a des factures en retard, envoyer l'email
            if ($overdueInvoices->count() > 0) {
                try {
                    Mail::to($account->email)
                        ->send(new OverdueInvoicesNotification($account, $overdueInvoices));

                    $this->info("Notification envoyée à {$account->email} ({$overdueInvoices->count()} factures en retard)");
                    $totalNotificationsSent++;
                } catch (\Exception $e) {
                    $this->error("Erreur lors de l'envoi à {$account->email}: " . $e->getMessage());
                }
            } else {
                $this->info("Aucune facture en retard pour {$account->email}");
            }
        }

        $this->info("Fin de l'envoi des notifications. Total: {$totalNotificationsSent} notifications envoyées.");

        return Command::SUCCESS;
    }
}
