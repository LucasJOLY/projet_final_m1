<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'is_company',
        'name',
        'contact_name',
        'contact_first_name',
        'address',
        'city',
        'phone',
        'email',
    ];

    protected $casts = [
        'is_company' => 'boolean',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
