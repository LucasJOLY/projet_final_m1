<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    use HasFactory;
    protected $fillable = [
        'project_id',
        'quote_number',
        'status',
        'issue_date',
        'expiry_date',
        'note',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'status' => 'integer',
    ];

    protected $appends = ['total'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function quoteLines(): HasMany
    {
        return $this->hasMany(QuoteLine::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->quoteLines->sum(function ($line) {
            return $line->unit_price * $line->quantity;
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quote) {
            if (!$quote->expiry_date) {
                $quote->expiry_date = now()->addDays(30);
            }
        });
    }
}
