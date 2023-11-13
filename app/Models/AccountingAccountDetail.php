<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingAccountDetail extends Model
{
    use HasFactory;
    
    protected $table = 'tbl_accounting_accounts_detail';
    
    protected $primaryKey = 'account_detail_id';

    protected $guarded = [];
    
    public $timestamps = false;
}