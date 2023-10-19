const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    //웹 소켓 연결시
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //클라이언트의 ip를 알아내는 방법 중 유명한 방법
    //localhost에서는 ::1로 아이피가 뜬다.
    console.log('새로운 클라이언트 접속', ip);

    ws.on('message', (message) => {
      //클라이언트로부터 메시지 수신 시
      console.log(message.toString());
    });
    ws.on('error', (error) => {
      //연결 중에 문제가 발생할 경우
      console.log(error);
    });
    ws.on('close', () => {
      //연결 종료 시

      console.log('클라이언트 접속 해제', ip);
      clearInterval(ws.interval);
    });

    // setInterval은 3초마다 모든 클라이언트에게 다시 메세지를 보내는 것
    // readyState가 open상태인지 확인. connecting(연결 중), open(열림), closing(닫는 중), closed(닫힘)
    //

    ws.interval = setInterval(() => {
      //3초마다 클라이언트로 메시지 전송
      if (ws.readyState === ws.OPEN) {
        ws.send('서버에서 클라이언트로 메시지를 보냅니다');
      }
    }, 3000);
  });
};

//웹소켓은 단순히 서버만 설정한다고 되는 것이 아니라, 클라이언트에서도 웹 소켓을 사용해야 합니다. 양방향 통신.
