FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5001

CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:create_app()"]
