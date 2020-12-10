FROM hayd/deno:1.5.2

LABEL maintainer="Yorrick Bakker"
WORKDIR /app

USER deno

ADD . /app
RUN deno cache index.ts

CMD ["run", "--allow-net", "main.ts"]