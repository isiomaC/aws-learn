const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-west-1'
});

//Smaple event Body
//{
//  "httpMethod": "GET", or "POST",
//  "body": {
//     "name": "test2",
//     "date": "something",
//     "link": "link1"
//  },
//  "queryStringParameters": {
//     "TableName": "my-table"
//   },
//}


const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler  = async(event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const { httpMethod, queryStringParameters, body: requestBody  } = event

    const bodyRequired = ["POST", "PUT", "DELETE"]
    
    if (bodyRequired.includes(httpMethod) && Object.keys(requestBody).length === 0){
        throw new Error(`Supported method doesn't have a requestBody "${httpMethod}"`);
    }

    const headers = {
        'Content-Type': 'application/json',
    };
    
    const tableName = queryStringParameters?.TableName ?? "my-table"
    
    let params = {
        TableName: tableName,
        Item: {
            ...requestBody
        }
    };
    
    let statusCode = '200', body = null;
     
    try{
        switch (httpMethod) {
            case 'DELETE':
                body = await dynamodb.delete(params).promise();
                break;
            case 'GET':
                body = await dynamodb.scan({TableName: tableName}).promise();
                break;
            case 'POST':
                body = await dynamodb.put(params).promise();
                break;
            case 'PUT':
                params = {
                    TableName: params.TableName,
                    Key: {
                        name: params.Item.name,
                        date: params.Item.date
                    }
                }
                body = await dynamodb.update(params).promise();
                break;
            default:
                body = await dynamodb.scan({TableName: tableName}).promise();
                break;
        }
    }catch(err){
         statusCode = '400';
         body = err.message;
    }finally {
        body = JSON.stringify(body);
    }
    
    return {
        statusCode,
        body,
        headers
    };
};