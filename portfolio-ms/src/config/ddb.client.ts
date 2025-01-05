import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, DYNAMODB_ENDPOINT } from './constants';

const client = new DynamoDBClient({ 
  region: AWS_REGION, 
  endpoint: DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  },
});

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: true,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

export const DDBDocumentClient = DynamoDBDocument.from(client, translateConfig);

export class DynamoParams {
  constructor(public readonly TableName: string) {}
}

export class DynamoParamsWithKey extends DynamoParams {
  Key: any = {};

  constructor(public override readonly TableName: string, partitionKey: { userId: string }) {
    super(TableName);
    this.Key = partitionKey;
  }
}

export class DynamoParamsWithItem extends DynamoParams {
  constructor(
    public override readonly TableName: string,
    public readonly Item: any
  ) {
    super(TableName);
  }
}
