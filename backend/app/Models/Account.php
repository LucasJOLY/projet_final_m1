<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Account extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'first_name',
        'birth_date',
        'address',
        'email',
        'phone',
        'max_annual_revenue',
        'expense_rate',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}
