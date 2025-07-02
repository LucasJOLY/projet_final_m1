<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('invoice_number');
            $table->tinyInteger('status')->default(0)->comment('0 = en cours de création, 1 = édité, 2 = envoyé, 3 = payé');
            $table->date('issue_date');
            $table->date('payment_due_date');
            $table->enum('payment_type', ['bank_transfer', 'check', 'paypal', 'other'])->default('bank_transfer');
            $table->date('actual_payment_date')->nullable();
            $table->text('footer_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
