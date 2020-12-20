FROM hayd/deno:1.6

LABEL maintainer="Yorrick Bakker"
WORKDIR /app
ENV MODE=production

USER deno

ADD . /app
RUN deno cache index.ts

CMD ["run", "--allow-net", "--allow-env", "index.ts"]