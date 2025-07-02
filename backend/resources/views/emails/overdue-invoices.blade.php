<x-mail::message>
    # Rappel : Factures en retard de paiement

    Bonjour {{ $account->first_name }} {{ $account->name }},

    Nous vous informons que vous avez **{{ $overdueInvoices->count() }}** facture(s) en retard de paiement.

    Voici le détail de vos factures en retard :

    @foreach($overdueInvoices as $invoice)
    <x-mail::panel>
        **Facture n° {{ $invoice->invoice_number }}**

        @if($invoice->footer_note)
        **Note :** {{ $invoice->footer_note }}
        @endif

        **Montant total :** {{ number_format($invoice->total, 2, ',', ' ') }} €

        **Date d'échéance :** {{ \Carbon\Carbon::parse($invoice->payment_due_date)->locale('fr')->isoFormat('dddd D MMMM YYYY') }}

        <x-mail::button :url="$frontendUrl . '/invoices/' . $invoice->id" color="primary">
            Voir la facture
        </x-mail::button>
    </x-mail::panel>
    @endforeach


    Cordialement,<br>
</x-mail::message>