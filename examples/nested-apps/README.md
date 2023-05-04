# Example deployment of the HLS service using nested apps

An example showing deployment of the HLS service using nested apps

## Prerequisites

- Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Create a SAM deployment bucket
- Copy `cp .env.dist .env` and fill out the missing values

## Deployment

```sh
make deploy
```
