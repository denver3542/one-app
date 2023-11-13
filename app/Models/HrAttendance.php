<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrAttendance extends Model
{
    use HasFactory;

    protected  $table = 'hr_attendance';

    protected $primaryKey = 'attendance_id';

    protected $fillable = [
        'emp_id',
        'time_in',
        'time_out',
        'is_deleted'
    ];
}