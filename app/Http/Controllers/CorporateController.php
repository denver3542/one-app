<?php

namespace App\Http\Controllers;

use App\Models\Corporate;
use App\Models\CorporateCustomField;
use App\Models\Space;
use App\Models\FieldChild;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CorporateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $corporates = Corporate::with(['facilities' => function($query){
            return $query->with(['clients' => function($qry){
                $qry->with('list','client', 'status')
                    ->select('task_id','task_contact','facility_id','reminder','remarks','task_list_id','task_status_id');
            }])->select('id','title','corporate_id');
        }])->select('id','title')->where('is_deleted', 0)->get();
        foreach ($corporates as $key=>$corporate){
            $facilities = $corporate['facilities'];
            // dd($facilities);
            foreach($facilities as $facility){
                $facility_id = $facility->id;
                $service_ids = array();
                $service_fields = array();
                $clientFields = array();
                foreach($facility->clients as $client){
                    $service_id = $client->list->service->space_id;
                    
                    $custom_tbl_data = DB::table($client->list->service->space_db_table)->where('task_id', $client->task_id)->first();
                    $customFields = Space::with(['fields' => function($query){
                        return $query->select('field_space_id','field_id','field_name','field_col_name', 'field_type');
                    }])->select('space_id', 'space_name', 'space_db_table' )->findOrFail($service_id);
                    

                    if (!in_array($service_id,$service_ids)) 
                    {
                        $filteredFields = array();
                        $shownFields = array();
                        foreach ($customFields->fields as $field) {
                            $shownCustomFields = CorporateCustomField::where('field_id', $field->field_id)->where('facility_id', $facility_id)->exists();
                            if ($shownCustomFields) {
                                $shownFields[] = $field;
                            }else{
                                $filteredFields[] = $field;
                            }
                        }
                        $customFields->filtered_fields = $filteredFields;
                        $customFields->shown_fields = $shownFields;

                        $service_fields[] = $customFields;
                        $service_ids[] = $service_id;
                    }

                    $clientFields = array();
                    foreach ($customFields->fields as $field) {
                        $shownCustomFields = CorporateCustomField::where('field_id', $field->field_id)->where('facility_id', $facility_id)->exists();
                        if ($shownCustomFields) {
                            $column = $field->field_col_name;
                            if (Schema::hasColumn($client->list->service->space_db_table,$column)) {
                                if ($field->field_type === "Dropdown") {
                                    $id = $custom_tbl_data->$column;
                                    $child = FieldChild::find($id);
                                    $field->val = $child?$child->child_name:'';
                                }else{
                                    $field->val = $custom_tbl_data->$column;
                                }
                                
                                $clientFields[] = $field;
                            }
                        }
                    }
                    $client->fields = $clientFields;
                }

                $facility->services = $service_fields;
            }
        }
        return response()->json($corporates);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function customFields($id)
    {
        $corporates = Corporate::with(['facilities' => function($query){
            return  $query->with('clients');
        }])->where('is_deleted', 0)->get();
        return response()->json($corporates);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function setFieldHide(Request $req)
    {
        try {
            $facilityId = $req->input('facilityId');
            $fieldId = $req->input('fieldId');
            
            $delete = CorporateCustomField::where('field_id', $fieldId)->where('facility_id', $facilityId)->delete();
            if ($delete) {
                return response()->json(['success' => true, 'message' => "Successfully hidden."]);
            }

            return response()->json(['success' => false, 'message' => "Failed to remove field."],500);
        }catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => "Failed to show field", 'error' => $th->getMessage()],500);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function setFieldShow(Request $req)
    {
        try {
            $facilityId = $req->input('facilityId');
            $fieldId = $req->input('fieldId');
            
            $user = $req->user();
            $user_id = $user->user_id;
            $exists = CorporateCustomField::where('field_id', $fieldId)->where('facility_id', $facilityId)->exists();
            if (!$exists) {
                CorporateCustomField::create([
                    'field_id' => $fieldId,
                    'facility_id' => $facilityId,
                    'added_by' => $user_id
                ]);
                return response()->json(['success' => true, 'message' => "Successfully shown."]);
            }
            return response()->json(['success' => false, 'message' => "Field has been shown already."],500);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => "Failed to show field", 'error' => $th->getMessage()],500);
        }
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
     * @param  \App\Models\Corporate  $corporate
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $corporate = Corporate::with(['facilities' => function($query){
            return $query->with(['clients' => function($qry){
                $qry->with('list','client', 'status');
            }]);
        }])->find($id);
        
        $facilities = $corporate->facilities;
        // dd($facilities);
        foreach($facilities as $facility){
            $facility_id = $facility->id;
            $service_ids = array();
            $service_fields = array();
            $clientFields = array();
            foreach($facility->clients as $client){
                $service_id = $client->list->service->space_id;
                
                $custom_tbl_data = DB::table($client->list->service->space_db_table)->where('task_id', $client->task_id)->first();
                $customFields = Space::with(['fields' => function($query){
                    return $query->select('field_space_id','field_id','field_name','field_col_name', 'field_type');
                }])->select('space_id', 'space_name', 'space_db_table' )->findOrFail($service_id);
                

                if (!in_array($service_id,$service_ids)) 
                {
                    $filteredFields = array();
                    $shownFields = array();
                    foreach ($customFields->fields as $field) {
                        $shownCustomFields = CorporateCustomField::where('field_id', $field->field_id)->where('facility_id', $facility_id)->exists();
                        if ($shownCustomFields) {
                            $shownFields[] = $field;
                        }else{
                            $filteredFields[] = $field;
                        }
                    }
                    $customFields->filtered_fields = $filteredFields;
                    $customFields->shown_fields = $shownFields;

                    $service_fields[] = $customFields;
                    $service_ids[] = $service_id;
                }

                $clientFields = array();
                foreach ($customFields->fields as $field) {
                    $shownCustomFields = CorporateCustomField::where('field_id', $field->field_id)->where('facility_id', $facility_id)->exists();
                    if ($shownCustomFields) {
                        $column = $field->field_col_name;
                        if (Schema::hasColumn($client->list->service->space_db_table,$column)) {
                            if ($field->field_type === "Dropdown") {
                                $id = $custom_tbl_data->$column;
                                $child = FieldChild::find($id);
                                $field->val = $child?$child->child_name:'';
                            }else{
                                $field->val = $custom_tbl_data->$column;
                            }
                            
                            $clientFields[] = $field;
                        }
                    }
                }
                $client->fields = $clientFields;
            
            }

            $facility->services = $service_fields;
        }

        return response()->json($corporate);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Corporate  $corporate
     * @return \Illuminate\Http\Response
     */
    public function edit(Corporate $corporate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Corporate  $corporate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Corporate $corporate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Corporate  $corporate
     * @return \Illuminate\Http\Response
     */
    public function destroy(Corporate $corporate)
    {
        //
    }
}