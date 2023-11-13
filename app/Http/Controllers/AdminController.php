<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function emails()
    {
        $emails = DB::table('tbl_list_email')->get();

        return response()->json($emails);
    }

    public function logs()
    {
        $logs = DB::table('tbl_users_log')->orderByDesc('date')->limit(500)->get();

        foreach ($logs as $key => $log) {
            $log->user = User::select('fname', 'mname', 'lname','email')->find($log->user_id);
        }

        return response()->json($logs);
    }
}