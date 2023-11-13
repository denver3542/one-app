<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingAccount extends Model
{
    use HasFactory;

    protected $table = 'tbl_accounting_accounts';
    
    protected $primaryKey = 'account_id';

    protected $guarded = [];
    
    public $timestamps = false;

    public function type()
    {
        return $this->belongsTo(AccountingAccountType::class, 'account_type');
    }

    public function detail()
    {
        return $this->belongsTo(AccountingAccountDetail::class, 'detail_type');
    }
}