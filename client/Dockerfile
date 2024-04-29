####################
# Build Stage
####################

# Node.js 기반 이미지 선택
FROM node:20.11.0 as build

# 애플리케이션 디렉토리 생성
WORKDIR /app

# 애플리케이션 의존성 파일 복사
COPY package*.json ./

# 패키지 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

####################
# Production Stage
####################

# Nginx를 사용하여 정적 파일 서빙
FROM nginx:stable-alpine as production

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드 결과물 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 포트 80 노출
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
