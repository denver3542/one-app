<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceFieldHide extends Model
{
    use HasFactory;

		/**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'finance_field_hide';

		protected $primaryKey = 'hideshow_id';

		public $timestamps = false;

		protected $fillable = [];

		/**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

}
