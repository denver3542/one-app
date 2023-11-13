<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pdfFile;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($pdfFile)
    {
        $this->pdfFile = $pdfFile;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
        ->subject("Thank you for choosing Nasya - Here's Your Invoice")
        ->view('mail.invoice-mail')
        ->attachData($this->pdfFile->output(), 'invoice.pdf', [
            'mime' => 'application/pdf',
        ]);
    }
}