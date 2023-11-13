<?php

namespace App\Http\Controllers;

use App\Mail\PayrollMail;
use App\Mail\ReferralInternalMail;
use App\Mail\ReferralMail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MailController extends Controller
{
    public function referralConfirmationMail(Request $request)
		{
			try {
				$user = $request->user();
	
				$details = [
					'name' => $user->contact_fname,
				];
		
				\Mail::to($user->contact_email)->send(new ReferralMail($details));
				\Mail::to('support@nasya.ph')->send(new ReferralInternalMail($details));

				return response([
					'success' => true,
				]);
			} catch (\Throwable $th) {
				return response([
					'success' => false,
				]);
			}
		}

		public function payrollMail(Request $request, $id)
		{

			$payroll_recordsData = DB::table('hr_payroll_allrecords')
			->select(DB::raw("*"))
			->where('payroll_id', '=', $id)
			->where('hr_payroll_allrecords.is_deleted', '=', 0)
			->get();


			foreach($payroll_recordsData as $payroll_record){
				$users = DB::table('user')
				->select(DB::raw("
					user.email,
					user.fname,
					user.mname,
					user.lname
					 "))
				->where('is_deleted', '=', 0)
				->where('user_id', '=', $payroll_record->emp_id)
				->get();

				foreach($users as $user){

					$fullname = $user->fname . ' ' . $user->lname;
					$email = $user->email;
					$payroll_date = date('F j, Y', strtotime($payroll_record->payroll_fromdate)) . ' to ' . date('F j, Y', strtotime($payroll_record->payroll_todate)) . ' '.'/ 15 days Cut off';
					try{
						$details = [
							'name' => $fullname,
							'email' => 'michaelcaligner@gmail.com',
							'payrollDate' => $payroll_date
						];
		
						$message = \Mail::to($email)->send(new PayrollMail($details));
						$message = 'Success';
					}catch(Exception $e){
						$message =  $e;
					}
					return response()->json([
						'status' => 200,
						'userData' => $message,
					]);
				}
			}


		}
}
