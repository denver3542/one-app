<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrStatus extends Model
{
    use HasFactory;

    protected  $table = 'hr_status';

    protected $primaryKey = 'status_id';

    protected $fillable = [
        'status_name',
        'is_deleted'
    ];
}