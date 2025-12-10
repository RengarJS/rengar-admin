FROM nginx:alpine

COPY ./dist /data

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx/nginx.conf /etc/nginx/conf.d/


EXPOSE 8080

RUN echo "init ok"