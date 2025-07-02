<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'invoice_number',
        'status',
        'issue_date',
        'payment_due_date',
        'payment_type',
        'actual_payment_date',
        'footer_note',
    ];
    protected $appends = ['total'];


    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function invoiceLines()
    {
        return $this->hasMany(InvoiceLine::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->invoiceLines->sum(function ($line) {
            return $line->unit_price * $line->quantity;
        });
    }
}
