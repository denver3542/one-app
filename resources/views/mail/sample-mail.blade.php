<!DOCTYPE html>
<html lang="en">
<head>
	<title>Nasya Email</title>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
    <h1>Hello, you have an email from your site</h1>
	<h5>Name: {{ $data['name'] }}</h5>
	<h5>Email: {{ $data['email'] }}</h5>
    <p>
        {{ $data['message'] }}
    </p>
</body>
</html>