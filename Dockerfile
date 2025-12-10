FROM docker.1ms.run/library/nginx:1.27.5-alpine

COPY ./dist /data

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx/nginx.conf /etc/nginx/conf.d/


EXPOSE 8080

RUN /bin/bash -c 'echo init ok'