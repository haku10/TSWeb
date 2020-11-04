FROM python:3.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app
ADD requirements.txt /app/
RUN pip install -r requirements.txt

# ffmpegの導入
RUN wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
RUN tar Jxfv ffmpeg-release-amd64-static.tar.xz
RUN cp ./ffmpeg*amd64-static/ffmpeg /usr/local/bin

# GCPのクレデンシャルファイル名を記載する
ENV GOOGLE_APPLICATION_CREDENTIALS /usr/gcp/xxxxxxx.json
# GCPのライブラリ導入
RUN pip install --upgrade google-cloud
RUN pip install --upgrade google-cloud-texttospeech
ADD . /app/
CMD python3 manage.py runserver 0.0.0.0:8000
EXPOSE 8000
