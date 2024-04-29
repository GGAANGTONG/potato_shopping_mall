#################### 
# Build Stage
####################

# Node.js 기반 이미지 선택
FROM node:20.11.0 as build

# 애플리케이션 디렉토리 생성
WORKDIR /usr/src/app

# 애플리케이션 의존성 파일 복사
COPY package*.json ./
# package-lock*.json 대신 package*.json 사용으로 수정

# 패키지 설치
RUN npm install --verbose

# 애플리케이션 소스 복사 (src 폴더와 나머지 필요한 파일만 복사)
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

# 애플리케이션 빌드
RUN npm run build --verbose

#################### 
# Production Stage
####################

FROM node:20.11.0 as production

# 애플리케이션 디렉토리 생성
WORKDIR /usr/src/app

# 빌드 결과물과 패키지 파일 복사
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# 프로덕션 의존성 설치 전에 CI 환경 변수 설정
ENV CI=true

# 프로덕션 의존성 설치
RUN npm install --only=production

# 애플리케이션 시작
CMD ["node", "dist/main"]
