FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
RUN python manage.py makemigrations
RUN python manage.py 
CMD python manage.py runserver
EXPOSE 8000
