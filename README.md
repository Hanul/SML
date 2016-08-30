# SML
HTML로 변환되는 간단한 데이터 표현식

## 실행 방법
```javascript
require('./import/UJS-NODE.js');
require('./SML.js');

var html = SML(READ_FILE({
	path : 'example.sml',
	isSync : true
}).toString());

console.log(html);
```

## 예
`sml`
```sml
meta viewport='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
title 'SML'
body
	h1#logo 'SML'
	p.content '
		Simple (HyperText)
		Markup
		Language
	'
```

`html`
```html
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
		<title>SML</title>
	</head>
	<body>
		<h1 id="logo">SML</h1>
		<p class="content">
			Simple (HyperText)<br/>
			Markup<br/>
			Language
		</p>
	</body>
</html>
```

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)