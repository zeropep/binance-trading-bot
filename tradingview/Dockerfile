# It must use alpine3.12; otherwise, it won't work in Raspberry Pi 32bit.
FROM python:3-alpine3.12

WORKDIR /app

COPY requirements.txt requirements.txt

# pip 업그레이드 먼저
RUN pip install --upgrade pip

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 애플리케이션 실행
CMD ["python", "main.py"]
