<?php

namespace App\Http\Controllers;

use App\Models\HrStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HrStatusController extends Controller
{
    public function getStatus()
    {
        $status = HrStatus::where("is_deleted", "!=", "1")->orderBy('status_name', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'status' => $status
        ]);
    }


    public function addStatus(Request $request)
    {
        $status = new HrStatus();
        $status->status_name = $request->input('status_name');
        $status->save();

        return response()->json([
            `status` => 200,
            `message` => 'Status Added Successfully'
        ]);
    }

    public function addWorkDays(Request $request)
    {
        try {
            $userDetails = request()->all();
            $workDays = $userDetails['work_days'];

            $daily = User::where("is_deleted", "!=", "1")->get();
            $user_id = [];
            $hourly_rate = [];
            $daily_rate = [];
            foreach ($daily as $val) {
                $user_id[] = $val->user_id;
                $hourly_rate[] = $val->hourly_rate;
                $daily_rate[] = $val->daily_rate;
            }
            $count = 0;
            foreach ($daily_rate as $drate) {
                if ($drate != null) {
                    $totalMonthly = $drate *= $workDays;
                    User::where([["is_deleted", 0], ["user_id", $user_id[$count]]])->update(['work_days' => $workDays, 'monthly_rate' => $totalMonthly]);
                } else {
                    User::where("is_deleted", 0)->update(['work_days' => $workDays]);
                }
                $count++;
            }



            return response()->json([
                `status` => 200,
                `message` => 'Workdays Added Successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                `message` => $e
            ]);
        };
    }


    public function deleteStatus($id)
    {

        $deleteStatus = HrStatus::find($id);

        if ($deleteStatus) {
            $deleteStatus->delete($id);
            return response()->json([
                `status` => 200,
                `message` => 'Status has been removed'
            ]);
        } else {
            return response()->json([
                `message` => 'Error'
            ], 404);
        }
    }
}