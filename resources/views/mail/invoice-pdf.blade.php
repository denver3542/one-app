<!doctype html>
<html lang="{{ config('app.locale') }}" class="no-focus">

<head>
    <meta charset="utf-8">
    <title>Nasya HR</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Muli:300,400,400i,600,700">
    <link rel="stylesheet" id="css-main" href="{{ asset('/css/codebase.min.css') }}">
</head>

<body>
    <div class="block-content d-print-block" id="invoice-content">
        <div class="w-100 bg-gd-lake mb-10" style="height: 30px"></div>
        <div class="d-flex justify-content-between align-items-center">
            <img class="img pd-l-30" src="https://nasyaportal.ph/assets/media/photos/home-logo.png" style="height: 100px; !important">
            <h1 class="text-right font-w700 text-success">INVOICE</h1>
        </div>
        <div class="row mt-20">
            <div class="col-8">
                <p class="mb-0">BILLED BY: </p>
                <h4>Nasya Business Consultancy Services</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-5 client-info">
                <p class="mb-0">BILLED TO: </p>
                <h4>{{ $task->task_name }}</h4></div>
                            <div class="col-4 invoice-information text-center">
                <p class="">Date Issued: 2023-09-26</p>
                <h5 class="mb-5">Invoice #1056</h5>
            </div>
            <div class="col-3">
                <p class="text-right m-0">Amount Paid: </p>
                <span class="badge bg-gd-lake p-20 font-size-h6 font-w700 text-white amount-paid float-right">USD: $438.00</span>
            </div>
        </div>
        <hr>
        <div class="row justify-content-center mb-20" style="">
            <div class="col-12">
                <table class="table table-sm table-invoice table-striped table-bordered">
                    <thead class="text-white" style="background: linear-gradient(135deg, #26c6da 0, #008018 100%)!important">
                        <tr class="">
                            <th>Title</th>
                            <th class="text-center">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td class="font-w700">Application Fee</td>
                        <td class="text-right">$143.00</td>
                        </tr>
                        <tr>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-6 d-flex flex-column justify-content-end pb-20">
                        <p class="font-w600 mb-10">Contact Us:</p>
                        <p class="mb-0">https://nasya.ph/</p>
                        <p class="mb-0">09177980047</p>
                        <p class="mb-0">09177980040</p>
                        <p class="mb-0">09177980043</p>
                    </div>
                    <div class="col-6">
                        <table class="table table-sm table-invoice-extra table-borderless">
                            <tbody>
<tr class="">
<td class="text-right font-w600">Total Amount:</td>
<td class="text-right font-w700">$461.00</td>
</tr>

<tr class="">
<td class="text-right font-w600">Amount Paid:</td>
<td class="text-right font-w700">$438.00</td>
</tr>

<tr class="">
<td class="text-right font-w600">Discount:</td>
<td class="text-right font-w700">$23.00</td>
</tr>

<tr class="">
<td class="text-right font-w600">Balance:</td>
<td class="text-right font-w700">$0.00</td>
</tr>

<tr class="">
<td class="text-right font-w600">Deposit:</td>
<td class="text-right font-w700">$0.00</td>
</tr>
</tbody>
                        </table>
                    </div>
                    <div class="col-6">
                        <p class="font-w600 mb-10">Terms and Conditions</p>
                        <p class="mb-0 text-justify">The recipient of any invoice agrees toa
                            take all
                            necessary precautions to prevent unauthorized access, dissemination,
                            or use of the invoice details and acknowledges that any breach of
                            this confidentiality may result in legal action.</p>
                    </div>
                    <div class="col-6 d-flex flex-column justify-content-end">
                        <p class="font-w700 mb-0 text-right font-size-h5">Nasya Finance
                            Department</p>
                        <p class="mb-0 text-right">Nasya Business Consultancy Services</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-100 bg-gd-lake mt-10" style="height: 30px"></div>
    </div>
</body>

</html>