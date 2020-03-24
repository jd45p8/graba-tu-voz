FROM ubuntu:18.04 as dev
RUN apt update && \
    apt upgrade -y && \
    apt install git curl -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash  && \
    apt install nodejs -y
WORKDIR /root/src
CMD npm i --only=dev && npm run serve
EXPOSE 8080
