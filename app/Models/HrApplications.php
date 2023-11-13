<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrApplications extends Model
{
    use HasFactory;
    protected  $table = 'hr_applications';

    protected $primaryKey = 'application+_id';

    protected $fillable = [
        'emp_id',
        'time_in',
        'time_out',
        'is_deleted'
    ];
}
