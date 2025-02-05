# Local Dev Instructions

## 1. Configure AWS CLI to Use Localstack

Update your AWS CLI configuration to point to Localstack instead of real AWS services.
Edit ~/.aws/config:

```
[profile localstack]
region = us-east-1
output = json
```

Edit ~/.aws/credentials:

```
[localstack]
aws_access_key_id = test
aws_secret_access_key = test
```

Set your shell environment variables to use the LocalStack profile:

```
export AWS_DEFAULT_PROFILE=localstack
export AWS_ENDPOINT_URL=http://localhost:4566
```

## 2. Install localstack and postgres via [docker](https://docs.docker.com/engine/install/) and docker-compose

```
docker-compose up -d
```

## 3. Deploy the lambda function

Create a Deployment Package and deploy the lambda to localstack:

```
npm run build:dev:init
```

## 4. Invoke the Lambda Function

```
aws lambda invoke \
    --cli-binary-format raw-in-base64-out \
    --function-name apolis-api-dev \
    --payload fileb://dev-payload.json \
    --endpoint-url=http://localhost:4566 \
    output.json
```

The response will be saved in output.json
Edit the payload in `dev-payload.json` as needed to test different endpoints, leave the header object as is.

## 5. Test and Debug

You can now test and debug your Node.js Lambda function locally. LocalStack provides a web interface at http://localhost:4566 to monitor and manage your resources.

You can view logs via: `docker logs -f localstack` and `docker logs -f postgres`
If you make changes to the js source, you can update the function via:

```
npm run build:dev
```

## 6. Clean Up

When you're done, stop the LocalStack and postgres containers:

```
sudo docker-compose down
```

If you also want to re-seed the database on the next run you can run:

```
sudo docker-compose down --volumes
```

This will clear out the docker volumes and force initialization the next time you bring the containers up.
