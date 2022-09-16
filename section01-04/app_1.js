const http = require('http');

const server = http.createServer((req, res) => {
  // localhost:3000 페이지에 들어갔을 때, 들어오는 요청에 있는 모든 데이터를 통해 Node.js가 대신 생성해 준 요청 객체
  console.log(req.url, req.method, req.headers);
  // process.exit();
  // 응답의 일부가 될 콘텐츠 유형은 HTML이라는 일련의 메타정보 전달
  res.setHeader('Content-Type', 'text/html');
  // write은 response에 데이터를 기록할 수 있음
  res.write('<html>');
  res.write('<head><title>My first Page</title></head>');
  res.write('<body><h1>Hello from my Node.js Server</h1></body>');
  res.write('</head>');
  // 응답의 생성이 끝난 뒤에는 노드에도 알려줘야 함
  res.end();
});

server.listen(3000);

// function rqListener(req, res) {}
// 'rqListener 이름을 가진 함수를 찾아서 들어오는 모든 요청에 따라 실행'
// http.createServer(rqListener);
