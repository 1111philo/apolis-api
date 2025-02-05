# Local Dev Instructions

## 1. Configure AWS CLI to Use LocalStack

Update your AWS CLI configuration to point to LocalStack instead of real AWS services.
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

Create a Deployment Package:

```
npm run build:dev
```

Use the AWS CLI to create the Lambda function in LocalStack:

```
aws lambda create-function \
    --function-name apolis-api-dev \
    --env "Variables={NODE_ENV=development, DB_HOST=postgres, DB_USER=postgres, DB_NAME=mydatabase, DB_PASSWORD=postgres}" \
    --runtime nodejs18.x \
    --handler index.handler \
    --zip-file fileb://dist/lambda.zip \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --endpoint-url=http://localhost:4566
```

## 4. Invoke the Lambda Function

```
aws lambda invoke \
    --cli-binary-format raw-in-base64-out \
    --function-name apolis-api-dev \
    --payload '{"headers":{"authorization": "Bearer: "}, "path": "/auth/getUsers"}' \
    --endpoint-url=http://localhost:4566 \
    output.json
```

The response will be saved in output.json
Edit the payload as needed to test different endpoints, leave the header object as is.

## 5. Test and Debug

You can now test and debug your Node.js Lambda function locally. LocalStack provides a web interface at http://localhost:4566 to monitor and manage your resources.

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

This will also clear out the DB data and force initialization the next time you bring the container up.
