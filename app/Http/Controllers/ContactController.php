<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Contact;
use App\Models\Space;
use App\Models\CorporateCustomField;
use App\Models\Field;
use App\Models\FieldChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;


class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where('contact_assign_to', '!=', '')
        ->select('contact_id','contact_fname','contact_mname','contact_lname','contact_email','contact_cpnum','contact_profile')
        ->get();

        return response($contacts);
    }
    public function add(Request $request)
    {
        $contact = new Contact;
        $contact->contact_fname = $request->contact_fname;
        $contact->contact_mname = $request->contact_mname;
        $contact->contact_lname = $request->contact_lname;
        $contact->contact_email = $request->contact_email;
        $contact->contact_cpnum = $request->contact_cpnum;
        $contact->contact_profile = $request->contact_profile;

    }

    public function show($taskId)
    {
        $task = Task::with('client','list','status')->findOrFail($taskId);
        return response()->json($task);
    }

    public function shownCustomFields($taskId)
    {
        $fields = array();
        $task = Task::with('client','list','status')->findOrFail($taskId);
        $facility_id = $task->facility_id;
        $service_id = $task->list->service->space_id;
        $service = Space::find($service_id);
        $service_custom_db_table = $service->space_db_table;
        
        $custom_tbl_data = DB::table($service_custom_db_table)->where('task_id', $taskId)->first();
        // allowed to be shown custom fields
        $allowed_custom_fields = CorporateCustomField::where('facility_id',$facility_id)->get();
        // Get custom field data from custom table
        foreach($allowed_custom_fields as $allowed_custom_field)
        {
            $field = Field::find($allowed_custom_field->field_id);
            if ($field) {
                $column_name_in_custom_table = $field->field_col_name;
                // dd($field);
                if (Schema::hasColumn($service_custom_db_table,$column_name_in_custom_table)) {
                    $data = $custom_tbl_data->$column_name_in_custom_table;
                    if ($field->field_type === "Dropdown") {
                        $child = FieldChild::find($data);
                        $data = $child->child_name;
                    }
                    
                    $fields[] = [
                        'field_id' => $allowed_custom_field->field_id,
                        'field_name' => $field->field_name,
                        'val' => $data
                    ];
                }
            }
            
        }

        return response($fields);
    }
        
}