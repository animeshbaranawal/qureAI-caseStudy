FROM python:3.6.9
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN python3 -m pip install -r requirements.txt
COPY ./ /code/
