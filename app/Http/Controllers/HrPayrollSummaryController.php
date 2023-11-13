<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HrPayrollSummaryController extends Controller
{
   public function getPayrollSummary($dates)
   {
      $recordsDate = explode(",", $dates);
      $cutoff = $recordsDate[0];
      $monthRecord = $recordsDate[1];
      $yearRecord = $recordsDate[2];
      $userRecord_payroll = array();
      $test = array();
      // ->whereRaw('MONTH(payroll_todate) BETWEEN ' . $monthRecord . ' AND ' . 12)

      $users = DB::table('user')
         ->select(DB::raw("
      user.user_id,
      user.fname,
      user.mname,
      user.lname,
      user.monthly_rate"))
         ->where('is_deleted', '=', 0)
         ->get();

      $total_grosspay = 0;
      $total_sss_emps = 0;
      $total_sss_empr = 0;
      $total_phil_emps = 0;
      $total_phil_empr = 0;
      $total_pgbig_emps = 0;
      $total_pgbig_empr = 0;
      $total_all_deduct = 0;
      $total_all_pay = 0;

      $total_grosspay_added = 0;
      $total_sss_emps_added  = 0;
      $total_sss_empr_added  = 0;
      $total_phil_emps_added = 0;
      $total_phil_empr_added  = 0;
      $total_pgbig_emps_added  = 0;
      $total_pgbig_empr_added  = 0;
      $total_all_deduct_added  = 0;
      $total_all_pay_added  = 0;

      $summaryAddedData = DB::table('hr_payroll_allrecords')
         ->select(
            'hr_payroll_allrecords.payroll_id',
            'hr_payroll_allrecords.processtype',
            'hr_payroll_allrecords.fname',
            'hr_payroll_allrecords.mname',
            'hr_payroll_allrecords.lname',
            'hr_payroll_allrecords.monthly_rate',
            'hr_payroll_allrecords.total_deduction',
            'hr_payroll_allrecords.net_pay'
         )
         ->where('payroll_cutoff', '=', $cutoff)
         ->where('processtype', '=', 4)
         ->whereRaw('MONTH(payroll_todate) = ?', [$monthRecord])
         ->whereRaw('YEAR(payroll_fromdate) = ?', [$yearRecord])
         ->orderBy('payroll_fromdate', 'asc')
         ->get();


      foreach ($users as $user) {
         $payroll_id = '';
         $processtype = '';
         $sss_employee = 0;
         $sss_employers = 0;
         $phil_employee = 0;
         $phil_employers = 0;
         $pbg_employee = 0;
         $pbg_employers = 0;
         $total_deduction = 0;
         $net_pay = 0;
         $total_deduction = 0;
         $payroll_id = 0;
         $processtype = 0;
         $payrollList = DB::table('hr_payroll_allrecords')
            ->select(
               'hr_payroll_allrecords.payroll_id',
               'hr_payroll_allrecords.processtype',
               'hr_payroll_allrecords.payroll_fromdate',
               'hr_payroll_allrecords.payroll_todate',
               'hr_payroll_allrecords.total_deduction',
               'hr_payroll_allrecords.net_pay',
               'hr_payroll_benefits.totalAmount',
               'hr_payroll_benefits.type',
               'hr_employee_benefits_list.title'
            )
            ->join('hr_payroll_benefits', 'hr_payroll_benefits.payroll_id', '=', 'hr_payroll_allrecords.payroll_id')
            ->join('hr_employee_benefits_list', 'hr_employee_benefits_list.benefitlist_id', '=', 'hr_payroll_benefits.benefitlist_id')
            ->where('payroll_cutoff', '=', $cutoff)
            ->where('hr_payroll_allrecords.emp_id', '=', $user->user_id)
            ->whereRaw('MONTH(payroll_todate) = ?', [$monthRecord])
            ->whereRaw('YEAR(payroll_todate) = ?', [$yearRecord])
            ->orderBy('payroll_todate', 'asc')
            ->get();

         if (!empty($payrollList)) {
            foreach ($payrollList as $payroll) {
               $payroll_fromdate = $payroll->payroll_fromdate;
               $payroll_todate = $payroll->payroll_todate;
               $total_deduction = $payroll->total_deduction;
               $payroll_id = $payroll->payroll_id;
               $processtype = $payroll->processtype;

               $net_pay = $payroll->net_pay;

               if ($payroll->type == 1) {
                  if ($payroll->title == 'SSS') {
                     $sss_employers = $payroll->totalAmount;
                  }
                  if ($payroll->title == 'PHILHEALTH') {
                     $phil_employers = $payroll->totalAmount;
                  }
                  if ($payroll->title == 'HDMF') {
                     $pbg_employers = $payroll->totalAmount;
                  }
               }
               if ($payroll->type == 3) {
                  if ($payroll->title == 'SSS') {
                     $sss_employee = $payroll->totalAmount;
                  }
                  if ($payroll->title == 'PHILHEALTH') {
                     $phil_employee = $payroll->totalAmount;
                  }
                  if ($payroll->title == 'HDMF') {
                     $pbg_employee = $payroll->totalAmount;
                  }
               }
            }
            if (count($payrollList) != 0) {
               $total_grosspay += $user->monthly_rate / 2;
               $total_sss_emps += $sss_employee;
               $total_sss_empr += $sss_employers;
               $total_phil_emps += $phil_employee;
               $total_phil_empr += $phil_employers;
               $total_pgbig_emps += $pbg_employee;
               $total_pgbig_empr += $pbg_employers;
               $total_all_deduct += $total_deduction;
               $total_all_pay += $net_pay;

               $userRecord_payroll[] = [
                  'payroll_id' => $payroll_id,
                  'processtype' => $processtype,
                  'user_id' => $user->user_id,
                  'fname' => $user->fname,
                  'mname' => $user->mname,
                  'lname' => $user->lname,
                  'monthly_rate' => $user->monthly_rate / 2,
                  'sss_employee' => $sss_employee,
                  'sss_employers' => $sss_employers,
                  'phil_employee' => $phil_employee,
                  'phil_employers' => $phil_employers,
                  'pbg_employee' => $pbg_employee,
                  'pbg_employers' => $pbg_employers,
                  'total_deduction' => $total_deduction,
                  'net_pay' => $net_pay
               ];
            }
         } else {
            $userRecord_payroll[] = [
               'payroll_id' => '',
               'processtype' => '',
               'user_id' => '',
               'fname' => '',
               'mname' => '',
               'lname' => '',
               'monthly_rate' => '',
               'sss_employee' => '',
               'sss_employers' => '',
               'phil_employee' => '',
               'phil_employers' => '',
               'pbg_employee' => '',
               'pbg_employers' => '',
               'total_deduction' => '',
               'net_pay' => ''
            ];
         }
      }
      if (!empty($summaryAddedData)) {
         foreach ($summaryAddedData as $summarydata) {
            $sss_employee_added = 0;
            $sss_employers_added = 0;
            $phil_employee_added = 0;
            $phil_employers_added = 0;
            $pbg_employee_added = 0;
            $pbg_employers_added = 0;
            $total_deduction_added = 0;
            $net_pay_added = 0;
            $summaryAddedBenefits = DB::table('hr_payroll_benefits')
               ->select(
                  'hr_payroll_benefits.totalAmount',
                  'hr_payroll_benefits.type',
                  'hr_payroll_benefits.summary_title'
               )
               ->where('hr_payroll_benefits.payroll_id', '=', $summarydata->payroll_id)
               ->get();
            foreach ($summaryAddedBenefits as $summarybenefits) {
               $total_deduction_added = $summarydata->total_deduction;
               $net_pay_added  = $summarydata->net_pay;

               if ($summarybenefits->type == 1) {
                  if ($summarybenefits->summary_title == 'SSS') {
                     $sss_employers_added = $summarybenefits->totalAmount;
                  }
                  if ($summarybenefits->summary_title == 'PhilHealth') {
                     $phil_employers_added = $summarybenefits->totalAmount;
                  }
                  if ($summarybenefits->summary_title == 'Pag-ibig') {
                     $pbg_employers_added = $summarybenefits->totalAmount;
                  }
               }
               if ($summarybenefits->type == 3) {
                  if ($summarybenefits->summary_title == 'SSS') {
                     $sss_employee_added = $summarybenefits->totalAmount;
                  }
                  if ($summarybenefits->summary_title == 'PhilHealth') {
                     $phil_employee_added = $summarybenefits->totalAmount;
                  }
                  if ($summarybenefits->summary_title == 'Pag-ibig') {
                     $pbg_employee_added = $summarybenefits->totalAmount;
                  }
               }
            }
            if (count($summaryAddedData) != 0) {
               $total_grosspay_added   += $summarydata->monthly_rate / 2;
               $total_sss_emps_added   += $sss_employee_added;
               $total_sss_empr_added   += $sss_employers_added;
               $total_phil_emps_added  += $phil_employee_added;
               $total_phil_empr_added  += $phil_employers_added;
               $total_pgbig_emps_added    += $pbg_employee_added;
               $total_pgbig_empr_added   += $pbg_employers_added;
               $total_all_deduct_added   += $total_deduction_added;
               $total_all_pay_added     += $net_pay_added;

               array_push($userRecord_payroll, [
                  'payroll_id' => $summarydata->payroll_id,
                  'processtype' => $summarydata->processtype,
                  'user_id' => null,
                  'fname' => $summarydata->fname,
                  'mname' => $summarydata->mname,
                  'lname' => $summarydata->lname,
                  'monthly_rate' => $summarydata->monthly_rate / 2,
                  'sss_employee' => $sss_employee_added,
                  'sss_employers' => $sss_employers_added,
                  'phil_employee' => $phil_employee_added,
                  'phil_employers' => $phil_employers_added,
                  'pbg_employee' => $pbg_employee_added,
                  'pbg_employers' => $pbg_employers_added,
                  'total_deduction' => $total_deduction_added,
                  'net_pay' => $net_pay_added
               ]);
            }
         }
      } else {
         $userRecord_payroll[] = [
            'payroll_id' => '',
            'processtype' => '',
            'user_id' => '',
            'fname' => '',
            'mname' => '',
            'lname' => '',
            'monthly_rate' => '',
            'sss_employee' => '',
            'sss_employers' => '',
            'phil_employee' => '',
            'phil_employers' => '',
            'pbg_employee' => '',
            'pbg_employers' => '',
            'total_deduction' => '',
            'net_pay' => ''
         ];
      }


      return response()->json([
         'status' => 200,
         'payrollRecords' => $userRecord_payroll,
         'payroll_from' => $payroll_fromdate,
         'payroll_to' => $payroll_todate,
         'test' =>  $total_all_deduct,
         'total_grosspay' => $total_grosspay + $total_grosspay_added,
         'total_sss_emps' => $total_sss_emps + $total_sss_emps_added,
         'total_sss_empr' => $total_sss_empr + $total_sss_empr_added,
         'total_phil_emps' => $total_phil_emps + $total_phil_emps_added,
         'total_phil_empr' => $total_phil_empr + $total_phil_empr_added,
         'total_pgbig_emps' => $total_pgbig_emps + $total_pgbig_emps_added,
         'total_pgbig_empr' => $total_pgbig_empr + $total_pgbig_empr_added,
         'total_all_deduct' => $total_all_deduct + $total_all_deduct_added,
         'total_all_pay' => $total_all_pay + $total_all_pay_added
      ]);
   }

   public function addPayrollSummaryEmployee(Request $request)
   {

      $payrollData = $request->validate([
         'fname' => 'required',
         'mname' => 'required',
         'lname' => 'required',
         'grosspay' => 'required',
         'fromDate' => 'required',
         'toDate' => 'required',
         'cutoff' => 'required',
         'total_deduction' => 'required',
         'net_pay' => 'required'
      ]);
      $additionalBenefits = $request->validate([
         'sss_employee' => 'nullable',
         'phil_employee' => 'nullable',
         'pgbig_employee' => 'nullable'
      ]);
      $Contribution = $request->validate([
         'sss_employer' => 'nullable',
         'phil_employer' => 'nullable',
         'pgbig_employer' => 'nullable'
      ]);

      try {
         DB::table('hr_payroll_allrecords')->insert(array(
            'fname' => $payrollData['fname'],
            'mname' => $payrollData['mname'],
            'lname' => $payrollData['lname'],
            'payroll_cutoff' => $payrollData['cutoff'],
            'monthly_rate' => $payrollData['grosspay'],
            'payroll_fromdate' => $payrollData['fromDate'],
            'payroll_todate' => $payrollData['toDate'],
            'processtype' => 4,
            'total_contribution' => array_sum($Contribution),
            'total_deduction' => $payrollData['total_deduction'],
            'net_pay' => $payrollData['net_pay'],
         ));
         $payroll_id = DB::getPdo()->lastInsertId();

         // Employee Insert Benefits
         DB::table('hr_payroll_benefits')->insert(
            array(
               'payroll_id' => intval($payroll_id),
               'summary_title' => 'SSS',
               'totalAmount' => $additionalBenefits['sss_employee'] ?? 0,
               'type' => 1
            )
         );

         DB::table('hr_payroll_benefits')->insert(
            array(
               'payroll_id' => intval($payroll_id),
               'summary_title' => 'PhilHealth',
               'totalAmount' => $additionalBenefits['phil_employee'] ?? 0,
               'type' => 1
            )
         );

         DB::table('hr_payroll_benefits')->insert(
            array(
               'payroll_id' => intval($payroll_id),
               'summary_title' => 'Pag-ibig',
               'totalAmount' => $additionalBenefits['pgbig_employee'] ?? 0,
               'type' => 1
            )
         );
         // END

         // Employer Insert Benefits
         DB::table('hr_payroll_benefits')->insert(
            array(
               'payroll_id' => intval($payroll_id),
               'summary_title' => 'SSS',
               'totalAmount' => $Contribution['sss_employer'] ?? 0,
               'type' => 3
            )
         );

         DB::table('hr_payroll_benefits')->insert(
            array(
               'payroll_id' => intval($payroll_id),
               'summary_title' => 'PhilHealth',
               'totalAmount' => $Contribution['phil_employer'] ?? 0,
               'type' => 3
            )
         );

         DB::table('hr_payroll_benefits')->insert(
            array(
               'payroll_id' => intval($payroll_id),
               'summary_title' => 'Pag-ibig',
               'totalAmount' => $Contribution['pgbig_employer'] ?? 0,
               'type' => 3
            )
         );
         // END
         $message = 'Success';
      } catch (Exception $e) {
         $message = $e;
      }
      return response()->json([
         'status' => 200,
         'EmployeeData' => $message
      ]);
   }
   public function deletePayrollSummaryEmployee(Request $request)
   {
      $payroll_id = $request->validate([
         'payroll_id' => 'required'
      ]);

      try {
         DB::table('hr_payroll_allrecords')->where('payroll_id', $payroll_id['payroll_id'])->delete();
         DB::table('hr_payroll_benefits')->where('payroll_id', $payroll_id['payroll_id'])->delete();
         $message = 'Success';
      } catch (Exception $e) {
         $message = $e;
      }

      return response()->json([
         'status' => 200,
         'delete' => $message
      ]);
   }
}
