<?php

namespace App\Http\Controllers;

use App\Models\Coaching;
use Illuminate\Http\Request;

class CoachingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Coaching::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        // validate data before storing into database
        $validator = $this->validate($request, [
            'title' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|string',
            'link' => 'required|string'
        ]);
        if ($validator) {
            $coach = Coaching::create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'extra' => $request->input('type'),
                'link' => $request->input('link'),
                'createdBy' => $request->user()->user_id,
                //            'image_url'=> $request->input('image-url')?? '',
                //                'videoUrl'=>'https://www.youtube.com/embed/'. substr("http://youtu.be/". explode("/", $request
                //            'image'=>'/images/'.$filename,
                //            'updatedBy' => Auth::user(),
                //            'status' => $request->input('status') ?? ''
            ]);
            return response()->json(['success' => true, 'data' => $coach]);
        }else{
            return response()->json(['error'=> 'Input validation error'], 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return response(Coaching::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Coaching  $coaching
     * @return \Illuminate\Http\Response
     */
    public function edit(Coaching $coaching)
    {
                
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Coaching  $coaching
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        //        dd("here");
        $validator = $this->validate($request, [
            "edit-id" => ['required'],
            "edit-title" => ['required'],
            "edit-desc"=>['required'] ,
            "edit-type"=>['required'],
            "edit-link"=>['required'],
        ]);
        if ($validator) {
            $coaching = Coaching::find($request->input('edit-id'));
            $coaching->update([
                'title' => $request->input('edit-title'),
                'description' => $request->input('edit-desc'),
                'extra' => $request->input('edit-type'),
                'link' => $request->input('edit-link'),
                'update_by' => $request->user()->user_id,
                //                    "duration" =>$request->input('duration')*30,//in minutes
            ]);
            return response()->json(['success' => true]);
        }
        
        return response()->json(['errors'=> 'Something went wrong']);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Coaching  $coaching
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $delete = Coaching::destroy($id);
        if ($delete == 1){
            return response()->json(['status'=>true,'message'=>'Deleted Successfully!']);
        }else{
            return response()->json(['status'=>false,'message'=>'Error Occurred!'], 500);
        }
    }
}