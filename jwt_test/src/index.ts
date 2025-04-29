// 필요한 모듈 가져오기
import { createServer, IncomingMessage, ServerResponse } from 'http'; // 기본 http 모듈
import jwt from 'jsonwebtoken'; // JWT 토큰 생성 및 검증용 라이브러리

// 서버 포트 및 JWT 서명용 비밀 키 설정
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';  // 실제 서비스에서는 환경변수로 관리하는 것이 안전함

// 요청(request) 본문(body)을 읽어오는 비동기 함수
const getRequestBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';

        // 데이터가 들어올 때마다 body에 추가
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        // 데이터 수신이 끝나면 JSON 파싱해서 반환
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error); // JSON 형식이 잘못되었으면 에러
            }
        });
    });
};

// Authorization 헤더에 있는 토큰을 검증하는 함수
const authenticateToken = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers['authorization']; // Authorization 헤더 가져오기
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer 토큰" 형태 중 토큰 부분 추출

        if (!token) {
            reject(new Error('Token not found')); // 토큰이 없으면 실패
            return;
        }

        // JWT 토큰을 SECRET_KEY로 검증
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                reject(new Error('Invalid token')); // 검증 실패
            } else {
                resolve(user); // 검증 성공 시 payload(사용자 정보) 반환
            }
        });
    });
};

// HTTP 서버 생성
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // POST /login : 사용자 정보를 받아서 JWT 토큰 발급
    if (req.method === 'POST' && req.url === '/login') {
        try {
            const body = await getRequestBody(req); // 요청 본문 파싱
            const { username, userId } = body; // username과 userId를 추출

            if (!username) { // username이 없으면 에러
                res.statusCode = 400;
                res.end('Username is required');
                return;
            }

            // username과 userId를 포함하는 JWT 생성 (1시간 만료)
            const token = jwt.sign({ username, userId }, SECRET_KEY, { expiresIn: '1h' });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ token })); // 클라이언트에 토큰 반환
        } catch (error) {
            res.statusCode = 400;
            res.end('Invalid request body'); // 요청 body가 잘못되었을 경우
        }
    }

    // GET /protected : 토큰을 검증하고, 성공 시 보호된 리소스 접근 허용
    else if (req.method === 'GET' && req.url === '/protected') {
        try {
            const user = await authenticateToken(req); // 요청에서 토큰 검증

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Welcome to the protected route!', user }));
            // 인증된 사용자 정보도 함께 응답
        } catch (error) {
            res.statusCode = 401;
            res.end('Unauthorized'); // 인증 실패 시 401 응답
        }
    }

    // 나머지 경로 및 메서드는 404 처리
    else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

// 서버 시작
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
