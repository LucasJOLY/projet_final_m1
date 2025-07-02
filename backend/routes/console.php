<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Planification de l'envoi des notifications de factures en retard
Schedule::command('invoices:send-overdue-notifications')
    ->dailyAt('10:00')
    ->timezone('Europe/Paris');
