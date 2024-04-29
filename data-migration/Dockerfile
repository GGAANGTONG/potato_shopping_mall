FROM public.ecr.aws/lambda/nodejs:latest

# 작업 디렉토리 설정
WORKDIR /var/task

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# Lambda 함수 코드 복사
COPY . .

# 컨테이너 실행 시 호출될 핸들러 정보
CMD ["index.handler"]
