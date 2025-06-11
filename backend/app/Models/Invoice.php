<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'invoice_number',
        'status',
        'issue_date',
        'payment_due_date',
        'payment_type',
        'actual_payment_date',
        'footer_note',
    ];


    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceLine::class);
    }
}
