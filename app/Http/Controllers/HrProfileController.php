<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HrProfileController extends Controller
{
   public function getUserData($id){

    $employee = DB::table('user')
    ->select(DB::raw('*'))
    ->where('user_id', $id)
    ->get();

    $payslip = DB::table('hr_payroll_allrecords')
    ->select(DB::raw('*'))
    ->where('emp_id', $id)
    ->where('signature','!=', null)
    ->get();

    $present = DB::table('hr_attendance')
    ->select(DB::raw('*'))
    ->where('user_id', $id)
    ->get();

    $application = DB::table('hr_applications')
    ->select(DB::raw('*'))
    ->where('user_id', $id)
    ->get();



    $userData = array();
    foreach($employee as $emp){
        $userData[] = $emp;
    }
  

    return response()->json([
        'status' => 200,
        'userData' => $userData[0],
        'payslip' => count($payslip),
        'present' => count($present),
        'application' => count($application)
    ]);
   }

   public function getPayrollHistory($empID){
    $employee_id = $empID;

    $payrollData = DB::table('hr_payroll_allrecords')
    ->select(DB::raw('*'))
    ->join('user', 'user.user_id', '=', 'hr_payroll_allrecords.emp_id')
    ->where('emp_id', $employee_id)
    ->get();
        
    $payrollhistory = array();
    foreach($payrollData as $payroll){
        $payrollhistory[] = $payroll;
    }

    return response()->json([
        'status' => 200,
        'payrollHistory' => $payrollhistory
    ]);
   }
}
