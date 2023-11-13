<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coaching extends Model
{
    use HasFactory;

    protected $table = 'coaching';

    protected $primaryKey = 'id';
    
    protected $guarded = [];
    
    public $timestamps = false;

    public function user(){
        return $this->belongsTo(User::class);
    }
        
}