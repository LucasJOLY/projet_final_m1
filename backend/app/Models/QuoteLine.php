<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'description',
        'unit_price',
        'quantity',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    protected $appends = ['total'];

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->unit_price * $this->quantity;
    }
}
