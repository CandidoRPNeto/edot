<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Invite extends Model
{
    use HasUuids;

    protected $fillable = [
        'store_id',
        'dealer_id',
        'accepted',
    ];
}
