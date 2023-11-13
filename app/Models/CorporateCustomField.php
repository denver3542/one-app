<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporateCustomField extends Model
{
    use HasFactory;
    
    protected $table = 'tbl_corporates_custom_fields';

    public $timestamps = false;
    
    protected $guarded = [];

    public function field()
    {
        return $this->belongsTo(Field::class, 'field_id');
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }
    
}