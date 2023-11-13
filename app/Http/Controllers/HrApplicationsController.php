<?php

namespace App\Http\Controllers;

use App\Models\HrApplications;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HrApplicationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function getApplications()
    {

        $applications = DB::table('hr_applications')
            ->select(DB::raw("
        user.fname, 
        user.mname, 
        user.lname, 
        user.category, 
        user.department, 
        user.profile_pic, 
        hr_applications.application_id,
        hr_applications.leave_type, 
        hr_applications.date_from, 
        hr_applications.remarks,
        hr_applications.date_to,
        hr_applications.app_hours, 
        hr_applications.app_file,
        hr_workdays.workday_id,
        hr_workdays.color,
        hr_workdays.user_id,
        hr_workdays.`status` "))
            ->join('user', 'hr_applications.user_id', '=', 'user.user_id')
            ->join('hr_workdays', 'hr_applications.application_id', '=', 'hr_workdays.application_id')
            ->where('hr_applications.is_deleted', '=', 0)
            ->orderBy('hr_applications.date_from', 'desc')
            ->get();

        $total_applications = array();
        foreach ($applications as $list) {
            $total_applications[] = $list;
        }

        return response()->json([
            'status' => 200,
            'applications' => $total_applications
        ]);
    }
    public function deleteApplications(Request $request)
    {
        $app_id = $request->validate([
            'application_id' => 'required'
        ]);

        try {
            $delete_apps = DB::table('hr_applications')->where('application_id', $app_id['application_id'])->delete();
            $delete_apps_workdays = DB::table('hr_workdays')->where('application_id', $app_id['application_id'])->delete();

            if ($delete_apps && $delete_apps_workdays) {
                $message = "Success";
            } else {
                $message = "Something went wrong";
            }
        } catch (Exception $e) {
            $message = "Error";
        }

        return response()->json([
            'status' => 200,
            'message' => $message
        ]);
    }

    public function addApplication(Request $request)
    {

        $applicationStatus = $request->validate([
            'user_id' => 'required',
            'workday_id' => 'required',
            'application_id' => 'required',
            'status' => 'required',
            'color' => 'required'
        ]);
        if ($applicationStatus) {
            $status = DB::table('hr_workdays')->where('workday_id', $applicationStatus['workday_id'])->update(['status' => $applicationStatus['status'], 'color' => $applicationStatus['color']]);
            $message = "Success";
        } else {
            $message = "Fail";
        }



        return response()->json([
            'status' => 200,
            'editApplication' => $message
        ]);
    }

    public function getApplicationStatus()
    {
        $getStatus = DB::table('hr_application_status')->select(DB::raw("app_status_id,app_status_name,is_deleted,created_at"))->where("is_deleted", "!=", "1")->orderBy('app_status_name', 'ASC')->get();

        return response()->json([
            'status' => 200,
            'status' => $getStatus
        ]);
    }

    public function addApplicationStatus(Request $request)
    {
        $status_name = $request->validate([
            'status_name' => 'required'
        ]);

        $insert_status = DB::table('hr_application_status')->insert(
            array(
                'app_status_name' => $status_name['status_name']
            )
        );
        return response()->json([
            'status' => 200,
            'data' => $insert_status
        ]);
    }

    public function deleteAppStatus(Request $reqeust, $id)
    {

        $deleteStatus = $reqeust->validate([
            'is_deleted' => 'required'
        ]);
        $status = DB::table('hr_application_status')->where('app_status_id', $id)->update(['is_deleted' => $deleteStatus['is_deleted']]);

        if ($status) {
            $message = "Success";
        } else {
            $message = "Fail";
        }
        return response()->json([
            'status' => 200,
            'delete_app' => $message
        ]);
    }

    // Application List
    public function addAppList(Request $request)
    {

        $status_name = $request->validate([
            'title' => 'required',
            'percentage' => 'required',
        ]);

        $insert_status = DB::table('hr_application_list')->insert(
            array(
                'list_name' => $status_name['title'],
                'percentage' => $status_name['percentage']
            )
        );

        if ($insert_status) {
            $message = "Success";
        } else {
            $message = "Error";
        }

        return response()->json([
            'status' => 200,
            'message' => $message
        ]);
    }
    public function getApplicationsList()
    {
        $applications = DB::table('hr_application_list')
            ->select(DB::raw("
        applist_id,
        list_name,
        percentage,
        date_created"))
            ->where('is_deleted', '=', 0)
            ->get();

        $total_applications = array();
        foreach ($applications as $list) {
            $total_applications[] = $list;
        }

        return response()->json([
            'status' => 200,
            'applicationList' => $total_applications
        ]);
    }
    public function addNewType(Request $request)
    {
        $validate = $request->validate([
            'appID' => 'required',
            'title' => 'nullable|string|max:255',
            'percentage' => 'nullable',
            'old_title' => 'nullable|string|max:255',
            'old_percentage' => 'nullable'
        ]);

        try {
            if ($validate['title'] != null) {
                $titleVerify = $validate['title'];
            } else {
                $titleVerify = $validate['old_title'];
            }
            if ($validate['percentage'] != 0) {
                $percentageVerify = $validate['percentage'];
            } else {
                $percentageVerify = $validate['old_percentage'];
            }

            DB::table('hr_application_list')->where('applist_id', $validate['appID'])->update(['list_name' => $titleVerify, 'percentage' => $percentageVerify]);
            DB::table('hr_workdays')->where('applist_id', $validate['appID'])->update(['percentage' => $percentageVerify]);
            DB::table('hr_applications')->where('applist_id', $validate['appID'])->update(['percentage' => $percentageVerify]);

            $message = "Success";
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

    public function deleteApplicationList(Request $request)
    {
        $delete = $request->validate([
            'applist_id' => 'nullable'
        ]);

        $delete_list = DB::table('hr_application_list')->where('applist_id', $delete['applist_id'])->delete();

        if ($delete_list) {
            $message = "Success";
        } else {
            $message = "Error";
        }
        return response()->json([
            'status' => 200,
            'message' => $message
        ]);
    }
}
