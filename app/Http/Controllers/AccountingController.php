<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentSettle;
use App\Models\AccountingPaidTransaction;
use App\Models\AccountingAccount;
use App\Models\AccountingMethod;
use App\Models\AccountingInvoice;
use App\Models\AccountingGlobalRate;
use App\Models\FinanceFieldHide;
use App\Models\FinanceTransaction;
use App\Models\FinanceFieldCA;
use App\Models\FinanceDiscount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\InvoiceMail;
use Carbon\Carbon;
use PDF;

class AccountingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            // get net income
            $netQuery = PaymentSettle::selectRaw('COUNT(settle_id) as count, SUM(settle_amount) as net')->first();
            $income = round($netQuery->net,2) ?? 0;
            $transCount = $netQuery->count ?? 0;

            // get gross
            $gross = PaymentSettle::where('account_type', 2)->sum('settle_amount');

            // get service expense
            $expense = AccountingPaidTransaction::where('tbl_accounting_paid_transactions.transaction_id', '!=', 0)->sum('amount_paid');

            // get personal expense
            $personal_expense = AccountingPaidTransaction::where('tbl_accounting_paid_transactions.transaction_id', '=', 0)->sum('amount_paid');

            // get total liability
            $liability = PaymentSettle::doesntHave('paid')->sum('settle_amount');
            $liability = round($liability,2);

            // get total discount
            $discount = PaymentSettle::where('discount', '!=' , 0)->sum('discount');
            $discount = round($discount,2);

            // Sales Graph Data Weekly
            $weeklyPaymentData = PaymentSettle::getWeeklyPaymentData();

            $total_expense = $expense+$personal_expense+$discount;
            $net = $gross-$personal_expense+$discount;
            
            return response()->json([
                'totals' => [
                    [
                        "name" =>'Income',
                        'value' => $income,
                        "slug" => 'income'
                    ],
                    [
                        "name" =>'Expense',
                        'value' => $total_expense,
                        "slug" => 'expense'
                    ],
                    [
                        "name" =>'Liability',
                        'value' => $liability,
                        "slug" => 'liability'
                    ],
                    [
                        "name" =>'Net Income',
                        'value' => $net,
                        "slug" => 'net'
                    ],
                ],
                'expenses' => [
                    [
                        "title" => "Personal Expenses",
                        "value" => $personal_expense,
                        "slug" => "personal_expenses"
                    ],
                    [
                        "title" => "Liability Expenses",
                        "value" => $expense,
                        "slug" => "liability_expenses"
                    ],
                    [
                        "title" => "Total Discount",
                        "value" => $discount,
                        "slug" => "discount"
                    ]
                ],
                'gross' => $gross,
                'transaction_count' => $transCount,
                'weeklyPaymentData' => $weeklyPaymentData
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
    
    public function allSales(Request $request)
    {
        try{
            
            $from = $request->input("from");
            $to = $request->input("to");

            $total_amount = 0;
            $total_liability = 0;
            $total_gross = 0;
            $transactionsQuery = PaymentSettle::with([
                    'financeField'=> function ($query) {
                    $query->select('finance_id', 'finance_name');
                },'financePhase' => fn ($query) =>
                    $query->select('phase_id', 'phase_name', 'phase_space_id')->with('space:space_id,space_name')
                , 'task' => fn ($query) =>
                    $query->select('task_id', 'task_contact')->with('client:contact_id,contact_fname,contact_mname,contact_lname')
                , 'financeTransaction', 
                'paid' => fn ($query) => $query->with('paidBy')
                ])->select(
                    'settle_id',
                    'phase_id',
                    'finance_id',
                    'task_id',
                    'user_id',
                    'settle_amount',
                    'date_created',
                    'status',
                    'account_type',
                    'rate',
                    'client_rate'
                );
                // if date from and to is null then fetch all by removing wherebetween
                if ($from && $to) {
                    $transactionsQuery->whereBetween('date_created', [$from, $to]);
                }
                
                $transactions = $transactionsQuery->get();

                foreach($transactions as $transaction){
                    $date = Carbon::parse($transaction->date_created);
                    $formattedDate = $date->toDateString();
                    $transaction->date_created = $formattedDate;
                    $total_amount += $transaction->settle_amount;
                    if ($transaction->account_type === 1) {
                        $total_liability += $transaction->settle_amount;
                    }
                    else if ($transaction->account_type === 2) {
                        $total_gross += $transaction->settle_amount;
                    }
                    if ($transaction->paid) {
                        $total_gross += $transaction->settle_amount - $transaction->paid->amount_paid;
                    }
                }

            return response()->json(['transactions' => $transactions, 'total_amount' => $total_amount, 'gross' => $total_gross, 'liability' => $total_liability]);
        }
        catch(\Exception $e){
            throw($e);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function transactions()
    {
        try{
            $transactions = PaymentSettle::with([
                'financePhase' => function ($query) {
                    $query->select('phase_id', 'phase_name', 'phase_space_id');
                    $query->with('space:space_id,space_name');
                },
                'task' => function ($query) {
                    $query->select('task_id', 'task_contact');
                    $query->with('client:contact_id,contact_fname,contact_mname,contact_lname');
                },
                'financeTransaction'
            ])->select(
                'settle_id',
                'phase_id',
                'finance_id',
                'task_id',
                'user_id',
                'settle_amount',
                'date_created',
                'status',
                'account_type',
                'rate',
                'transaction_id',
                'client_rate'
            )
            ->groupBy('transaction_id')
            ->orderByDesc('date_created')->get();
            
            $transactionById = array();
            $transactions->map(function ($transaction) {
                $transaction->date_created = Carbon::parse($transaction->date_created)->toDateString();
            });
            foreach ($transactions as $key => $value) {
                if ($value->task_id == 22172) {
                    $transactionById[] = $value;
                }
            }

            return response()->json($transactionById);
        }
        catch(\Exception $e){
            throw($e);
        }
    }
    public function transactions2()
    {
        try{
            $transactions = PaymentSettle::with([
                'financePhase' => function ($query) {
                    $query->select('phase_id', 'phase_name', 'phase_space_id');
                    $query->with('space:space_id,space_name');
                },
                'task' => function ($query) {
                    $query->select('task_id', 'task_contact');
                    $query->with('client:contact_id,contact_fname,contact_mname,contact_lname');
                },
                'financeTransaction'
            ])->select(
                'settle_id',
                'phase_id',
                'finance_id',
                'task_id',
                'user_id',
                'settle_amount',
                'date_created',
                'status',
                'account_type',
                'rate',
                'transaction_id',
                'client_rate'
            )->groupBy('transaction_id')
            ->orderByDesc('date_created')->get();
            
            $transactions->map(function ($transaction) {
                $transaction->date_created = Carbon::parse($transaction->date_created)->toDateString();
            });

            return response()->json($transactions);
        }
        catch(\Exception $e){
            throw($e);
        }
    }

    /**
     * Data fetch the accounting summary of transactions paid
     *
     * @return \Illuminate\Http\Response
     */
    public function summaryTransactions(Request $request)
    {
        try{
            $user = $request->user();
            $user_type = $user->user_type;
            $user_id = $user->user_id;

            $transactions = PaymentSettle::with([
                'financeField' => fn ($query) => $query->select('finance_id', 'finance_name'),
                'financePhase' => fn ($query) => $query->select('phase_id', 'phase_name', 'phase_space_id')->with('space:space_id,space_name'),
                'task' => fn ($query) => $query->select('task_id', 'task_contact')->with('client:contact_id,contact_fname,contact_mname,contact_lname'),
                'paid' => fn ($query) => $query->with('paidBy','account:account_id,name')
            ])
            ->has('paid')
            ->select(
                'settle_id',
                'phase_id',
                'finance_id',
                'task_id',
                'user_id',
                'settle_amount',
                'date_created',
                'status',
                'account_type',
                'rate',
                'client_rate'
            )
            ->orderByDesc('date_created')
            ->get();

            $transactions->transform(function ($transaction) {
                $transaction->date_created = Carbon::parse($transaction->date_created)->format('m/d/Y');
                return $transaction;
            });

            if ($user_type == 'Admin' || $user_type == 'Supervisory') {
                return response()->json($transactions);
            } else {
                $assigned = $transactions->filter(function ($transaction) use ($user_id) {
                    return optional($transaction->paid)->paid_by == $user_id;
                })->values();

                return response()->json($assigned);
            }
        }
        catch(\Exception $e){
            throw($e);
        }
    }
    /**
     * Data fetch the accounting accounts
     *
     * @return \Illuminate\Http\Response
     */
    public function getAccounts()
    {
        $accounts = AccountingAccount::all();

        return response()->json($accounts);
    }

    /**
     * Data fetch the accounting methods
     *
     * @return \Illuminate\Http\Response
     */
    public function getMethods()
    {
        $accounts = AccountingMethod::all();

        return response()->json($accounts);
    }
    /**
     * Pay liability function
     *
     * @return \Illuminate\Http\Response
     */
    public function payLiability(Request $request)
    {
        try {
            $transaction_id = $request->input("transaction_id");
            $account_id = $request->input("account_id");
            $method_id = $request->input("method_select");
            $date = $request->input("add_date");
            $description = $request->input("description");
            $client_rate = $request->input("client_rate");
            $fee = $request->input("fee");
            $paid_amount = $request->input("amount_paid");
            $user  = $request->user();

            // check if transaction exists
            $is_paid = AccountingPaidTransaction::where('transaction_id', $transaction_id)->first();

            if ($is_paid) {
                return response()->json(['success' => false, 'message: ' => 'transaction already been processed'], 500);
            }
            $pay = AccountingPaidTransaction::create([
                "transaction_id"   =>$transaction_id,
                "account_id"       =>$account_id,
                "method_id"        =>$method_id,
                "date_paid"        =>$date,
                "description"      =>$description,
                "client_rate"      =>$client_rate,
                "amount"           =>$fee,
                "amount_paid"      =>$paid_amount,
                "paid_by"          =>$user->user_id
            ]);

            if (!$pay) {
                return response()->json(['success' => false, 'message error: ' => "Failed to insert to data."]);
            }

            $transaction = PaymentSettle::find($transaction_id)->update(['account_type' => 3]);
    
            return response()->json(['success' => true, 'message: ' => 'Successfully added payment']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message: ' => $th->getMessage(), 'data' => $transaction_id], 500);
        }
    }

    /**
     * Fetch transaction data by client and phase.
     *
     * @return \Illuminate\Http\Response
     */
    public function fetchTransactionsByClientPhase($id)
    {
        try {
            $transaction = PaymentSettle::with(['task' => fn ($query) => $query->select('task_id', 'task_contact')->with('client:contact_id,contact_fname,contact_mname,contact_lname,contact_location,contact_email,contact_cpnum', 'list')])->find($id);

            $task_id = $transaction->task_id;
            $phase_id = $transaction->phase_id;

            $transactions = PaymentSettle::with(['financeField','financePhase' => fn ($query) =>
            $query->select('phase_id', 'phase_name', 'phase_space_id')->with('space:space_id,space_name'), 'paid','task' => fn ($query) => $query->select('task_id', 'task_contact')->with('client:contact_id,contact_fname,contact_mname,contact_lname,contact_location,contact_email,contact_cpnum')])->where('phase_id',$phase_id)->where('task_id', $task_id)->get();

            return response()->json(['success' => true,'transaction' => $transaction, 'transactions' => $transactions]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()],500);
        }
    }

    /**
     * Fetch transaction data by payment id
     *
     * @return \Illuminate\Http\Response
     */
    public function transactionById($id)
    {
        try {
            $transaction = PaymentSettle::with([
                'financePhase' => fn($query) => $query->select('phase_id','phase_space_id','phase_name')->with('space:space_id,space_name'),
                'task' => fn ($query) => $query->select('task_id', 'task_contact')->with('client:contact_id,contact_fname,contact_mname,contact_lname,contact_location,contact_email,contact_cpnum')
                ])->find($id);

            $task_id = $transaction->task_id;
            $phase_id = $transaction->phase_id;

            $transactions = PaymentSettle::with(['financeField','financePhase' => fn ($query) =>
            $query->select('phase_id', 'phase_name', 'phase_space_id')->with('space:space_id,space_name'), 'paid','task' => fn ($query) => $query->select('task_id', 'task_contact')->with('client:contact_id,contact_fname,contact_mname,contact_lname,contact_location,contact_email,contact_cpnum')])->where('phase_id',$phase_id)->where('task_id', $task_id)->get();

            //  get total amount
            $total_amount = 0;
            foreach ($transactions as $tran) {
                $total_amount += $tran->settle_amount;
            }
            // get total amount paid
            $transaction->total_paid = FinanceTransaction::select('val_id','val_amount')->find($transaction->transaction_id);
            $transaction->discount = FinanceDiscount::select('discount_id','discount_amount')->where('discount_phase_id', $phase_id)->where('discount_assign_to', $task_id)->first();

            return response()->json(['success' => true,'transaction' => $transaction, 'transactions' => $transactions, 'total_amount' => $total_amount]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()],500);
        }
    }

    /**
     * Get recent rate.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRate()
    {
        $rate = AccountingGlobalRate::orderByDesc('date_created')->first();

        return response($rate->rate);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $payment = PaymentSettle::with('paid')->find($id);

        return response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            $user_id  = $request->user()->user_id;
            $payment = $request->validate([
                'paid_id' => 'required',
                'edit_account_id' => 'required',
                'edit_method_select' => 'required',
                'edit_description' => 'required',
                'edit_client_rate' => 'required',
                'edit_amount_paid' => 'required',
            ]);
    
            $paid = AccountingPaidTransaction::find($payment['paid_id']);
            $paid->update([
                'amount_paid' => $payment['edit_amount_paid'],
                'client_rate' => $payment['edit_client_rate'],
                'account_id' => $payment['edit_account_id'],
                'method_id' => $payment['edit_method_select'],
                'description' => $payment['edit_description'],
                'date_updated' => Carbon::today()->toDateString(),
                'updated_by' => $user_id,
            ]);

            return response()->json(['success' => true, 'message' => 'Successfully Updated!']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Something went wrong.', 'error' => $th->getMessage()], 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Add transaction to Gross
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function addTransactionToGross(Request $request)
    {
        try {
            $id = $request->input('id');
            $transaction = PaymentSettle::findOrFail($id);
            $transaction->update(['account_type' => 2]);
            $transaction->save();

            echo response()->json(['message' => 'success']);
        } catch (\Throwable $th) {
            echo response()->json(['message' => 'Failed to add transaction to gross', 'error' => $th->getMessage()], 500);
        }
    }

    public function remittance()
    {
        $remittance = PaymentSettle::selectRaw('Count(settle_id) as count, remittance, Sum(settle_amount) as total_income')
        ->groupBy('remittance')
        ->get();
        return response()->json($remittance);
    }
    public function remittanceByTitle($title)
    {
        $transactions = PaymentSettle::with(['financeField', 'financePhase' => fn ($qry) => $qry->with('space'), 'task'])
        ->where('remittance', $title)
        ->get();
        return response()->json($transactions);
    }
    public function chartOfAccounts()
    {
        $accounts = AccountingAccount::with('type','detail')->get();

        return response()->json($accounts);
    }

    public function getInvoices()
    {
        $accounts = AccountingInvoice::with('task','finance_phase')->get();

        return response()->json($accounts);
    }

    public function getInvoicesById($id)
    {
        $invoice = AccountingInvoice::with('task.client','finance_phase.fields')->findOrFail($id);

        $fields = array();
        if ($invoice) {
            foreach($invoice->finance_phase->fields as $field)
            {
                // check if field is hidden
                $hidden = FinanceFieldHide::where('hideshow_field_id', $field->finance_id)->where('hideshow_task_id', $invoice->task->task_id)->first();
                if (!$hidden) {
                    // check if field has custom amount
                    $custom_amount = FinanceFieldCA::where('custom_amount_task_id',$invoice->task->task_id)->where('custom_amount_field_id',$field->finance_id)->first();
                    if ($custom_amount) {
                        $field->finance_value = $custom_amount->custom_amount_value;
                    }
                    $fields[] = $field;
                }
            }
            $invoice->fees = $fields;
    
            // get payment info
            $payments = FinanceTransaction::selectRaw("SUM(`val_initial_amount`) AS `amount`")->where('val_phase_id', $invoice->phase_id)->where('val_assign_to', $invoice->task_id)->first();
            $invoice->payment = $payments['amount'];
    
            // // get discount info
            $discount = FinanceDiscount::select("discount_amount")->where('discount_phase_id', $invoice->phase_id)->where('discount_assign_to', $invoice->task_id)->first();
            if ($discount) {
                $invoice->discount = $discount['discount_amount'];
            }
        }
        return response()->json($invoice);
    }

    public function getInvoicesByTask(Request $request, $id)
    {
        $phase_id = $request->input('phase_id');

        // get invoice info
        $invoice = AccountingInvoice::with(['task.client','finance_phase.fields'])
        ->where('task_id',$id)
        ->where('phase_id', $phase_id)
        ->first();

        $fields = array();
        if ($invoice) {
            foreach($invoice->finance_phase->fields as $field)
            {
                // check if field is hidden
                $hidden = FinanceFieldHide::where('hideshow_field_id', $field->finance_id)->where('hideshow_task_id', $invoice->task->task_id)->first();
                if (!$hidden) {
                    // check if field has custom amount
                    $custom_amount = FinanceFieldCA::where('custom_amount_task_id',$invoice->task->task_id)->where('custom_amount_field_id',$field->finance_id)->first();
                    if ($custom_amount) {
                        $field->finance_value = $custom_amount->custom_amount_value;
                    }
                    $fields[] = $field;
                }
            }
            $invoice->fees = $fields;
    
            // get payment info
            $payments = FinanceTransaction::selectRaw("SUM(`val_initial_amount`) AS `amount`")->where('val_phase_id', $phase_id)->where('val_assign_to', $id)->first();
            $invoice->payment = $payments->amount;
    
            // get discount info
            $discount = FinanceDiscount::selectRaw("discount_amount as amount")->where('discount_phase_id', $phase_id)->where('discount_assign_to', $id)->first();
            $invoice->discount = (float)$discount->amount;
        }

        return response()->json($invoice);
    }
    
    public function sendInvoice(Request $request)
    {
        $recipientEmail = $request->input('recipientEmail');
        $htmlContent = $request->input('attachmentContent');
        $invoice_id = $request->input('invoice_id');
        $pdf = PDF::loadHTML($htmlContent);
        // Send the email with attachment
        $mailer = Mail::mailer('finance_mailer');
        $mailer->to($recipientEmail)->send(new InvoiceMail($pdf));

        return response()->json(['success' => true, 'message' => 'Email sent successfully']);
    }
}