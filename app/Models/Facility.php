<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;
    
    protected $table = 'tbl_corporates_facilities';

    public $timestamps = false;
    
    const CREATED_AT = 'date_created';

    protected $guarded = [];

    public function corporate()
    {
        return $this->belongsTo(Corporate::class, "corporate_id");
    }

    public function clients()
    {
        return $this->hasMany(Task::class, "facility_id");
    }

    public function shown_custom_fields()
    {
        return $this->hasMany(CorporateCustomField::class, 'facility_id');
    }

}