# Hapify Generator

## Description

This is an HTTP server to expose the generator functionality.
For more information about the Hapify Generator, please refer to [cli](https://bitbucket.org/tractrs/hapify-cli/src/master/README.md).
and to [syntax](https://bitbucket.org/tractrs/hapify-cli/src/master/libs/syntax/README.md).

## Configuration

You pass these environment variables to configure HapiJS:

- `PORT`: for `server.port`. Default `9000`.
- `HEAP_SIZE`: for `server.load.maxHeapUsedBytes`, in bytes. Default `268435456` (256MB).
- `RSS_SIZE`: for `server.load.maxRssBytes`, in bytes. Default `301989888` (288MB).
- `CONCURRENT`: for `server.load.concurrent`. Default `20`.

## Endpoint

This server exposes 2 endpoints:

- `POST /generate`
- `POST /path`
