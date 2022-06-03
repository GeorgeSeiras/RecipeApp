FROM python:3.8

ENV PYTHONUNBUFFERED 1
WORKDIR /app/api
COPY requirements.txt ./
COPY . ./
RUN pip install -r requirements.txt
CMD python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py createsuperusercustom && \
    python manage.py runserver 0.0.0.0:8000 
EXPOSE 8000 6379