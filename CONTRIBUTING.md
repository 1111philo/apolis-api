# Local Dev Instructions

## 1. Install localstack via [docker](https://docs.docker.com/engine/install/)
```
docker pull localstack/localstack
docker run -d -p 4566:4566 -p 4571:4571 --name localstack localstack/localstack
localstack start
```

## 2. Configure AWS CLI to Use LocalStack
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
Set the environment variables to use the LocalStack profile:
```
export AWS_DEFAULT_PROFILE=localstack
export AWS_ENDPOINT_URL=http://localhost:4566
```

## 3. Deploy the lambda function
Create a Deployment Package:
```
zip -r apolis-api.zip .
```
Use the AWS CLI to create the Lambda function in LocalStack:
```
aws lambda create-function \
    --function-name apolis-api-dev \
    --runtime nodejs18.x \
    --handler index.handler \
    --zip-file fileb://apolis-api.zip \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --endpoint-url=http://localhost:4566
```

## 4. Invoke the Lambda Function
```
aws lambda invoke \
    --function-name my-node-function \
    --payload '{"key": "value"}' \
    --endpoint-url=http://localhost:4566 \
    output.txt
```
The response will be saved in output.txt

## 5. Test and Debug

You can now test and debug your Node.js Lambda function locally. LocalStack provides a web interface at http://localhost:4566 to monitor and manage your resources.

If you need to update your Lambda function code, you can re-deploy it by updating the deployment package and using the update-function-code command:
```
zip -r apolis-api.zip .
aws lambda update-function-code \
    --function-name my-node-function \
    --zip-file fileb://my-function.zip \
    --endpoint-url=http://localhost:4566
```

## 6. Clean Up

When you're done, stop and remove the LocalStack container:
```
docker stop localstack
docker rm localstack
```
