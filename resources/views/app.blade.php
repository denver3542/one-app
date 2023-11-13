<!doctype html>
<html lang="{{ config('app.locale') }}" class="no-focus">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">

    <title>Nasya HR</title>

    <meta name="description" content="Your Innovative Partner in Life!">
    <meta name="author" content="InfinityHub">
    <meta name="robots" content="noindex, nofollow">

    <!-- CSRF Token -->
    {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}

    <!-- Icons -->
    <link rel="icon" sizes="192x192" type="image/png" href="{{ asset('media/home-logo.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('media/favicons/apple-touch-icon-180x180.png') }}">
    {{-- <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> --}}
    <!-- Fonts and Styles -->
    {{-- @yield('css_before') --}}
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Muli:300,400,400i,600,700">
    <link rel="stylesheet" id="css-main" href="{{ asset('/css/codebase.css') }}">
    <link rel="stylesheet" id="css-main" href="{{ asset('/css/codebase.min.css') }}">
    {{-- @yield('css_after') --}}
</head>

<body>
    <div id="app"></div>
    <script src="{{ asset('js/codebase.app.js') }}"></script>

    <!-- Laravel Scaffolding JS -->
    {{-- <script src="{{ asset('js/laravel.js') }}"></script> --}}
    <script src="{{ mix('js/app.js') }}"></script>
    <script>
        window.recaptchaSiteKey = "{{ env('RECAPTCHA_SITEKEY') }}";
    </script>
</body>

</html>