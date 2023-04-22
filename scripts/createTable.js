import AWS from 'aws-sdk'

AWS.config.update({
    region: 'eu-west-1'
})

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName: 'my-table',
    KeySchema: [
      { AttributeName: 'name', KeyType: 'HASH' },   // partition key
      { AttributeName: 'date', KeyType: 'RANGE' }  // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'link', AttributeType: 'S' },
      { AttributeName: 'name', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    LocalSecondaryIndexes: [
        { 
            IndexName: 'index_Link',
            KeySchema: [ 
                { // Required HASH type attribute - must match the table's HASH key attribute name
                    AttributeName: 'name',
                    KeyType: 'HASH',
                },
                { // alternate RANGE key attribute for the secondary index
                    AttributeName: 'link', 
                    KeyType: 'RANGE', 
                }
            ],
            Projection: { // required
                ProjectionType: 'KEYS_ONLY', // (ALL | KEYS_ONLY | INCLUDE)
            },
        }
        // ... more local secondary indexes ...
    ],
};

  // create the table
dynamodb.createTable(params, (err, data) => {
    if (err) {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});