<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingInvoice extends Model
{
    use HasFactory;
    
    protected $table = 'tbl_accounting_invoice';
    
    protected $primaryKey = 'invoice_id';

    protected $guarded = [];
    
    public $timestamps = false;

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function finance_phase()
    {
        return $this->belongsTo(FinancePhase::class, 'phase_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}