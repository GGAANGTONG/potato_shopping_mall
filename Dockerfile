# Node.js 기반 이미지 선택
FROM node:20.11.0

# 애플리케이션 디렉토리 생성
WORKDIR /usr/src/app

# 애플리케이션 의존성 파일 복사
COPY package*.json ./

# 패키지 설치
RUN npm install --verbose

# 애플리케이션 소스 복사 (src 폴더와 나머지 필요한 파일만 복사)
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY .env ./env

# 애플리케이션 빌드
RUN npm run build --verbose

# 애플리케이션 시작
CMD ["node", "dist/main"]