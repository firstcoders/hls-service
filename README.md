## Quick Start

```bash
  AWS_PROFILE=default npx @sound-ws/hls-service deploy \
    --region eu-west-2 \
    --stage example \
    --secret 94961ef040d60996b3668577b26a2231e958815a35be22dfd493b02a2c59cd59 \
    --log-level debug \
    --ffmpeg-layer-arn arn:aws:lambda:eu-west-2:715905027390:layer:ffmpeg:46 \
    -y
```

## DEFAULT OPTIONS

todo

- CORS headers?
- create ffmpeg lgpl build
- describe dependencies for deployment (AWS permissions required for deploying serverless functions)
- STAGE=development cannot be used

## Dependencies

The installer depends on `npm`, `serverless framework` (can be invoked using npm), `bash` - or `docker`. In addition [this Lambda Layer](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~ffmpeg-lambda-layer) needs to be pre-installed in the AWS environment the audio-service is to be deployed into.

## Build Artifact

Describe

- building webpack dist files + serverless-dist + package-dist

# text change to trigger commit
