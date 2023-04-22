import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import AWS from 'aws-sdk'

AWS.config.update({
    region: 'eu-west-1'
})

const dynamodbClient = new AWS.DynamoDB.DocumentClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stubData = JSON.parse(fs.readFileSync(path.join(__dirname, 'stubData.json'), 'utf-8'))

console.log(stubData)

stubData.forEach((stub) => {
    const {name, link, date } = stub
    var params = {
        TableName: 'my-table',
        Item: {
            name: {
                S: name
            }, 
            date: {
                S: date
            },
            link: {
                S: link
            }
        },
        ReturnConsumedCapacity: "TOTAL"
    }

    dynamodbClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to populate table with ${stub.name}. Error JSON:`, JSON.stringify(err, null, 2));
          } else {
            console.log('Populated Table description JSON:', JSON.stringify(data, null, 2));
          }
    })
})