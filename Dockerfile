FROM hayd/deno:1.6.0

LABEL maintainer="Yorrick Bakker"
WORKDIR /app

USER deno

ADD . /app
RUN deno cache bot.ts

CMD ["run", "--allow-net", "--allow-env", "bot.ts"]