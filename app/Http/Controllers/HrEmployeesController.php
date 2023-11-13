<?php

namespace App\Http\Controllers;

use App\Models\HrEmployees;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HrEmployeesController extends Controller
{
    // --------------- EMPLOYEES ---------------
    public function getEmployee()
    {
        $employee = User::where('is_deleted', '!=', 1)->where('user_id', '!=', 243)->where('user_id', '!=', 239)->where('user_id', '!=', 1)->where('user_id', '!=', 244)->where('user_id', '!=', 251)->orderBy('date_created', 'ASC')->get();
        $monthToday = date('m');
        $yearToday = date('Y');
        // emp.user_id != 243 && emp.user_id != 239 && emp.user_id != 1 && emp.user_id != 244 && emp.user_id != 251
        $calendarEvents = DB::table('hr_workdays')
            ->select(DB::raw("
            hr_workdays.workday_id,
            hr_workdays.title,
            hr_workdays.start_date,
            hr_workdays.end_date,
            hr_workdays.color"))
            ->where('is_deleted', '=', 0)
            ->whereRaw('MONTH(start_date) = ?', $monthToday)
            ->whereRaw('YEAR(start_date) = ?', $yearToday)
            ->get();


        return response()->json([
            'status' => 200,
            'employee' => $employee,
            'workdays' => count($calendarEvents),
        ]);
    }

    public function searchEmployees(Request $request, $id)
    {
        $update_employee = User::find($id);
        return response()->json([
            'status' => 200,
            'update_employee' => $update_employee
        ]);
    }

    public function addEmployee(Request $request)
    {
        $employees = new HrEmployees();
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = $file->getClientOriginalName();
            $finalName = date('His') . $filename;
            $employees->photo = $request->file('image')->storeAs('images', $finalName, 'public');
            $employees->firstname = $request->input('firstname');
            $employees->lastname = $request->input('lastname');
            $employees->position = $request->input('position');
            $employees->rate = $request->input('rate');
            $employees->birth_date = $request->input('birth_date');
            $employees->email = $request->input('email');
            $employees->contact_number = $request->input('contact_number');
            $employees->address = $request->input('address');
            $employees->save();
            return response()->json([
                'status' => 200,
                'message' => 'Employee Added Successfully'
            ]);
        }
        return response()->json([
            'status' => 200,
            'message' => 'Error Adding of Employee'
        ]);
    }


    public function editEmployee(Request $request, $id)
    {
        $data = $request->validate([
            'fname' => 'nullable|string|max:255',
            'mname' => 'nullable|string|max:255',
            'lname' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'bdate' => 'nullable',
            'user_type' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'hourly_rate'  => 'nullable|regex:/^\d+(\.\d{1,2})?$/',
            'daily_rate'  => 'nullable|regex:/^\d+(\.\d{1,2})?$/',
            'monthly_rate'  => 'nullable|integer',
            'work_days'  => 'nullable|integer',
            'department'  => 'nullable|string|max:255',
            'category'  => 'nullable|string|max:255',
            'date_hired'  => 'nullable'
        ]);

        $editEmployee = User::find($id);

        if ($editEmployee) {
            $editEmployee->update($data);
            return response()->json([
                'status' => 200,
                'message' => 'Employee has been updated'
            ]);
        } else {
            return response()->json([
                'message' => 'Error, Please correct your information.'
            ], 404);
        }
    }

    public function deleteEmployee(Request $request, $id)
    {
        $data = $request->validate([
            'is_deleted' => 'nullable|integer',
        ]);

        $deleteEmployee = User::find($id);

        if ($deleteEmployee) {
            $deleteEmployee->update($data);
            return response()->json([
                'status' => 200,
                'message' => 'Employee has been removed'
            ]);
        } else {
            return response()->json([
                'message' => 'Error'
            ], 404);
        }
    }
    // --------------- END EMPLOYEES ---------------


    // --------------- CALENDAR WORKDAYS ---------------
    public function getCalendarEvents()
    {

        $calendarEvents = DB::table('hr_workdays')
            ->select(DB::raw("
            hr_workdays.workday_id,
            hr_workdays.title,
            hr_workdays.start_date,
            hr_workdays.end_date,
            hr_workdays.color"))
            ->where('type', '=', 1)
            ->where('is_deleted', '=', 0)
            ->get();

        $eventData = array();
        foreach ($calendarEvents as $events) {
            $formatstartDate = date('Y-m-d', strtotime($events->start_date));
            $formatendDate = date('Y-m-d', strtotime($events->end_date));
            $eventData[] = array(
                'id' => $events->workday_id,
                'title' => $events->title,
                'start' => $formatstartDate,
                'end' => $formatendDate,
                'color' => $events->color
            );
        }
        return response()->json([
            'status' => 200,
            'events' => $eventData
        ]);
    }
    public function addCalendarEvent(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'start' => 'required',
            'end' => 'required',
            'color' => 'required'
        ]);

        $start_dates = $data['start'];
        $end_dates = $data['end'];
        $count_dates = 0;
        foreach ($start_dates as $dates) {
            $insert_event = DB::table('hr_workdays')->insert(
                array(
                    'title' => $data['title'],
                    'start_date' => $dates,
                    'end_date' => $end_dates[$count_dates],
                    'color' => $data['color'],
                    'type' => 1,
                )
            );
            $count_dates++;
        }


        $monthToday = date('m');
        $yearToday = date('Y');
        $user_data = array();

        if ($insert_event == true) {
            $workDays = DB::table('hr_workdays')
                ->select(DB::raw("
                hr_workdays.workday_id,
                hr_workdays.title,
                hr_workdays.start_date,
                hr_workdays.end_date,
                hr_workdays.color"))
                ->where('is_deleted', '=', 0)
                ->whereRaw('MONTH(start_date) = ?', $monthToday)
                ->whereRaw('YEAR(start_date) = ?', $yearToday)
                ->get();

            $userDetails = DB::table('user')
                ->select(DB::raw("
                user.user_id,
                user.hourly_rate,
                user.daily_rate,
                user.monthly_rate,
                user.work_days"))
                ->where('is_deleted', '=', 0)
                ->get();
            foreach ($userDetails as $userlist) {
                if ($userlist->monthly_rate != null) {
                    $userID = $userlist->user_id;
                    $totalwkdays = count($workDays);
                    $drate = $userlist->monthly_rate / $totalwkdays;
                    $hrate = $drate / 8;
                    // $user_data[] = [$drate, $hrate,  $userlist->monthly_rate, $totalwkdays];
                    DB::table('user')->where('user_id', '=', $userID)->update(
                        array(
                            'work_days' => $totalwkdays,
                            'daily_rate' => $drate,
                            'hourly_rate' => $hrate
                        )
                    );
                }
            }
            $message = "Success";
        } else {
            $message = "Error";
        }


        return response()->json([
            'status' => 200,
            'message' => $message,
            // 'countDays' => $user_data
        ]);
    }
    public function deleteCalendarEvent(Request $request)
    {
        $data = $request->validate([
            'eventID' => 'required|integer',
        ]);
        $delete_event = DB::table('hr_workdays')->where('workday_id', $data['eventID'])->delete();
        $user_data = array();
        if ($delete_event) {
            $deleteDetails = DB::table('user')
                ->select(DB::raw("
                    user.user_id,
                    user.hourly_rate,
                    user.daily_rate,
                    user.monthly_rate,
                    user.work_days"))
                ->where('is_deleted', '=', 0)
                ->get();

            foreach ($deleteDetails as $userlist) {
                if ($userlist->monthly_rate != null) {
                    $userID = $userlist->user_id;
                    $totalwkdays = $userlist->work_days;
                    $wkdays = $totalwkdays - 1;
                    $mrate = $userlist->monthly_rate;
                    $drate = $mrate / $wkdays;
                    $hrate = $drate / 8;
                    $user_data[] = [$drate, $hrate,  $mrate, $wkdays];

                    DB::table('user')->where('user_id', '=', $userID)->update(
                        array(
                            'work_days' => $wkdays,
                            'daily_rate' => $drate,
                            'hourly_rate' => $hrate
                        )
                    );
                }
            }
            $message = "Success";
        } else {
            $message = "Error";
        }



        return response()->json([
            'status' => 200,
            'deleteData' => $message
        ]);
    }
    // --------------- END CALENDAR WORKDAYS ---------------

    // --------------- BENEFITS ---------------
    public function addBenefits(Request $request)
    {
        $data = $request->validate([
            'benefitlist_id' => 'required',
            'amount' => 'required',
            'type' => 'required',
        ]);
        $benefitsData = DB::table("hr_employee_benefits_list")->where("benefitlist_id", $data['benefitlist_id'])->get();
        foreach($benefitsData as $val){
            $addAttendance = DB::table('hr_employee_benefits')->insert([
                'description' => $val->title,
                'amount' => $data['amount'],
                'type' => $data['type'],
                'benefitlist_id' => $data['benefitlist_id']
            ]);
        }
        if ($addAttendance) {
            $message = "Success";
        } else {
            $message = "Failed";
        }
        return response()->json([
            'status' => 200,
            'benefits' => $message,
            'test' => $message
        ]);
    }

    public function getBenefits()
    {
        $benefitsData = DB::table("hr_employee_benefits")->where("type", 1)->get();
        return response()->json([
            'status' => 200,
            'benefits' => $benefitsData
        ]);
    }
    public function deletebenefits(Request $request)
    {
        $deleteBenefits = $request->validate([
            'benefits_id' => 'required'
        ]);
        $benefitsDel = DB::table("hr_employee_benefits")->where('benefits_id', $deleteBenefits)->delete();

        if ($benefitsDel) {
            return response()->json([
                'status' => 200,
                'message' => 'Benefits has been removed'
            ]);
        } else {
            return response()->json([
                'message' => 'Error'
            ], 404);
        }
    }

    public function addLoans(Request $request)
    {
        $data = $request->validate([
            'benefitlist_id' => 'required',
            'amount' => 'required',
            'type' => 'required',
        ]);

        $loanData = DB::table("hr_employee_benefits_list")->where("benefitlist_id", $data['benefitlist_id'])->get();
        foreach($loanData as $val){
            $addAttendance = DB::table('hr_employee_benefits')->insert([
                'description' => $val->title,
                'amount' => $data['amount'],
                'type' => $data['type'],
                'benefitlist_id' => $data['benefitlist_id']
            ]);
        }

        if ($addAttendance) {
            $message = "Success";
        } else {
            $message = "Failed";
        }
        return response()->json([
            'status' => 200,
            'benefits' => $message
        ]);
    }

    public function getLoans()
    {
        $loansData = DB::table("hr_employee_benefits")->where("type", 2)->get();
        return response()->json([
            'status' => 200,
            'loans' => $loansData
        ]);
    }

    public function deleteLoans(Request $request)
    {
        $deleteLoans = $request->validate([
            'benefits_id' => 'required'
        ]);
        $loansDel = DB::table("hr_employee_benefits")->where('benefits_id', $deleteLoans)->delete();

        if ($loansDel) {
            return response()->json([
                'status' => 200,
                'message' => 'loans has been removed'
            ]);
        } else {
            return response()->json([
                'message' => 'Error'
            ], 404);
        }
    }

    public function getContribution()
    {
        $ContributionData = DB::table("hr_employee_benefits")->where("type", 3)->get();
        return response()->json([
            'status' => 200,
            'contribution' => $ContributionData
        ]);
    }
    public function addContribution(Request $request)
    {
        $data = $request->validate([
            'benefitlist_id' => 'required',
            'amount' => 'required',
            'type' => 'required',
        ]);

        $contriData = DB::table("hr_employee_benefits_list")->where("benefitlist_id", $data['benefitlist_id'])->get();
        foreach($contriData as $val){
            $addAttendance = DB::table('hr_employee_benefits')->insert([
                'description' => $val->title,
                'amount' => $data['amount'],
                'type' => $data['type'],
                'benefitlist_id' => $data['benefitlist_id']
            ]);
        }

        if ($addAttendance) {
            $message = "Success";
        } else {
            $message = "Failed";
        }
        return response()->json([
            'status' => 200,
            'benefits' => $message
        ]);
    }
    public function deleteContribution(Request $request)
    {
        $deleteContribution = $request->validate([
            'benefits_id' => 'required'
        ]);
        $ContributionDel = DB::table("hr_employee_benefits")->where('benefits_id', $deleteContribution)->delete();

        if ($ContributionDel) {
            return response()->json([
                'status' => 200,
                'message' => 'Contribution has been removed'
            ]);
        } else {
            return response()->json([
                'message' => 'Error'
            ], 404);
        }
    }
    // --------------- END BENEFITS ---------------

    // --------------- BENEFITS LIST ---------------
    public function AddAdditionalbenefits(Request $request)
    {
        $addList = $request->validate([
            'title' => 'required',
            'type' => 'required',
        ]);
        try {
            DB::table("hr_employee_benefits_list")->insert($addList);
            $message = 'Success';
            return response()->json([
                'status' => 200,
                'message' => $message
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 200,
                'message' => $e
            ]);
        }
    }
    public function getAdditionalBenefits($type)
    {

        try {
            $listData = DB::table('hr_employee_benefits_list')
                ->select(DB::raw("*"))
                ->where('type', '=', $type)
                ->where('is_deleted', '=', 0)
                ->get();

            return response()->json([
                'status' => 200,
                'data' => $listData
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 200,
                'data' => $e
            ]);
        }
    }
    public function deleteAdditionalbenefits(Request $request)
    {
        $delList = $request->validate([
            'benefitlist_id' => 'required',
        ]);
        try {
            DB::table("hr_employee_benefits_list")->where('benefitlist_id', '=', $delList)->delete();
            $message = 'Success';
            return response()->json([
                'status' => 200,
                'message' => $message
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 200,
                'message' => $e
            ]);
        }
    }
    // --------------- END BENEFITS LIST ---------------
}
