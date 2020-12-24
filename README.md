![CD](https://github.com/ysbakker/Discord-GitHub-Preview/workflows/CD/badge.svg)

# GitHub Preview Discord Bot

This bot looks for GitHub URLs and will attempt to get the raw filedata.

There are a few limitations (for now):

- Bot only shows the first 2000 (or so) characters, this is a Discord limitation
- The repository needs to be public
- It will use the file extension as the language, which doesn't always work

## Running with Docker using `docker-compose`

This is the recommended way to run the bot. In any case, you first need to
create a `.env` file based on `.env.example`. Next, run
`docker-compose up -d --build`. The bot should now be running. To restart
because of changes, run `docker-compose restart`. To stop, run
`docker-compose down`.

### Production

The easiest way to run in production is by running
`docker-compose up -d -f docker-compose.yml`. This configuration will not mount
the working directory. If you wish to override values or use a different env file,
just create a separate compose file (like `docker-compose.prod.yml`). Here's an
example:

```Dockerfile
version: '2.4'

services:
  bot:
    image: ghcr.io/ysbakker/discord-github-preview:latest
    env_file:
      - .env.prod
    mem_limit: 750m
```

You can then run everything with
`docker-compose up -d -f docker-compose.yml -f docker-compose.prod.yml`.

## Running without Docker

The easiest way is through VScode. Create a `.env` file based on the example and
invoke the "Run Deno" configuration. You can also run this command:

`deno run --allow-read=.env,.env.example --allow-env --allow-net bot.ts`

![](.img/example.png)
