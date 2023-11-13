<?php

use App\Http\Controllers\CallSchedulingController;
use App\Http\Controllers\ContactAuthController;
use App\Http\Controllers\FormsController;
use App\Http\Controllers\HrApplicationsController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\MySupportController;
use App\Http\Controllers\PortalUpdatesController;
use App\Http\Controllers\ReviewMaterialsController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\PracticeTestsController;
use App\Http\Controllers\ReferralController;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\HrAttendanceController;
use App\Http\Controllers\HrDashboardController;
use App\Http\Controllers\HrEmployeesController;
use App\Http\Controllers\HrPayrollController;
use App\Http\Controllers\HrProfileController;
use App\Http\Controllers\HrStatusController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HrPayrollSummaryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CorporateController;
use App\Http\Controllers\FinanceTransactionController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CoachingController;
use App\Models\HrApplications;
use App\Mail\ReferralMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;

Route::post('/auth/signup', [ContactAuthController::class, 'signup']);
Route::post('/auth/login', [ContactAuthController::class, 'login']);

Route::post('/signup', [UserAuthController::class, 'signup']);
Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/verify', [UserAuthController::class, 'verify']);

Route::post('/user/forgot-password', [ContactAuthController::class, 'forgotPasswordAction']);
// Social Login
Route::post('/social/login/facebook', [ContactAuthController::class, 'facebook']);
Route::post('/social/login/google', [ContactAuthController::class, 'google']);
Route::post('/social/login/apple', [ContactAuthController::class, 'apple']);
Route::post('/emailMe', [UserAuthController::class, 'emailMe']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
	// ---------------------------------------------------------------- Client routes ----------------------------------------------------------------
	Route::get('/auth', [UserAuthController::class, 'index']);
	Route::post('/auth/logout', [ContactAuthController::class, 'logout']);
	Route::get('/user/delete', [ContactAuthController::class, 'deleteAccount']);
	Route::post('/logout', [UserAuthController::class, 'logout']);
	Route::put('/user/update-user', [ContactAuthController::class, 'updateProfile']);
	Route::get('/users/{userId}', [ContactAuthController::class, 'getUserDetailsById']);
	Route::put('/auth/push-token', [ContactAuthController::class, 'addPushToken']);
	Route::put('/user/link-facebook', [ContactAuthController::class, 'linkFacebookAccount']);
	Route::put('/user/link-google', [ContactAuthController::class, 'linkGoogleAccount']);
	Route::post('/user/image-upload', [ContactAuthController::class, 'imageUpload']);

	// Dashboard
	Route::get('/dashboard', [DashboardController::class, 'getTotals']);
	Route::get('/dashboard1', [DashboardController::class, 'getTotals1']);
	Route::get('/dashboard/assignedTasks', [DashboardController::class, 'getAssignedTasks']);

	// News Feed Routes
	Route::get('/portalUpdates/news-feeds', [PortalUpdatesController::class, 'index']);
	Route::post('/portalUpdates/news-feeds/like-or-unlike', [PortalUpdatesController::class, 'likeUnlikeFeed']);
	Route::post('/portalUpdates/news-feeds/post-comment', [PortalUpdatesController::class, 'commentFeed']);

	// FAQS
	Route::get('portalUpdates/faqs', [PortalUpdatesController::class, 'getFAQS']);

	// Notifications
	Route::get('/user/notifications', [PortalUpdatesController::class, 'portalUpdatesNotifications']);
	Route::put('/user/notifications/mark-notifications', [PortalUpdatesController::class, 'portalUpdatesMarkNotifications']);

	// PortalUpdate Navigation
	Route::get('/navigation/{type}', [PortalUpdatesController::class, 'getPortalUpdateNavigation']);

	// Hr employees
	Route::get('/employees', [HrEmployeesController::class, 'getEmployee']);
	Route::get('/additional_benefits/{type}', [HrEmployeesController::class, 'getAdditionalBenefits']);
	Route::get('/search-employees/{id}', [HrEmployeesController::class, 'searchEmployees']);
	Route::get('/get_events', [HrEmployeesController::class, 'getCalendarEvents']);
	Route::put('/edit-employees/{id}', [HrEmployeesController::class, 'editEmployee']);
	Route::put('/delete-employees/{id}', [HrEmployeesController::class, 'deleteEmployee']);
	Route::post('/add-employees', [HrEmployeesController::class, 'addEmployee']);
	Route::post('/add_event', [HrEmployeesController::class, 'addCalendarEvent']);
	Route::post('/delete_events', [HrEmployeesController::class, 'deleteCalendarEvent']);
	Route::post('/add_additional_benefits', [HrEmployeesController::class, 'AddAdditionalbenefits']);
	Route::post('/delete_additional_benefits', [HrEmployeesController::class, 'deleteAdditionalbenefits']);
	
	// Hr Benefits
	Route::get('/benefits', [HrEmployeesController::class, 'getBenefits']);
	Route::post('/add_benefits', [HrEmployeesController::class, 'addBenefits']);
	Route::post('/delete_benefits', [HrEmployeesController::class, 'deletebenefits']);

	// Hr Loans
	Route::get('/loans', [HrEmployeesController::class, 'getLoans']);
	Route::post('/add_loans', [HrEmployeesController::class, 'addLoans']);
	Route::post('/delete_loans', [HrEmployeesController::class, 'deleteLoans']);

	// Hr Contribution
	Route::get('/contribution', [HrEmployeesController::class, 'getContribution']);
	Route::post('/add_contribution', [HrEmployeesController::class, 'addContribution']);
	Route::post('/delete_contribution', [HrEmployeesController::class, 'deleteContribution']);
	
	// Hr status
	Route::get('/status', [HrStatusController::class, 'getStatus']);
	Route::post('/add-status', [HrStatusController::class, 'addStatus']);
	Route::put('/delete-status/{id}', [HrStatusController::class, 'deleteStatus']);
	Route::post('/add-workdays', [HrStatusController::class, 'addWorkDays']);

	// Hr Dashboard 
	Route::get('/dashboard_employees/{dateToday}', [HrDashboardController::class, 'getEmployees']);
	Route::get('/dashboard_recentAttendance/{dateToday}', [HrDashboardController::class, 'getAttendances']);
	Route::get('/dashboard_recentApplication/{dateToday}', [HrDashboardController::class, 'getApplications']);
	Route::get('/dashboard_Analytics/{date}', [HrDashboardController::class, 'getAnalytics']);

	// Hr attendance
	Route::get('/attendance', [HrAttendanceController::class, 'getAttendance']);
	Route::get('/getModalAttendanceView/{userData}', [HrAttendanceController::class, 'getModalAttendanceView']);
	Route::post('/add-attendance', [HrAttendanceController::class, 'addAttendance']);
	Route::post('/get-attendance', [HrAttendanceController::class, 'getAllAttendance']);
	Route::post('/updateHrAttendance', [HrAttendanceController::class,'updateHrAttendance']);
	Route::post('/getWorkday', [HrAttendanceController::class, 'getWorkdayID']);
	Route::post('/deleteAttendanceView', [HrAttendanceController::class, 'deleteAttendance']);
	
	// Hr applications
	Route::get('/applications', [HrApplicationsController::class, 'getApplications']);
	Route::post('/delete_applications', [HrApplicationsController::class, 'deleteApplications']);
	Route::get('/get_appplication_status', [HrApplicationsController::class, 'getApplicationStatus']);
	Route::post('/add-application-status', [HrApplicationsController::class, 'addApplicationStatus']);
	Route::post('/update-application', [HrApplicationsController::class, 'addApplication']);
	Route::put('/delete-application-status/{id}', [HrApplicationsController::class, 'deleteAppStatus']);
	Route::post('/add-applications-list', [HrApplicationsController::class, 'addAppList']);
	Route::get('/applications_list', [HrApplicationsController::class, 'getApplicationsList']);
	Route::post('/add_type_application',[HrApplicationsController::class,'addNewType']);
	Route::post('/delete_type_application',[HrApplicationsController::class, 'deleteApplicationList']);

	// Hr payroll 
	Route::post('/payroll_benefits', [HrPayrollController::class, 'getPayrollBenefits']);
	Route::get('/payroll/{dates}', [HrPayrollController::class, 'getPayroll']);
	Route::get('/payroll/unextended/{dates}', [HrPayrollController::class, 'getUnextendedPayroll']);
	Route::get('/payroll/extended/{dates}', [HrPayrollController::class, 'getExtendedPayroll']);
	Route::get('/getPayrollRecord/{dates}', [HrPayrollController::class, 'getPayrollRecord']);
	Route::get('/getPayrollSummary/{dates}', [HrPayrollSummaryController::class, 'getPayrollSummary']);
	Route::get('/payrollRecordBenefits/{id}', [HrPayrollController::class, 'getPayrollRecordBenefits']);
	Route::post('/payrollRecordEarnings', [HrPayrollController::class, 'getPayrollRecordEarnings']);
	Route::post('/add_payroll_summary_employee', [HrPayrollSummaryController::class, 'addPayrollSummaryEmployee']);
	Route::post('/delete_payroll_summary_employee', [HrPayrollSummaryController::class, 'deletePayrollSummaryEmployee']);
	Route::post('/save_payroll', [HrPayrollController::class, 'savePayroll']);
	Route::post('/update_payrollBenefits', [HrPayrollController::class, 'updateManualBenefits']);
	Route::post('/delete_payrollBenefits', [HrPayrollController::class, 'deleteManualBenefits']);
	Route::put('/update_payroll/{id}', [HrPayrollController::class, 'updatePayroll']);
	Route::put('/update_payrollVisibility/{id}', [HrPayrollController::class, 'updatepayrollVisibility']);
	Route::put('/update_payrollHide/{id}', [HrPayrollController::class, 'updatepayrollHide']);
	Route::put('/update_payrollDelete/{id}', [HrPayrollController::class, 'updatepayrollDelete']);

	// Hr Profile
	Route::get('/profile/userData/{id}', [HrProfileController::class, 'getUserData']);
	Route::get('/payrollHistory/{id}', [HrProfileController::class, 'getPayrollHistory']);

	// Services Routes
	Route::get('/services', [ServicesController::class, 'index']);
	Route::get('services/requirements/{taskId}', [ServicesController::class, 'allRequirements']);
	Route::get('services/field/{spaceId}', [ServicesController::class, 'allFields']);
	Route::get('/services/finance-phase/{spaceId}', [ServicesController::class, 'financePhaseBySpaceId']);
	Route::get('/services/procedures', [ServicesController::class, 'allProcedures']);
	Route::get('/services/payment-transactions', [ServicesController::class, 'getPaymentTransaction']);
	Route::get('/services/space', [ServicesController::class, 'getSpaces']);
	Route::get('/services/list/{list_id}', [ServicesController::class, 'getListData']);                     // get Steps and its statuses data accordingly.
	Route::get('/services/status_clients/{status_id}', [ServicesController::class, 'getClientsByStatus']);  // get Steps and its statuses data accordingly.
	Route::get('/services/task/{task_id}', [ServicesController::class, 'getTaskData']);  // get Steps and its statuses data accordingly.

	// Referrals
	Route::get('/referrals', [ReferralController::class, 'getReferrals']);
	Route::get('/referrals/all', [ReferralController::class, 'index']);
	Route::get('/referrals/show/{id}', [ReferralController::class, 'show']);
	Route::get('/referrals/comments/{id}', [ReferralController::class, 'getReferralCommentsById']);
	Route::delete('/referrals/comments/{id}', [ReferralController::class, 'destroy']);
	Route::post('/referrals/add_comment', [ReferralController::class, 'add_comment']);
	Route::put('/referrals', [ReferralController::class, 'claimAmount']);

	// Manage Clients
	Route::get('/clients', [ContactController::class, 'index']);
	Route::get('/clients/{id}', [ContactController::class, 'show']);
	Route::get('/clients/fields/{id}', [ContactController::class, 'shownCustomFields']);

	// Forms
	Route::get('/portalUpdates/forms', [FormsController::class, 'index']);
	Route::get('/portalUpdates/forms/{formId}', [FormsController::class, 'getFormFieldInputById']);
	Route::put('/portalUpdates/forms', [FormsController::class, 'editForm']);
	
	
	// Review Materials
	Route::get('/portalUpdates/review-material', [ReviewMaterialsController::class, 'index']);
	Route::get('/portalUpdates/review-material/{materialId}', [ReviewMaterialsController::class, 'getReviewMaterialById']);

	// Portal Updates
	Route::get('/portalUpdates/practice-test/tests', [PracticeTestsController::class, 'index']);
	Route::get('/portalUpdates/practice-test/{test_id}', [PracticeTestsController::class, 'show']);
	Route::get('/portalUpdates/practice-test/result/{test_id}', [PracticeTestsController::class, 'showResult']);
	Route::post('/portalUpdates/practice-test/submit-answer', [PracticeTestsController::class, 'submitAnswer']);
	Route::post('/portalUpdates/practice-test/update-result', [PracticeTestsController::class, 'updateResult']);
	Route::get('/portalUpdates/practice-test/correct-answer-count/{testId}', [PracticeTestsController::class, 'correctAnswerCount']);

	// Call Scheduling
	Route::get('/callScheduling/schedules', [CallSchedulingController::class, 'index']);
	Route::post('/callScheduling/schedules', [CallSchedulingController::class, 'create']);

	// Mailer routes
	
	Route::get('/mail', [MailController::class, 'referralConfirmationMail']);
	Route::get('/sendPayrollMail/{id}', [MailController::class, 'payrollMail']);

	// My Support
	
	Route::post('/addmysupport', [MySupportController::class, 'create']);
	Route::get('/addmysupport/{id}', [MySupportController::class, 'show']);
	Route::put('/addmysupport/{id}', [MySupportController::class, 'update']);
	Route::delete('/addmysupport/{id}', [MySupportController::class, 'delete']);
	Route::get('/mySupport', [MySupportController::class, 'getMySupport']);

	// ---------------------------------------------------------------- End Client Routes ----------------------------------------------------------------

	// ---------------------------------------------------------------- Users Routes ----------------------------------------------------------------
	
	Route::get('/user/{user_id}', [UserAuthController::class, 'getUserDetailsById']);
	Route::get('/services/all', [ServicesController::class, 'getServices']);
	Route::get('/services/financePhase/{phase_id}', [ServicesController::class, 'getFinancePhaseById']);
	Route::get('/services/requirementsFields/{service_id}', [ServicesController::class, 'getRequirementsBySpace']);
	Route::get('/services/requirement/{requirement_id}', [ServicesController::class, 'getRequirementById']);
	Route::get('/services/allWithLists', [ServicesController::class, 'getServicesWithLists']);
	Route::get('/services/lists/{list_id}', [ServicesController::class, 'showList']);
	Route::get('/services/lists/statuses/{list_id}', [ServicesController::class, 'showStatusesByList']);
	Route::post('/services/lists/statuses/sort', [ServicesController::class, 'sortStatuses']);
	Route::get('/services/lists/status/{list_id}', [ServicesController::class, 'showStatus']);
	Route::put('/services/lists/status/update', [ServicesController::class, 'updateStatus']);
	Route::delete('/services/lists/status/delete/{status_id}', [ServicesController::class, 'deleteStatus']);
	Route::post('/services/lists/status/add', [ServicesController::class, 'addStatus']);
	Route::get('/services/lists/tags/{list_id}', [ServicesController::class, 'showTagsByList']);
	Route::get('/services/lists/finance/{service_id}', [ServicesController::class, 'showFinanceByService']);
	Route::get('/services/{service_id}', [ServicesController::class, 'show']);
	Route::put('/services/updateServiceName', [ServicesController::class, 'updateServiceName']);
	Route::put('/services/updateListName', [ServicesController::class, 'updateListName']);
	Route::put('/services/updateRequirementName', [ServicesController::class, 'updateRequirementName']);
	Route::put('/services/updateRequirementOption', [ServicesController::class, 'updateRequirementOption']);
	Route::post('/services/requirements/sort', [ServicesController::class, 'saveSortedRequirements']);
	Route::post('/services/addNewList', [ServicesController::class, 'createList']);
	Route::post('/services/requirements/addNewRequirement', [ServicesController::class, 'addNewRequirement']);
	Route::post('/services/addNewRequirementOption', [ServicesController::class, 'createReqOption']);
	Route::delete('/services/requirement/{requirement_id}', [ServicesController::class, 'deleteRequirementField']);
	Route::delete('/services/deleteRequirementOption/{requirement_id}', [ServicesController::class, 'deleteRequirementOption']);
	Route::put('/services/finance/editName', [ServicesController::class, 'updateFinanceOptionName']);
	Route::delete('/services/finance/finance_option/{id}', [ServicesController::class, 'deleteFinanceOption']);
	Route::post('/services/finance/finance_option/add', [ServicesController::class, 'createFinanceOption']);
	Route::put('/services/finance/finance_option/update', [ServicesController::class, 'updateFinanceOption']);
	Route::put('/services/finance/sortFields', [ServicesController::class, 'sortFinanceFields']);
	Route::put('/services/finance/updateFinanceName', [ServicesController::class, 'updateFinanceName']);
	Route::post('/services/finance/add', [ServicesController::class, 'createFinancePhase']);
	Route::delete('/services/finance/{id}', [ServicesController::class, 'deleteFinancePhase']);
	Route::delete('/services/tags/{id}', [ServicesController::class, 'deleteTag']);
	Route::get('/services/tags/{id}', [ServicesController::class, 'showTag']);
	Route::put('/services/tags/update', [ServicesController::class, 'updateTag']);
	Route::post('/services/tags/add', [ServicesController::class, 'createTag']);
	Route::get('/services/steps/all', [ServicesController::class, 'stepsWithStatuses']);
	Route::post('/services/steps/add', [ServicesController::class, 'addStep']);
	Route::put('/services/steps/update', [ServicesController::class, 'updateStep']);
	Route::delete('/services/steps/delete/{step_id}', [ServicesController::class, 'deleteStep']);
	Route::get('/services/fields/{service_id}', [ServicesController::class, 'showFieldByServiceId']);
	Route::post('/services/fields/sort', [ServicesController::class, 'sortFields']);
	Route::post('/services/fields/add', [ServicesController::class, 'addField']);
	Route::put('/services/fields/update', [ServicesController::class, 'updateField']);
	Route::delete('/services/fields/{field_id}', [ServicesController::class, 'deleteField']);
	Route::get('/services/fields/options/{field_id}', [ServicesController::class, 'fetchFieldOptions']);
	Route::delete('/services/fields/options/{field_id}', [ServicesController::class, 'deleteFieldOptions']);
	Route::put('/services/fields/options/update', [ServicesController::class, 'updateOptionFieldname']);
	Route::put('/services/fields/options/updateIcon', [ServicesController::class, 'updateOptionFieldIcon']);
	Route::post('/services/fields/options/add', [ServicesController::class, 'addOptionField']);
	Route::post('/services/fields/fix', [ServicesController::class, 'migrateAssignedStatusFields']);
	Route::get('/services/fields/statuses/{list_id}', [ServicesController::class, 'fetchFieldsWithStatuses']);
	Route::delete('/services/fields/statuses/{field_id}', [ServicesController::class, 'unassignFieldToStatus']);
	Route::get('/services/fields/unassigned/{list_id}', [ServicesController::class, 'fetchUnassignedFields']);
	Route::put('/services/fields/assign', [ServicesController::class, 'assignFieldToStatus']);
	Route::get('/services/status', [ServicesController::class, 'getAllStatuses']);

	// ---------------------------------------------------------------- Accounting Routes ----------------------------------------------------------------
	
	Route::put('/accounting/transaction/gross', [AccountingController::class, 'addTransactionToGross']);
	Route::get('/accounting/dashboard', [AccountingController::class, 'index']);
	Route::get('/accounting/transactions', [AccountingController::class, 'transactions2']);
	Route::get('/accounting/transactions2', [AccountingController::class, 'transactions']);
	Route::post('/accounting/fees/sort', [AccountingController::class, 'sortTransactionFees']);
	Route::get('/accounting/allSales', [AccountingController::class, 'allSales']);
	Route::get('/accounting/summaryTransactions', [AccountingController::class, 'summaryTransactions']);
	Route::get('/accounting/accounts', [AccountingController::class, 'getAccounts']);
	Route::get('/accounting/methods', [AccountingController::class, 'getMethods']);
	Route::put('/accounting/pay', [AccountingController::class, 'payLiability']);
	Route::get('/accounting/edit/{id}', [AccountingController::class, 'edit']);
	Route::put('/accounting/update', [AccountingController::class, 'update']);
	Route::get('/accounting/fetchTransactionsByClientPhase/{id}', [AccountingController::class, 'fetchTransactionsByClientPhase']);
	Route::get('/accounting/admin/transactionById/{id}', [AccountingController::class, 'transactionById']);
	Route::get('/accounting/rate', [AccountingController::class, 'getRate']);
	Route::get('/accounting/remittance', [AccountingController::class, 'remittance']);
	Route::get('/accounting/remittance/{title}', [AccountingController::class, 'remittanceByTitle']);
	Route::get('/accounting/chartOfAccounts', [AccountingController::class, 'chartOfAccounts']);
	Route::get('/accounting/invoice', [AccountingController::class, 'getInvoices']);
	Route::get('/accounting/invoice/{id}', [AccountingController::class, 'getInvoicesById']);
	Route::get('/accounting/invoice/task/{id}', [AccountingController::class, 'getInvoicesByTask']);
	Route::post('/accounting/invoice/mail/send', [AccountingController::class, 'sendInvoice']);

	// ---------------------------------------------------------------- Corporate Routes ----------------------------------------------------------------

	Route::get('/corporate', [CorporateController::class, 'index']);
	Route::get('/corporate/{corporate_id}', [CorporateController::class, 'show']);
	Route::get('/corporate/customFields/{service_id}', [CorporateController::class, 'customFields']);
	Route::post('/corporate/setFieldShow', [CorporateController::class, 'setFieldShow']);
	Route::post('/corporate/setFieldHide', [CorporateController::class, 'setFieldHide']);
	
	// ---------------------------------------------------------------- Finance Transaction Routes ----------------------------------------------------------------
	
	Route::post('/finance/addPayment', [FinanceTransactionController::class, 'paymentSettle']);
	Route::post('/finance/addPaymentBlast', [FinanceTransactionController::class, 'paymentSettleBlast']);
	Route::post('/finance/migrate', [FinanceTransactionController::class, 'migrateTransactionsToAccounting']);
	Route::post('/finance/migrate/individual', [FinanceTransactionController::class, 'migrateTransactionToAccounting']);
	
	// ---------------------------------------------------------------- Tasks Routes ----------------------------------------------------------------
	
	Route::get('/tasks/duetasks', [TaskController::class, 'getAllUsersWithDueTasks']);
	Route::get('/tasks/data/{task_id}', [TaskController::class, 'show']);
	Route::get('/tasks/user/{task_id}', [TaskController::class, 'getContactByTaskId']);
	Route::get('/task/tags/{task_id}', [TaskController::class, 'getTaskTags']);
	Route::get('/task/assignedUsers/{task_id}', [TaskController::class, 'getAssignedUsersByTaskId']);
	Route::get('/tasks/note/{task_id}', [TaskController::class, 'getTaskNote']);
	Route::get('/tasks/statuses/{list}', [TaskController::class, 'getStatusesByListId']);
	Route::put('/tasks/setPriority', [TaskController::class, 'setPriority']);
	Route::post('/tasks/saveTaskNote', [TaskController::class, 'setNote']);

	// ---------------------------------------------------------------- Basic Admin Routes ----------------------------------------------------------------

	
	Route::get('/admin/emails', [AdminController::class, 'emails']);
	
	// ---------------------------------------------------------------- Coaching Routes ----------------------------------------------------------------

	Route::get('/coaching', [CoachingController::class, 'index']);
	Route::post('/coaching/add', [CoachingController::class, 'store']);
	Route::post('/coaching/update', [CoachingController::class, 'update']);
	Route::delete('/coaching/delete/{id}', [CoachingController::class, 'destroy']);
	Route::get('/coaching/{id}', [CoachingController::class, 'show']);


	
	Route::get('/loginLogs', [AdminController::class, 'logs']);
});