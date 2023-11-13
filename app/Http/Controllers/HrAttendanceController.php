<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HrAttendance;
use Carbon\Carbon;
use DateTime;
use Exception;
use Illuminate\Support\Facades\DB;

function computeMinutes($min)
{
    $h = floor($min / 60);
    $m = $min - ($h * 60);
    return  $h . 'hrs' . ' ' . $m . 'min';
}

function computeDay($min)
{
    $h = floor($min / 60);
    return  $h . 'hrs';
}
class HrAttendanceController extends Controller
{

    public function getAllAttendance(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|max:255',
            'year' => 'required|max:255'
        ]);
        $dateTodays = date('d');
        
        $workdaysCount = DB::table('hr_workdays')
            ->select(DB::raw("*"))
            ->where('type', '=', 1)
            ->whereRaw('MONTH(start_date) = ?', [$validated['month']])
            ->whereRaw('YEAR(start_date) = ?', [$validated['year']])
            ->orderBy('start_date', 'ASC')
            ->get();
        $users = DB::table('user')
            ->select(DB::raw("
        user.user_id,
        user.fname,
        user.mname,
        user.lname,
        user.profile_pic,
        user.department,
        user.work_days,
        user.user_type,
        user.category"))
            ->where('is_deleted', '=', 0)
            ->get();


        $totalAttendance = array();
        foreach ($users as $user) {
            $computeTardiness = 0;
            $tardiness = 0;
            $sumduty = 0;
            $attendance_id = '';
            $morningRecords = 0;
            $countDutyDays = 0;
            $afternoonRecords = 0;
            $timeDiff = array();
            $countAbsences = 0;
            $halfdayMinutes = 0;
            $dutyHours = DB::table('hr_attendance')
                ->select(DB::raw("
                    start_date,
                    attdn_id,
                    user_id,
                    morning_in,
                    morning_out,
                    afternoon_in,
                    afternoon_out"))
                ->where('user_id', '=', $user->user_id)
                ->where('type', '!=', 5)
                ->whereRaw('MONTH(start_date) = ?', [$validated['month']])
                ->whereRaw('YEAR(start_date) = ?', [$validated['year']])
                ->orderBy('start_date', 'ASC')
                ->get();

            if (!empty($dutyHours)) {
                foreach ($dutyHours as $res) {
                    $attendance_id = $res->attdn_id;
                    $morningDutyTime = date('Y-m-d H:i:s', strtotime('today 8am'));
                    $morning_in = date("H:i:s", strtotime($res->morning_in));
                    $morning_out = date("H:i:s", strtotime($res->morning_out));
                    $morning_duty = Carbon::parse($morningDutyTime);
                    $morning_start = Carbon::parse($morning_in);

                    if ($res->morning_in != null || $res->morning_out != null) {
                        $morning_minutes = $morning_start->diffInMinutes($morning_duty); // 226
                        $halfdayMinutes += 240;
                    } else {
                        $morning_minutes = 240;
                        $halfdayMinutes += 240;
                        $countAbsences += 240;
                    }

                    $morningRecords += $morning_minutes;
                    $afternoonDutyTime = date('Y-m-d H:i:s', strtotime('today 1pm'));
                    $afternoon_in = date("H:i:s", strtotime($res->afternoon_in));
                    $afternoon_out = date("H:i:s", strtotime($res->afternoon_out));
                    $afternoon_duty = Carbon::parse($afternoonDutyTime);
                    $afternoon_start = Carbon::parse($afternoon_in);

                    if ($res->afternoon_in != null || $res->afternoon_out != null) {
                        $afternoon_minutes = $afternoon_start->diffInMinutes($afternoon_duty); // 226
                        $halfdayMinutes += 240;
                    } else {
                        $afternoon_minutes = 240;
                        $halfdayMinutes += 240;
                        $countAbsences += 240;
                    }

                    $afternoonRecords += $afternoon_minutes;
                    $minutes =  $morning_minutes + $afternoon_minutes;
                    $timeDiff[] = number_format($minutes / 60, 2);

                    if ($morning_start > $morning_duty) {
                        if ($morning_minutes != null && $morning_minutes < 240) {
                            $computeTardiness +=  $morning_minutes;
                            $tardiness = computeMinutes($computeTardiness);
                        }
                    }
                    if ($afternoon_start > $afternoon_duty) {
                        if ($afternoon_minutes != null && $afternoon_minutes < 240) {
                            $computeTardiness +=  $afternoon_minutes;
                            $tardiness = computeMinutes($computeTardiness);
                        }
                    }
                    $countDutyDays++;
                }
                $sumduty += $halfdayMinutes;
                $total_dutyhours = computeDay($sumduty);

                $totalComputeDays = count($workdaysCount) - $countDutyDays;
                $absenceMinute =  $totalComputeDays * 480 ;


                $computeTotalhrs =  ($sumduty - $computeTardiness) > ($absenceMinute + $countAbsences) ? ($sumduty - $computeTardiness) - ($absenceMinute + $countAbsences) : ($absenceMinute + $countAbsences) - ($sumduty - $computeTardiness);
                $totalhrs = computeMinutes($computeTotalhrs);

                $attendance_details = array('user_type' => $user->user_type, 'attdn_id' => $attendance_id, 'user_id' => $user->user_id, 'fname' => $user->fname, 'mname' => $user->mname, 'lname' => $user->lname, 'profile_pic' => $user->profile_pic, 'department' => $user->department, 'category' => $user->category, 'dutyHours' => $total_dutyhours, 'tardiness' => $tardiness, 'absences' => computeDay($absenceMinute + $countAbsences), 'totalHours' => $totalhrs, 'attendances' => $dutyHours,'MonthVal' => $validated['month'], 'YearVal' => $validated['year'], 'dutydays' => $countDutyDays);
                if ($timeDiff) {
                    array_push($totalAttendance, $attendance_details);
                }
            } else {
                array_push($totalAttendance, ['user_type' => '','attdn_id' => '','user_id' => '', 'fname' => '', 'mname' => '', 'lname' => '', 'profile_pic' => '', 'department' => '', 'category' => '', 'dutyHours' => '', 'tardiness' => '', 'absences' => '', 'totalHours' => '','attendances' => '']);
            }

            // // if(strpos(implode(",", $computeTardiness), '.') !== false){
            // //     // $number_formattardiness = number_format($computeTardiness, 2);
            // //     $split_tardiness = explode('.' , implode(".", $computeTardiness));
            // //     // // $result_tardiness =  $split_tardiness[0] . 'hrs ' . $split_tardiness[1] . 'min ';
            // // }else{
            // //     $result_tardiness =  $computeTardiness;
            // // }

        }

        return response()->json([
            'status' => 200,
            'attendance' => $totalAttendance,
            'test' => count($workdaysCount)
        ]);
    }

    public function getModalAttendanceView($data){
        $recordsDate = explode(",", $data);
        $month_val = $recordsDate[0];
        $year_val = $recordsDate[1];
        $user_id = $recordsDate[2];


        $all_attendance = DB::table('hr_attendance')
        ->select(DB::raw("
            start_date,
            attdn_id,
            user_id,
            morning_in,
            morning_out,
            afternoon_in,
            afternoon_out"))
        ->where('user_id', '=', $user_id)
        ->where('type', '!=', 5)
        ->whereRaw('MONTH(start_date) = ?', [$month_val])
        ->whereRaw('YEAR(start_date) = ?', [$year_val])
        ->orderBy('start_date', 'ASC')
        ->get();

        return response()->json([
            'status' => 200,
            'attendanceData' => $all_attendance ?? []
        ]);

    }
    public function addAttendance(Request $request)
    {
        $attendance = new HrAttendance();

        $attendance->emp_id = $request->input('emp_id');
        $attendance->time_in = $request->input('time_in');
        $attendance->time_out = $request->input('time_out');
        $attendance->attdn_date = $request->input('attdn_date');
        $attendance->save();

        return response()->json([
            'status' => 200,
            'message' => 'Attendance Added Successfully'
        ]);
    }

    public function getWorkdayID(Request $request)
    {
        $data = $request->validate([
            'startDate' => 'required'
        ]);

        $workdayData = DB::table('hr_workdays')
            ->select(DB::raw("
            workday_id"))
            ->where('start_date', '=', $data['startDate'])
            ->get();
        $workday_id = '';

        foreach ($workdayData as $wrkID) {
            $workday_id = $wrkID->workday_id;
        }

        return response()->json([
            'status' => 200,
            'message' => $workday_id
        ]);
    }

    public function updateHrAttendance(Request $request)
    {
        $data = $request->validate([
            'morning_in' => 'nullable',
            'morning_out' => 'nullable',
            'afternoon_in' => 'nullable',
            'afternoon_out' => 'nullable',
            'start_date' => 'required',
            'end_date' => 'required',
            'type' => 'required',
            'user_id' => 'required',
            'status' => 'required',
            'workday_id' => 'required'
        ]);
        $attdn_data = $request->validate([
            'allattendance' => 'nullable|array',
        ]);

        $verifyData = $attdn_data['allattendance'];
        $start_val = array();
        $attendance_id = 0;
        $old_morning_in = '';
        $old_morning_out = '';
        $old_afternoon_in = '';
        $old_afternoon_out = '';
        $start_data = $data['start_date'];
        foreach ($verifyData as $verify) {
            $start_val[] = $verify['start_date'];
            if ($start_data === $verify['start_date']) {
                $attendance_id = $verify['attdn_id'];
                $old_morning_in = $verify['morning_in'];
                $old_morning_out = $verify['morning_out'];
                $old_afternoon_in = $verify['afternoon_in'];
                $old_afternoon_out = $verify['afternoon_out'];
            }
        }
        if (in_array($start_data, $start_val) === true) {
            $updateAttendance = DB::table('hr_attendance')->where('attdn_id', '=', $attendance_id)->update([
                'morning_in' => $data['morning_in'] ? $data['morning_in'] : $old_morning_in,
                'morning_out' => $data['morning_out'] ? $data['morning_out'] : $old_morning_out,
                'afternoon_in' => $data['afternoon_in'] ? $data['afternoon_in'] : $old_afternoon_in,
                'afternoon_out' => $data['afternoon_out'] ? $data['afternoon_out'] : $old_afternoon_out,
            ]);
            if ($updateAttendance) {
                $message = 'Updated Attendance';
            } else {
                $message = 'Fail to update';
            }
        } else {
            $addAttendance = DB::table('hr_attendance')->insert($data);
            if ($addAttendance) {
                $message = 'Added Attendnace';
            } else {
                $message = 'Fail to add';
            }
        }
        return response()->json([
            'status' => 200,
            'message' =>  $message
        ]);
    }
    public function deleteAttendance(Request $request){
        $attdn_id = $request->validate([
            'attdn_id' => 'required',
        ]);
        
        $delete_attendance = DB::table('hr_attendance')->where('attdn_id', $attdn_id['attdn_id'])->delete();
        if ($delete_attendance) {
            $message = 'Success';
        } else {
            $message = 'Fail';
        }

        return response()->json([
            'status' => 200,
            'message' =>  $message
        ]);

    }
}
