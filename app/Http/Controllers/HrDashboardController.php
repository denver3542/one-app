<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HrDashboardController extends Controller
{
    public function getEmployees($dateToday)
    {

        $users = DB::table('user')
            ->select(DB::raw("
            user.user_id,
            user.fname,
            user.mname,
            user.lname,
            user.profile_pic,
            user.department,
            user.user_type,
            user.hourly_rate,
            user.daily_rate,
            user.monthly_rate,
            user.work_days,
            user.category"))
            ->where('user_id', '!=', 243)
            ->where('user_id', '!=', 239)
            ->where('user_id', '!=', 1)
            ->where('user_id', '!=', 244)
            ->where('user_id', '!=', 251)
            ->where('is_deleted', '!=', 1)
            ->get();

        $totalPresent = array();
        $totalAbsent = 0;
        $listOfUsers = array();
        foreach ($users as $user) {
            $listOfUsers[] = $user->user_id;
            $attendanceList = DB::table('hr_attendance')
                ->select(DB::raw("*"))
                ->where('start_date', $dateToday)
                ->where('type', '!=', 5)
                ->get();

            foreach ($attendanceList as $attendance) {
                if ($attendance->user_id === $user->user_id) {
                    $totalPresent[] = $attendance->user_id;
                }
            }
        }
        $totalAbsent = count($listOfUsers) - count($totalPresent);

        return response()->json([
            'status' => 200,
            'present' => count($totalPresent),
            'absent' => $totalAbsent

        ]);
    }

    public function getAttendances($dateToday)
    {
        $attendanceData = array();
        $attendanceList = DB::table('hr_attendance')
            ->select(DB::raw("*"))
            ->join('user', 'hr_attendance.user_id', '=', 'user.user_id')
            ->where('type', '!=', 5)
            ->where('start_date', $dateToday)
            ->orderBy('start_date', 'desc')
            ->get();

        foreach ($attendanceList as $attendance) {
            $attendanceData[] = $attendance;
        }


        return response()->json([
            'status' => 200,
            'attendances' => $attendanceData

        ]);
    }

    public function getApplications($dateToday)
    {
        $day = date("d");
        $month = date("m");
        $year = date("Y");
        $applicationData = array();
        $applicationList = DB::table('hr_applications')
            ->select(DB::raw("*"), 'hr_workdays.status as AppStatus', 'hr_workdays.color as AppColor')
            ->join('hr_workdays', 'hr_applications.application_id', '=', 'hr_workdays.application_id')
            ->join('user', 'hr_applications.user_id', '=', 'user.user_id')
            ->whereRaw('DAY(created_at) = ?', [$day])
            ->whereRaw('MONTH(created_at) = ?', [$month])
            ->whereRaw('YEAR(created_at) = ?', [$year])
            ->orderBy('date_from', 'desc')
            ->get();

        foreach ($applicationList as $application) {
            $applicationData[] = $application;
        }


        return response()->json([
            'status' => 200,
            'applications' => $applicationData
        ]);
    }
    public function getAnalytics($date)
    {
        $string_parts = explode(",", $date);
        $month = $string_parts[0];
        $year = $string_parts[1];


        $users = DB::table('user')
            ->select(DB::raw("
            user.user_id,
            user.fname,
            user.mname,
            user.lname,
            user.profile_pic,
            user.department,
            user.user_type,
            user.hourly_rate,
            user.daily_rate,
            user.monthly_rate,
            user.work_days,
            user.category"))
            ->where('user_id', '!=', 243)
            ->where('user_id', '!=', 239)
            ->where('user_id', '!=', 1)
            ->where('user_id', '!=', 244)
            ->where('user_id', '!=', 251)
            ->where('is_deleted', '!=', 1)
            ->get();
        $months = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
        $all_months = array(
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July ',
            'August',
            'September',
            'October',
            'November',
            'December',
        );
        $current = date('F');
        $month_val = array_search($current, $all_months);

        // Get Application Chart 
            $applications = 1;
            $application_january = 0;
            $application_february = 0;
            $application_march = 0;
            $application_april = 0;
            $application_may = 0;
            $application_june = 0;
            $application_july = 0;
            $application_august = 0;
            $application_september = 0;
            $application_october = 0;
            $application_november = 0;
            $application_december = 0;
            $totalApplications = array();

                    $applicationList = DB::table('hr_applications')
                        ->selectRaw('user_id,date_to')
                        ->whereRaw('MONTH(date_to) <= ?', [$month])
                        ->whereRaw('YEAR(date_to) = ?', [$year])
                        ->orderBy('date_to', 'ASC')
                        ->get();

                    foreach ($applicationList as $application) {
                        if ($application->date_to != null) {
                            $formattedStartdate = date("m", strtotime($application->date_to));
                            $application_january += $formattedStartdate === '01' ? 1 : 0;
                            $application_february += $formattedStartdate === '02' ? 1 : 0;
                            $application_march += $formattedStartdate === '03' ? 1 : 0;
                            $application_april += $formattedStartdate === '04' ? 1 : 0;
                            $application_may += $formattedStartdate === '05' ? 1 : 0;
                            $application_june += $formattedStartdate === '06' ? 1 : 0;
                            $application_july += $formattedStartdate === '07' ? 1 : 0;
                            $application_august += $formattedStartdate === '08' ? 1 : 0;
                            $application_september += $formattedStartdate === '09' ? 1 : 0;
                            $application_october += $formattedStartdate === '10' ? 1 : 0;
                            $application_november += $formattedStartdate === '11' ? 1 : 0;
                            $application_december += $formattedStartdate === '12' ? 1 : 0;
                        }
                    }
          
                $totalApplications[] = [
                    'January' => $application_january,
                    'February' => $application_february,
                    'March' => $application_march,
                    'April' => $application_april,
                    'May' => $application_may,
                    'June' => $application_june,
                    'July' => $application_july,
                    'August' => $application_august,
                    'September' => $application_september,
                    'October' => $application_october,
                    'November' => $application_november,
                    'December' => $application_december
                ];
        // END

        // Get Workdays Chart
            $workdays_january = 0;
            $workdays_february = 0;
            $workdays_march = 0;
            $workdays_april = 0;
            $workdays_may = 0;
            $workdays_june = 0;
            $workdays_july = 0;
            $workdays_august = 0;
            $workdays_september = 0;
            $workdays_october = 0;
            $workdays_november = 0;
            $workdays_december = 0;
            $totalWorkdays = array();

                    $workdayList = DB::table('hr_workdays')
                        ->selectRaw('start_date')
                        ->where('type', '=', 1)
                        ->whereRaw('MONTH(start_date) <= ?', [$month])
                        ->whereRaw('YEAR(start_date) = ?', [$year])
                        ->orderBy('start_date', 'ASC')
                        ->get();

                    foreach ($workdayList as $workday) {
                        $formattedStartdate = date("m", strtotime($workday->start_date));
                        $workdays_january += $formattedStartdate === '01' ? 1 : 0;
                        $workdays_february += $formattedStartdate === '02' ? 1 : 0;
                        $workdays_march += $formattedStartdate === '03' ? 1 : 0;
                        $workdays_april += $formattedStartdate === '04' ? 1 : 0;
                        $workdays_may += $formattedStartdate === '05' ? 1 : 0;
                        $workdays_june += $formattedStartdate === '06' ? 1 : 0;
                        $workdays_july += $formattedStartdate === '07' ? 1 : 0;
                        $workdays_august += $formattedStartdate === '08' ? 1 : 0;
                        $workdays_september += $formattedStartdate === '09' ? 1 : 0;
                        $workdays_october += $formattedStartdate === '10' ? 1 : 0;
                        $workdays_november += $formattedStartdate === '11' ? 1 : 0;
                        $workdays_december += $formattedStartdate === '12' ? 1 : 0;
                    }

            if ($year === date('Y')) {
                // $num_days = cal_days_in_month(CAL_GREGORIAN,05,$year)
                $totalWorkdays[] = [
                    'January' => $workdays_january,
                    'February' =>$workdays_february,
                    'March' => $workdays_march,
                    'April' => $workdays_april,
                    'May' => $workdays_may,
                    'June' =>  $workdays_june,
                    'July' =>  $workdays_july,
                    'August' => $workdays_august,
                    'September' => $workdays_september,
                    'October' =>  $workdays_october,
                    'November' => $workdays_november,
                    'December' =>  $workdays_december
                ];
            } 
        // END

        // Get Absence Chart
            $totalAbsent = array();
            $attendance_january = 0;
            $attendance_february = 0;
            $attendance_march = 0;
            $attendance_april = 0;
            $attendance_may = 0;
            $attendance_june = 0;
            $attendance_july = 0;
            $attendance_august = 0;
            $attendance_september = 0;
            $attendance_october = 0;
            $attendance_november = 0;
            $attendance_december = 0;

            foreach ($users as $user) {
                    $attendanceList = DB::table('hr_attendance')
                        ->selectRaw('*, count(*) as total_present')
                        ->where('user_id', $user->user_id)
                        ->whereRaw('MONTH(start_date) <= ?', [$month])
                        ->whereRaw('YEAR(start_date) = ?', [$year])
                        ->where('type', '!=', 5)
                        ->orderBy('start_date', 'ASC')
                        ->get();
                
                    foreach ($attendanceList as $attendance) {
                        if ($attendance->start_date != null) {
                            $formattedStartdate = date("m", strtotime($attendance->start_date));
                            $attendance_january += $formattedStartdate === '01' ?  $attendance->total_present : 0;
                            $attendance_february += $formattedStartdate === '02' ? $attendance->total_present : 0;
                            $attendance_march += $formattedStartdate === '03' ?  $attendance->total_present : 0;
                            $attendance_april += $formattedStartdate === '04' ? $attendance->total_present : 0;
                            $attendance_may += $formattedStartdate === '05' ?  $attendance->total_present : 0;
                            $attendance_june += $formattedStartdate === '06' ? $attendance->total_present : 0;
                            $attendance_july += $formattedStartdate === '07' ? $attendance->total_present : 0;
                            $attendance_august += $formattedStartdate === '08' ? $attendance->total_present : 0;
                            $attendance_september += $formattedStartdate === '09' ?  $attendance->total_present : 0;
                            $attendance_october += $formattedStartdate === '10' ?  $attendance->total_present : 0;
                            $attendance_november += $formattedStartdate === '11' ?  $attendance->total_present : 0;
                            $attendance_december += $formattedStartdate === '12' ?  $attendance->total_present : 0;
                        }
                    }
            }
            // $num_days = cal_days_in_month(CAL_GREGORIAN,05,$year)
            $totalAbsent[] = [
                'January' => $attendance_january,
                'February' => $attendance_february,
                'March' => $attendance_march,
                'April' => $attendance_april,
                'May' =>  $attendance_may,
                'June' =>  $attendance_june,
                'July' =>  $attendance_july,
                'August' =>  $attendance_august,
                'September' => $attendance_september,
                'October' =>  $attendance_october,
                'November' => $attendance_november,
                'December' =>  $attendance_december 
            ];

        // END

        // Get Tardiness/Undertime Chart
            $tardiness_january = 0;
            $tardiness_february = 0;
            $tardiness_march = 0;
            $tardiness_april = 0;
            $tardiness_may = 0;
            $tardiness_june = 0;
            $tardiness_july = 0;
            $tardiness_august = 0;
            $tardiness_september = 0;
            $tardiness_october = 0;
            $tardiness_november = 0;
            $tardiness_december = 0;
            $undertime_january = 0;
            $undertime_february = 0;
            $undertime_march = 0;
            $undertime_april = 0;
            $undertime_may = 0;
            $undertime_june = 0;
            $undertime_july = 0;
            $undertime_august = 0;
            $undertime_september = 0;
            $undertime_october = 0;
            $undertime_november = 0;
            $undertime_december = 0;
            $morning_minutes = 0;
            $afternoon_minutes = 0;
            $undertimeMorning = 0;
            $totalTardiness = array();
            $totalUndertime = array();
            $testArray = array();
            foreach ($users as $user) {
                if ($month != 0) {
                    for ($i = 0; $i < $month_val; $i++) {
                        $tardinessList = DB::table('hr_attendance')
                            ->select(DB::raw('*'))
                            ->where('user_id', $user->user_id)
                            ->where('type', '!=', 5)
                            ->whereRaw('MONTH(start_date) <= ?', [$month])
                            ->whereRaw('YEAR(start_date) = ?', [$year])
                            ->get();

                        foreach ($tardinessList as $tardiness) {
                            $morningDutyTime = date('Y-m-d H:i:s', strtotime('today 8am'));
                            $morningDutyTime_out = date('Y-m-d H:i:s', strtotime('today 12pm'));
                            $morning_duty = Carbon::parse($morningDutyTime);
                            $morning_duty_out = Carbon::parse($morningDutyTime_out);
                            $morning_in = date("H:i:s", strtotime($tardiness->morning_in));
                            $morning_out = date("H:i:s", strtotime($tardiness->morning_out));
                            $morning_start = Carbon::parse($morning_in);
                            $morning_end = Carbon::parse($morning_out);

                            $afternoonDutyTime = date('Y-m-d H:i:s', strtotime('today 1pm'));
                            $afternoonDutyTime_out = date('Y-m-d H:i:s', strtotime('today 5pm'));
                            $afternoon_in = date("H:i:s", strtotime($tardiness->afternoon_in));
                            $afternoon_out = date("H:i:s", strtotime($tardiness->afternoon_out));
                            $afternoon_duty = Carbon::parse($afternoonDutyTime);
                            $afternoon_start = Carbon::parse($afternoon_in);
                            $afternoon_end = Carbon::parse($afternoon_out);


                            if ($morning_start > $morning_duty && $tardiness->morning_in != null && $tardiness->morning_out != null) {
                                $formattedStartdate = date("m", strtotime($tardiness->start_date));
                                $morning_minutes = $morning_start->diffInMinutes($morning_duty); // 226
                                if ($morning_minutes) {
                                    $tardiness_january += $formattedStartdate === '01' ?  $morning_minutes : 0;
                                    $tardiness_february += $formattedStartdate === '02' ?  $morning_minutes : 0;
                                    $tardiness_march += $formattedStartdate === '03' ?  $morning_minutes : 0;
                                    $tardiness_april += $formattedStartdate === '04' ?  $morning_minutes : 0;
                                    $tardiness_may += $formattedStartdate === '05' ?  $morning_minutes : 0;
                                    $tardiness_june += $formattedStartdate === '06' ?  $morning_minutes : 0;
                                    $tardiness_july += $formattedStartdate === '07' ?  $morning_minutes : 0;
                                    $tardiness_august += $formattedStartdate === '08' ?  $morning_minutes : 0;
                                    $tardiness_september += $formattedStartdate === '09' ?  $morning_minutes : 0;
                                    $tardiness_october += $formattedStartdate === '10' ?  $morning_minutes : 0;
                                    $tardiness_november += $formattedStartdate === '11' ?  $morning_minutes : 0;
                                    $tardiness_december += $formattedStartdate === '12' ?  $morning_minutes : 0;
                                }
                            }
                            if ($morning_end < $morning_duty_out && $tardiness->morning_in != null && $tardiness->morning_out != null) {
                                $undertimeMorning = $morning_end->diffInMinutes($morning_duty_out);
                                if ($undertimeMorning) {
                                    $undertime_january += $formattedStartdate === '01' ?  $undertimeMorning : 0;
                                    $undertime_february += $formattedStartdate === '02' ?  $undertimeMorning : 0;
                                    $undertime_march += $formattedStartdate === '03' ?  $undertimeMorning : 0;
                                    $undertime_april += $formattedStartdate === '04' ?  $undertimeMorning : 0;
                                    $undertime_may += $formattedStartdate === '05' ?  $undertimeMorning : 0;
                                    $undertime_june += $formattedStartdate === '06' ?  $undertimeMorning : 0;
                                    $undertime_july += $formattedStartdate === '07' ?  $undertimeMorning : 0;
                                    $undertime_august += $formattedStartdate === '08' ?  $undertimeMorning : 0;
                                    $undertime_september += $formattedStartdate === '09' ?  $undertimeMorning : 0;
                                    $undertime_october += $formattedStartdate === '10' ?  $undertimeMorning : 0;
                                    $undertime_november += $formattedStartdate === '11' ?  $undertimeMorning : 0;
                                    $undertime_december += $formattedStartdate === '12' ?  $undertimeMorning : 0;
                                }
                            }

                            if ($afternoon_start > $afternoon_duty && $tardiness->afternoon_in != null && $tardiness->afternoon_out != null) {
                                $formattedStartdate = date("m", strtotime($tardiness->start_date));
                                $afternoon_minutes = $afternoon_start->diffInMinutes($afternoon_duty); // 226
                                if ($afternoon_minutes) {
                                    $tardiness_january += $formattedStartdate === '01' ?  $afternoon_minutes : 0;
                                    $tardiness_february += $formattedStartdate === '02' ?  $afternoon_minutes : 0;
                                    $tardiness_march += $formattedStartdate === '03' ?  $afternoon_minutes : 0;
                                    $tardiness_april += $formattedStartdate === '04' ?  $afternoon_minutes : 0;
                                    $tardiness_may += $formattedStartdate === '05' ?  $afternoon_minutes : 0;
                                    $tardiness_june += $formattedStartdate === '06' ?  $afternoon_minutes : 0;
                                    $tardiness_july += $formattedStartdate === '07' ?  $afternoon_minutes : 0;
                                    $tardiness_august += $formattedStartdate === '08' ?  $afternoon_minutes : 0;
                                    $tardiness_september += $formattedStartdate === '09' ?  $afternoon_minutes : 0;
                                    $tardiness_october += $formattedStartdate === '10' ?  $afternoon_minutes : 0;
                                    $tardiness_november += $formattedStartdate === '11' ?  $afternoon_minutes : 0;
                                    $tardiness_december += $formattedStartdate === '12' ?  $afternoon_minutes : 0;
                                }
                            }

                            if ($afternoon_end < $afternoonDutyTime_out && $tardiness->afternoon_in != null && $tardiness->afternoon_out != null) {
                                $undertimeAfternoon = $afternoon_end->diffInMinutes($afternoonDutyTime_out);
                                if ($undertimeAfternoon) {
                                    $undertime_january += $formattedStartdate === '01' ?  $undertimeAfternoon : 0;
                                    $undertime_february += $formattedStartdate === '02' ?  $undertimeAfternoon : 0;
                                    $undertime_march += $formattedStartdate === '03' ?  $undertimeAfternoon : 0;
                                    $undertime_april += $formattedStartdate === '04' ?  $undertimeAfternoon : 0;
                                    $undertime_may += $formattedStartdate === '05' ?  $undertimeAfternoon : 0;
                                    $undertime_june += $formattedStartdate === '06' ?  $undertimeAfternoon : 0;
                                    $undertime_july += $formattedStartdate === '07' ?  $undertimeAfternoon : 0;
                                    $undertime_august += $formattedStartdate === '08' ?  $undertimeAfternoon : 0;
                                    $undertime_september += $formattedStartdate === '09' ?  $undertimeAfternoon : 0;
                                    $undertime_october += $formattedStartdate === '10' ?  $undertimeAfternoon : 0;
                                    $undertime_november += $formattedStartdate === '11' ?  $undertimeAfternoon : 0;
                                    $undertime_december += $formattedStartdate === '12' ?  $undertimeAfternoon : 0;
                                }
                            }
                        }
                    }
                } else {
                    for ($i = 0; $i < $month_val; $i++) {
                        $tardinessList = DB::table('hr_attendance')
                            ->select(DB::raw('*'))
                            ->where('user_id', $user->user_id)
                            ->where('type', '!=', 5)
                            ->whereRaw('MONTH(start_date) = ?', $months[$i])
                            ->whereRaw('YEAR(start_date) = ?', [$year])
                            ->get();

                        foreach ($tardinessList as $tardiness) {
                            $morningDutyTime = date('Y-m-d H:i:s', strtotime('today 8am'));
                            $morningDutyTime_out = date('Y-m-d H:i:s', strtotime('today 12pm'));
                            $morning_duty = Carbon::parse($morningDutyTime);
                            $morning_duty_out = Carbon::parse($morningDutyTime_out);
                            $morning_in = date("H:i:s", strtotime($tardiness->morning_in));
                            $morning_out = date("H:i:s", strtotime($tardiness->morning_out));
                            $morning_start = Carbon::parse($morning_in);
                            $morning_end = Carbon::parse($morning_out);

                            $afternoonDutyTime = date('Y-m-d H:i:s', strtotime('today 1pm'));
                            $afternoonDutyTime_out = date('Y-m-d H:i:s', strtotime('today 5pm'));
                            $afternoon_in = date("H:i:s", strtotime($tardiness->afternoon_in));
                            $afternoon_out = date("H:i:s", strtotime($tardiness->afternoon_out));
                            $afternoon_duty = Carbon::parse($afternoonDutyTime);
                            $afternoon_start = Carbon::parse($afternoon_in);
                            $afternoon_end = Carbon::parse($afternoon_out);


                            if ($morning_start > $morning_duty && $tardiness->morning_in != null && $tardiness->morning_out != null) {
                                $formattedStartdate = date("m", strtotime($tardiness->start_date));
                                $morning_minutes = $morning_start->diffInMinutes($morning_duty); // 226
                                if ($morning_minutes) {
                                    $tardiness_january += $formattedStartdate === '01' ?  $morning_minutes : 0;
                                    $tardiness_february += $formattedStartdate === '02' ?  $morning_minutes : 0;
                                    $tardiness_march += $formattedStartdate === '03' ?  $morning_minutes : 0;
                                    $tardiness_april += $formattedStartdate === '04' ?  $morning_minutes : 0;
                                    $tardiness_may += $formattedStartdate === '05' ?  $morning_minutes : 0;
                                    $tardiness_june += $formattedStartdate === '06' ?  $morning_minutes : 0;
                                    $tardiness_july += $formattedStartdate === '07' ?  $morning_minutes : 0;
                                    $tardiness_august += $formattedStartdate === '08' ?  $morning_minutes : 0;
                                    $tardiness_september += $formattedStartdate === '09' ?  $morning_minutes : 0;
                                    $tardiness_october += $formattedStartdate === '10' ?  $morning_minutes : 0;
                                    $tardiness_november += $formattedStartdate === '11' ?  $morning_minutes : 0;
                                    $tardiness_december += $formattedStartdate === '12' ?  $morning_minutes : 0;
                                }
                            }
                            if ($morning_end < $morning_duty_out && $tardiness->morning_in != null && $tardiness->morning_out != null) {
                                $undertimeMorning = $morning_end->diffInMinutes($morning_duty_out);
                                if ($undertimeMorning) {
                                    $undertime_january += $formattedStartdate === '01' ?  $undertimeMorning : 0;
                                    $undertime_february += $formattedStartdate === '02' ?  $undertimeMorning : 0;
                                    $undertime_march += $formattedStartdate === '03' ?  $undertimeMorning : 0;
                                    $undertime_april += $formattedStartdate === '04' ?  $undertimeMorning : 0;
                                    $undertime_may += $formattedStartdate === '05' ?  $undertimeMorning : 0;
                                    $undertime_june += $formattedStartdate === '06' ?  $undertimeMorning : 0;
                                    $undertime_july += $formattedStartdate === '07' ?  $undertimeMorning : 0;
                                    $undertime_august += $formattedStartdate === '08' ?  $undertimeMorning : 0;
                                    $undertime_september += $formattedStartdate === '09' ?  $undertimeMorning : 0;
                                    $undertime_october += $formattedStartdate === '10' ?  $undertimeMorning : 0;
                                    $undertime_november += $formattedStartdate === '11' ?  $undertimeMorning : 0;
                                    $undertime_december += $formattedStartdate === '12' ?  $undertimeMorning : 0;
                                }
                            }

                            if ($afternoon_start > $afternoon_duty && $tardiness->afternoon_in != null && $tardiness->afternoon_out != null) {
                                $formattedStartdate = date("m", strtotime($tardiness->start_date));
                                $afternoon_minutes = $afternoon_start->diffInMinutes($afternoon_duty); // 226
                                if ($afternoon_minutes) {
                                    $tardiness_january += $formattedStartdate === '01' ?  $afternoon_minutes : 0;
                                    $tardiness_february += $formattedStartdate === '02' ?  $afternoon_minutes : 0;
                                    $tardiness_march += $formattedStartdate === '03' ?  $afternoon_minutes : 0;
                                    $tardiness_april += $formattedStartdate === '04' ?  $afternoon_minutes : 0;
                                    $tardiness_may += $formattedStartdate === '05' ?  $afternoon_minutes : 0;
                                    $tardiness_june += $formattedStartdate === '06' ?  $afternoon_minutes : 0;
                                    $tardiness_july += $formattedStartdate === '07' ?  $afternoon_minutes : 0;
                                    $tardiness_august += $formattedStartdate === '08' ?  $afternoon_minutes : 0;
                                    $tardiness_september += $formattedStartdate === '09' ?  $afternoon_minutes : 0;
                                    $tardiness_october += $formattedStartdate === '10' ?  $afternoon_minutes : 0;
                                    $tardiness_november += $formattedStartdate === '11' ?  $afternoon_minutes : 0;
                                    $tardiness_december += $formattedStartdate === '12' ?  $afternoon_minutes : 0;
                                }
                            }

                            if ($afternoon_end < $afternoonDutyTime_out && $tardiness->afternoon_in != null && $tardiness->afternoon_out != null) {
                                $undertimeAfternoon = $afternoon_end->diffInMinutes($afternoonDutyTime_out);
                                if ($undertimeAfternoon) {
                                    $undertime_january += $formattedStartdate === '01' ?  $undertimeAfternoon : 0;
                                    $undertime_february += $formattedStartdate === '02' ?  $undertimeAfternoon : 0;
                                    $undertime_march += $formattedStartdate === '03' ?  $undertimeAfternoon : 0;
                                    $undertime_april += $formattedStartdate === '04' ?  $undertimeAfternoon : 0;
                                    $undertime_may += $formattedStartdate === '05' ?  $undertimeAfternoon : 0;
                                    $undertime_june += $formattedStartdate === '06' ?  $undertimeAfternoon : 0;
                                    $undertime_july += $formattedStartdate === '07' ?  $undertimeAfternoon : 0;
                                    $undertime_august += $formattedStartdate === '08' ?  $undertimeAfternoon : 0;
                                    $undertime_september += $formattedStartdate === '09' ?  $undertimeAfternoon : 0;
                                    $undertime_october += $formattedStartdate === '10' ?  $undertimeAfternoon : 0;
                                    $undertime_november += $formattedStartdate === '11' ?  $undertimeAfternoon : 0;
                                    $undertime_december += $formattedStartdate === '12' ?  $undertimeAfternoon : 0;
                                }
                            }
                        }
                    }
                }
            }
        
            $totalTardiness[] = [
                'January' => $tardiness_january,
                'February' => $tardiness_february,
                'March' => $tardiness_march,
                'April' => $tardiness_april,
                'May' => $tardiness_may,
                'June' => $tardiness_june,
                'July' => $tardiness_july,
                'August' => $tardiness_august,
                'September' => $tardiness_september,
                'October' => $tardiness_october,
                'November' => $tardiness_november,
                'December' => $tardiness_december
            ];
            $totalUndertime[] = [
                'January' => $month_val >= 1 ? $undertime_january : 0,
                'February' => $month_val >= 2 ? $undertime_february : 0,
                'March' =>  $month_val >= 3 ? $undertime_march : 0,
                'April' =>  $month_val >= 4 ? $undertime_april : 0,
                'May' =>  $month_val >= 5 ? $undertime_may : 0,
                'June' =>  $month_val >= 6 ? $undertime_june : 0,
                'July' =>  $month_val >= 7 ? $undertime_july : 0,
                'August' =>  $month_val >= 8 ? $undertime_august : 0,
                'September' =>  $month_val >= 9 ? $undertime_september : 0,
                'October' =>  $month_val >= 10 ? $undertime_october : 0,
                'November' =>  $month_val >= 11 ? $undertime_november : 0,
                'December' =>  $month_val >= 12 ? $undertime_december : 0
            ];
        // END

        // Get History Analytics Chart

            // Salaries
            $salaries_january = 0;
            $salaries_february = 0;
            $salaries_march = 0;
            $salaries_april = 0;
            $salaries_may = 0;
            $salaries_june = 0;
            $salaries_july = 0;
            $salaries_august = 0;
            $salaries_september = 0;
            $salaries_october = 0;
            $salaries_november = 0;
            $salaries_december = 0;
            $totalSalaries = array();
            //END

            // Deductions
            $deduction_january = 0;
            $deduction_february = 0;
            $deduction_march = 0;
            $deduction_april = 0;
            $deduction_may = 0;
            $deduction_june = 0;
            $deduction_july = 0;
            $deduction_august = 0;
            $deduction_september = 0;
            $deduction_october = 0;
            $deduction_november = 0;
            $deduction_december = 0;
            $totalDeduction = array();
            //END

            // Netpay
            $netpay_january = 0;
            $netpay_february = 0;
            $netpay_march = 0;
            $netpay_april = 0;
            $netpay_may = 0;
            $netpay_june = 0;
            $netpay_july = 0;
            $netpay_august = 0;
            $netpay_september = 0;
            $netpay_october = 0;
            $netpay_november = 0;
            $netpay_december = 0;
            $totalNetpay = array();
            //END

            // Benefits
            $benefits_january = 0;
            $benefits_february = 0;
            $benefits_march = 0;
            $benefits_april = 0;
            $benefits_may = 0;
            $benefits_june = 0;
            $benefits_july = 0;
            $benefits_august = 0;
            $benefits_september = 0;
            $benefits_october = 0;
            $benefits_november = 0;
            $benefits_december = 0;
            $totalBenefits = array();
            //END

            $usersList = array();
            foreach ($users as $user) {
                $usersList[] = $user;
                if ($month != 0) {
                    $historyList = DB::table('hr_payroll_allrecords')
                        ->select(
                            'payroll_id',
                            'processtype',
                            'payroll_fromdate',
                            'payroll_todate',
                            'total_deduction',
                            'net_pay'
                        )
                        ->where('emp_id', '=', $user->user_id)
                        ->whereRaw('MONTH(payroll_todate) <= ?', [$month])
                        ->whereRaw('YEAR(payroll_fromdate) = ?', [$year])
                        ->orderBy('payroll_fromdate', 'asc')
                        ->get();

                    foreach ($historyList as $history) {
                        $formattedStartdate = date("m", strtotime($history->payroll_todate));

                        $historyListbenefits = DB::table('hr_payroll_benefits')
                            ->select(
                                'hr_payroll_benefits.totalAmount'
                            )
                            ->join('hr_employee_benefits_list', 'hr_employee_benefits_list.benefitlist_id', '=', 'hr_payroll_benefits.benefitlist_id')
                            ->where('hr_payroll_benefits.payroll_id', '=', $history->payroll_id)
                            ->get();

                        foreach ($historyListbenefits as $historybenefits) {

                            // Benefits 
                            $benefits_january += $formattedStartdate === '01' ? $historybenefits->totalAmount : 0;
                            $benefits_february += $formattedStartdate === '02' ? $historybenefits->totalAmount : 0;
                            $benefits_march += $formattedStartdate === '03' ? $historybenefits->totalAmount : 0;
                            $benefits_april += $formattedStartdate === '04' ? $historybenefits->totalAmount : 0;
                            $benefits_may += $formattedStartdate === '05' ? $historybenefits->totalAmount : 0;
                            $benefits_june += $formattedStartdate === '06' ? $historybenefits->totalAmount : 0;
                            $benefits_july += $formattedStartdate === '07' ? $historybenefits->totalAmount : 0;
                            $benefits_august += $formattedStartdate === '08' ? $historybenefits->totalAmount : 0;
                            $benefits_september += $formattedStartdate === '09' ? $historybenefits->totalAmount : 0;
                            $benefits_october += $formattedStartdate === '10' ? $historybenefits->totalAmount : 0;
                            $benefits_november += $formattedStartdate === '11' ? $historybenefits->totalAmount : 0;
                            $benefits_december += $formattedStartdate === '12' ? $historybenefits->totalAmount : 0;
                            //END
                        }
                        //Salary 
                        $salaries_january += $formattedStartdate === '01' ? $user->monthly_rate / 2 : 0;
                        $salaries_february += $formattedStartdate === '02' ? $user->monthly_rate / 2 : 0;
                        $salaries_march += $formattedStartdate === '03' ? $user->monthly_rate / 2 : 0;
                        $salaries_april += $formattedStartdate === '04' ? $user->monthly_rate / 2 : 0;
                        $salaries_may += $formattedStartdate === '05' ? $user->monthly_rate / 2 : 0;
                        $salaries_june += $formattedStartdate === '06' ? $user->monthly_rate / 2 : 0;
                        $salaries_july += $formattedStartdate === '07' ? $user->monthly_rate / 2 : 0;
                        $salaries_august += $formattedStartdate === '08' ? $user->monthly_rate / 2 : 0;
                        $salaries_september += $formattedStartdate === '09' ? $user->monthly_rate / 2 : 0;
                        $salaries_october += $formattedStartdate === '10' ? $user->monthly_rate / 2 : 0;
                        $salaries_november += $formattedStartdate === '11' ? $user->monthly_rate / 2 : 0;
                        $salaries_december += $formattedStartdate === '12' ? $user->monthly_rate / 2 : 0;
                        //END
                        //Deduction 
                        $deduction_january += $formattedStartdate === '01' ? $history->total_deduction : 0;
                        $deduction_february += $formattedStartdate === '02' ? $history->total_deduction : 0;
                        $deduction_march += $formattedStartdate === '03' ? $history->total_deduction : 0;
                        $deduction_april += $formattedStartdate === '04' ? $history->total_deduction : 0;
                        $deduction_may += $formattedStartdate === '05' ? $history->total_deduction : 0;
                        $deduction_june += $formattedStartdate === '06' ? $history->total_deduction : 0;
                        $deduction_july += $formattedStartdate === '07' ? $history->total_deduction : 0;
                        $deduction_august += $formattedStartdate === '08' ? $history->total_deduction : 0;
                        $deduction_september += $formattedStartdate === '09' ? $history->total_deduction : 0;
                        $deduction_october += $formattedStartdate === '10' ? $history->total_deduction : 0;
                        $deduction_november += $formattedStartdate === '11' ? $history->total_deduction : 0;
                        $deduction_december += $formattedStartdate === '12' ? $history->total_deduction : 0;
                        //END
                        //Netpay 
                        $netpay_january += $formattedStartdate === '01' ? $history->net_pay : 0;
                        $netpay_february += $formattedStartdate === '02' ? $history->net_pay : 0;
                        $netpay_march += $formattedStartdate === '03' ? $history->net_pay : 0;
                        $netpay_april += $formattedStartdate === '04' ? $history->net_pay : 0;
                        $netpay_may += $formattedStartdate === '05' ? $history->net_pay : 0;
                        $netpay_june += $formattedStartdate === '06' ? $history->net_pay : 0;
                        $netpay_july += $formattedStartdate === '07' ? $history->net_pay : 0;
                        $netpay_august += $formattedStartdate === '08' ? $history->net_pay : 0;
                        $netpay_september += $formattedStartdate === '09' ? $history->net_pay : 0;
                        $netpay_october += $formattedStartdate === '10' ? $history->net_pay : 0;
                        $netpay_november += $formattedStartdate === '11' ? $history->net_pay : 0;
                        $netpay_december += $formattedStartdate === '12' ? $history->net_pay : 0;
                        //END

                    }
                } else {
                    for ($i = 0; $i < $month_val; $i++) {
                        $historyList = DB::table('hr_payroll_allrecords')
                            ->select(
                                'payroll_id',
                                'processtype',
                                'payroll_fromdate',
                                'payroll_todate',
                                'total_deduction',
                                'net_pay'
                            )
                            ->where('emp_id', '=', $user->user_id)
                            ->whereRaw('MONTH(payroll_todate) <= ?', $months[$i])
                            ->whereRaw('YEAR(payroll_fromdate) = ?', [$year])
                            ->orderBy('payroll_fromdate', 'asc')
                            ->get();

                        foreach ($historyList as $history) {
                            $formattedStartdate = date("m", strtotime($history->payroll_todate));

                            $historyListbenefits = DB::table('hr_payroll_benefits')
                                ->select(
                                    'hr_payroll_benefits.totalAmount'
                                )
                                ->join('hr_employee_benefits_list', 'hr_employee_benefits_list.benefitlist_id', '=', 'hr_payroll_benefits.benefitlist_id')
                                ->where('hr_payroll_benefits.payroll_id', '=', $history->payroll_id)
                                ->get();

                            foreach ($historyListbenefits as $historybenefits) {

                                // Benefits 
                                $benefits_january += $formattedStartdate === '01' ? $historybenefits->totalAmount : 0;
                                $benefits_february += $formattedStartdate === '02' ? $historybenefits->totalAmount : 0;
                                $benefits_march += $formattedStartdate === '03' ? $historybenefits->totalAmount : 0;
                                $benefits_april += $formattedStartdate === '04' ? $historybenefits->totalAmount : 0;
                                $benefits_may += $formattedStartdate === '05' ? $historybenefits->totalAmount : 0;
                                $benefits_june += $formattedStartdate === '06' ? $historybenefits->totalAmount : 0;
                                $benefits_july += $formattedStartdate === '07' ? $historybenefits->totalAmount : 0;
                                $benefits_august += $formattedStartdate === '08' ? $historybenefits->totalAmount : 0;
                                $benefits_september += $formattedStartdate === '09' ? $historybenefits->totalAmount : 0;
                                $benefits_october += $formattedStartdate === '10' ? $historybenefits->totalAmount : 0;
                                $benefits_november += $formattedStartdate === '11' ? $historybenefits->totalAmount : 0;
                                $benefits_december += $formattedStartdate === '12' ? $historybenefits->totalAmount : 0;
                                //END
                            }
                            //Salary 
                            $salaries_january += $formattedStartdate === '01' ? $user->monthly_rate / 2 : 0;
                            $salaries_february += $formattedStartdate === '02' ? $user->monthly_rate / 2 : 0;
                            $salaries_march += $formattedStartdate === '03' ? $user->monthly_rate / 2 : 0;
                            $salaries_april += $formattedStartdate === '04' ? $user->monthly_rate / 2 : 0;
                            $salaries_may += $formattedStartdate === '05' ? $user->monthly_rate / 2 : 0;
                            $salaries_june += $formattedStartdate === '06' ? $user->monthly_rate / 2 : 0;
                            $salaries_july += $formattedStartdate === '07' ? $user->monthly_rate / 2 : 0;
                            $salaries_august += $formattedStartdate === '08' ? $user->monthly_rate / 2 : 0;
                            $salaries_september += $formattedStartdate === '09' ? $user->monthly_rate / 2 : 0;
                            $salaries_october += $formattedStartdate === '10' ? $user->monthly_rate / 2 : 0;
                            $salaries_november += $formattedStartdate === '11' ? $user->monthly_rate / 2 : 0;
                            $salaries_december += $formattedStartdate === '12' ? $user->monthly_rate / 2 : 0;
                            //END
                            //Deduction 
                            $deduction_january += $formattedStartdate === '01' ? $history->total_deduction : 0;
                            $deduction_february += $formattedStartdate === '02' ? $history->total_deduction : 0;
                            $deduction_march += $formattedStartdate === '03' ? $history->total_deduction : 0;
                            $deduction_april += $formattedStartdate === '04' ? $history->total_deduction : 0;
                            $deduction_may += $formattedStartdate === '05' ? $history->total_deduction : 0;
                            $deduction_june += $formattedStartdate === '06' ? $history->total_deduction : 0;
                            $deduction_july += $formattedStartdate === '07' ? $history->total_deduction : 0;
                            $deduction_august += $formattedStartdate === '08' ? $history->total_deduction : 0;
                            $deduction_september += $formattedStartdate === '09' ? $history->total_deduction : 0;
                            $deduction_october += $formattedStartdate === '10' ? $history->total_deduction : 0;
                            $deduction_november += $formattedStartdate === '11' ? $history->total_deduction : 0;
                            $deduction_december += $formattedStartdate === '12' ? $history->total_deduction : 0;
                            //END
                            //Netpay 
                            $netpay_january += $formattedStartdate === '01' ? $history->net_pay : 0;
                            $netpay_february += $formattedStartdate === '02' ? $history->net_pay : 0;
                            $netpay_march += $formattedStartdate === '03' ? $history->net_pay : 0;
                            $netpay_april += $formattedStartdate === '04' ? $history->net_pay : 0;
                            $netpay_may += $formattedStartdate === '05' ? $history->net_pay : 0;
                            $netpay_june += $formattedStartdate === '06' ? $history->net_pay : 0;
                            $netpay_july += $formattedStartdate === '07' ? $history->net_pay : 0;
                            $netpay_august += $formattedStartdate === '08' ? $history->net_pay : 0;
                            $netpay_september += $formattedStartdate === '09' ? $history->net_pay : 0;
                            $netpay_october += $formattedStartdate === '10' ? $history->net_pay : 0;
                            $netpay_november += $formattedStartdate === '11' ? $history->net_pay : 0;
                            $netpay_december += $formattedStartdate === '12' ? $history->net_pay : 0;
                            //END

                        }
                    }
                }
            }
         
                $totalSalaries[] = [
                    'January' => $salaries_january,
                    'February' => $salaries_february,
                    'March' => $salaries_march,
                    'April' => $salaries_april,
                    'May' => $salaries_may,
                    'June' => $salaries_june,
                    'July' => $salaries_july,
                    'August' => $salaries_august,
                    'September' => $salaries_september,
                    'October' => $salaries_october,
                    'November' => $salaries_november,
                    'December' => $salaries_december
                ];
                $totalDeduction[] = [
                    'January' =>  $deduction_january,
                    'February' =>  $deduction_february,
                    'March' =>   $deduction_march,
                    'April' =>   $deduction_april,
                    'May' =>   $deduction_may,
                    'June' =>   $deduction_june,
                    'July' =>   $deduction_july,
                    'August' =>   $deduction_august,
                    'September' =>   $deduction_september,
                    'October' =>  $deduction_october,
                    'November' =>  $deduction_november,
                    'December' =>  $deduction_december
                ];
                $totalNetpay[] = [
                    'January' =>  $netpay_january,
                    'February' =>  $netpay_february,
                    'March' =>   $netpay_march,
                    'April' =>   $netpay_april,
                    'May' =>   $netpay_may,
                    'June' =>   $netpay_june,
                    'July' =>   $netpay_july,
                    'August' =>   $netpay_august,
                    'September' =>   $netpay_september,
                    'October' =>  $netpay_october,
                    'November' =>  $netpay_november,
                    'December' =>  $netpay_december
                ];
                $totalBenefits[] = [
                    'January' =>  $benefits_january,
                    'February' =>  $benefits_february,
                    'March' =>   $benefits_march,
                    'April' =>   $benefits_april,
                    'May' =>   $benefits_may,
                    'June' =>   $benefits_june,
                    'July' =>   $benefits_july,
                    'August' =>   $benefits_august,
                    'September' =>   $benefits_september,
                    'October' =>  $benefits_october,
                    'November' =>  $benefits_november,
                    'December' =>  $benefits_december
                ];
        // END

        return response()->json([
            'status' => 200,
            'totalApplications' => $totalApplications[0] ?? null,
            'totalAbsences' => $totalAbsent[0] ?? null,
            'totalTardiness' => $totalTardiness[0] ?? null,
            'totalUndertime' => $totalUndertime[0] ?? null,
            'totalWorkdays' => $totalWorkdays[0] ?? null,
            'totalSalaries' => $totalSalaries[0] ?? null,
            'totalDeduction' => $totalDeduction[0] ?? null,
            'totalNetpay' => $totalNetpay[0] ?? null,
            'totalBenefits' => $totalBenefits[0] ?? null,
            'totalUsers' => $usersList

        ]);
    }
}
