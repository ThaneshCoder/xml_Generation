FROM nginx
RUN apt-get update
COPY ./testData/dist /usr/share/nginx/html
COPY ./testData/default-dev2.conf /etc/nginx/conf.d/
EXPOSE 80
