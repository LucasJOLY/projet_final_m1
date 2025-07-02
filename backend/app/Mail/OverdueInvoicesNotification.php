<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Account;
use Illuminate\Database\Eloquent\Collection;

class OverdueInvoicesNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Account $account;
    public Collection $overdueInvoices;
    public string $frontendUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Account $account, Collection $overdueInvoices)
    {
        $this->account = $account;
        $this->overdueInvoices = $overdueInvoices;
        $this->frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Rappel : Factures en retard de paiement',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.overdue-invoices',
            with: [
                'account' => $this->account,
                'overdueInvoices' => $this->overdueInvoices,
                'frontendUrl' => $this->frontendUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
