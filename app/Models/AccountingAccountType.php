<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingAccountType extends Model
{
    use HasFactory;

    protected $table = 'tbl_accounting_accounts_type';
    
    protected $primaryKey = 'account_type_id';

    protected $guarded = [];
    
    public $timestamps = false;
}