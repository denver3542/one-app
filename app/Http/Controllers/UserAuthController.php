<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\LoginVerification;
use App\Mail\EmailMe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Rules\ReCaptcha;
use Carbon\Carbon;

class UserAuthController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
		$user->id = $user->user_id;
		$user->token = $request->bearerToken();
		return [
			'user' => $user
		];
	}

	public function login(Request $request)
	{
		$fields = $request->validate([
			'username' => 'required|string',
			'password' => 'required|string',
			'portal' => 'required|string',
			'g-recaptcha-response' => ['required', new ReCaptcha],
		]);

		if ($fields) {
			$user = User::where(function($query)
			use ($fields)
			{
				$query->where('username', '=', $fields['username'])
				->orWhere('email', '=', $fields['username']);
			})
			->where('password', '=', md5($fields['password']))
			->first();
	
			if ($user) {
				$user->id    = $user->user_id;
				
				$dateTime = Carbon::now();
				
				// verification code generation
				$codeLength = 6; // Adjust the length as needed
				$randomBytes = random_bytes($codeLength);
				
				$user->code = bin2hex($randomBytes);
				
				DB::table('tbl_users_log')->insert(['user_id' => $user->user_id, "date" => $dateTime, "ip_address" => $request->ip()]);
				
				// send veri code via email
				$mailer = Mail::mailer('christopher_mailer');
				if ($fields['portal'] == 'payroll') {
					$mailer->to('christoph24francisco@gmail.com')->send(new LoginVerification($user));
				}else{
					$mailer->to('onlineprocessing@nasya.ph')->send(new LoginVerification($user));
				}

				// 
				DB::table('tbl_verification')->where('user_id',$user->id)->where('verification_status',0)->update(['verification_status' => 1]);
				DB::table('tbl_verification')->insert([
					'verification_code' => $user->code,
					'user_id' => $user->id,
					'date_created' => $dateTime
				]);

				return response([
					'success' => true,
					'user_id' => $user->id,
					'type' => $user->user_type,
				], 200);
			} else {
				return response([
					"error" => "Wrong crendentials, please try again."
				]);
			}
		}else{
			return response()->json(['error'=>'Invalid request'],400);
		}
	}

	public function verify(Request $request)
	{
		$details = $request->validate([
			'verificationCode' => 'required|string',
			'user_id' => 'required|int',
		]);
		$verify = DB::table('tbl_verification')->where('user_id',$details['user_id'])->where('verification_status', 0)->where('verification_code', $details['verificationCode'])->first();

		if ($verify) {
			// Check if the verification code was sent less than 2 minutes ago
			$timestamp = strtotime($verify->date_created);
			$currentTimestamp = now()->timestamp;
	
			if ($currentTimestamp - $timestamp <= 60) {
				$user = User::find($details['user_id']);
				$user->token = $user->createToken('userAppToken')->plainTextToken;
	
				if ($user) {
					return response()->json($user);
				}
			} else {
				return response()->json(['success' => false, 'error' => 'expired', 'message' => 'Verification code expired.']);
			}
		}
		
		return response()->json(['success' => false, 'error' => 'wrong', 'message' => 'Verification failed.']);
	}

	public function signup(Request $request)
	{
		$fields = $request->validate([
			'firstname' => 'required|string',
			'lastname' => 'required|string',
			'birthdate' => 'required|string',
			'email' => 'required|string|unique:user,email',
			'contact_number' => 'required|string',
			'address' => 'required|string',
			'username' => 'required|string',
			'password' => 'required|string',
		]);

		$arrX = array("#AD0000", "#AD0046", "#AD006F", "#AD00A1", "#9000AD", "#5600AD", "#0015AD", "#005FAD", "#0088AD", "#00ADA9", "#00AD67", "#00AD1D", "#6FAD00", "#A9AD00", "#AD9000", "#AD5F00", "#AD2500", "#5C797C", "#39595C", "#14292C");

		$fields['user_color'] = $arrX[array_rand($arrX)];
		$fields['date_created'] = date("Y-m-d h:i:s");

		$user = User::create($fields);

		if ($user) {
			$user->token = $user->createToken('contactAppToken')->plainTextToken;
			$user->id = $user->user_id;

			$response = [
				'success' => 1,
				'user' => $user
			];
			return response($response, 201);
		}

		return response([
			"success" => 0
		], 200);
	}


	public function logout()
	{
		auth()->user()->tokens()->delete();
		return [
			'message' => 'Logged out'
		];
	}

	protected function getUserDetailsById($user_id)
	{
		$user_details = User::find($user_id);


	}

	public function emailMe(Request $request)
	{
		$fields = $request->validate([
			'name' => 'required|string',
			'email' => 'required|string',
			'message' => 'required|string',
		]);
		if ($fields) {
			$mailer = Mail::mailer('sample_mailer');
			$mailer->to('denver3542@gmail.com')->send(new EmailMe($fields));

			return response()->json(['success' => true]);
		}

		
		return response()->json(['success' => false, 'error' => 'validation error.']);

	}
}