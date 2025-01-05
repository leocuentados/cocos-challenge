import {
    DynamoDBDocument,
    GetCommand,
    PutCommand,
  } from '@aws-sdk/lib-dynamodb';
import { DDBDocumentClient, DynamoParamsWithItem, DynamoParamsWithKey } from '../config/ddb.client';
import { PORTFOLIO_TABLE_NAME, PORTFOLIO_TABLE_PK } from '../config/constants';
import { PortfolioCache } from './portfolio-cache';
  
  export class PortfolioDDBRepository<T> {
    ddbDocClient: DynamoDBDocument;
  
    constructor(
      protected readonly tableName: string,
      protected readonly partitionKey: string
    ) {
      this.ddbDocClient = DDBDocumentClient;
    }
  
    async getByUserId(userId: number): Promise<PortfolioCache> {
      const input = this.getParamsWithKey(userId.toString());
      const { Item } = await this.ddbDocClient.send(new GetCommand(input));
      return Item as object as PortfolioCache;
    }
  
    async create(item: T): Promise<PortfolioCache> {
      return this.update(item);
    }
  
    async update(item: T): Promise<PortfolioCache> {
      const input = this.getParamsWithItem(item as object);
      await this.ddbDocClient.send(new PutCommand(input));
      return input.Item as PortfolioCache;
    }
  
    private getParamsWithKey(userId: string): DynamoParamsWithKey {
      return new DynamoParamsWithKey(this.getTableName(), { userId: userId });
    }
    
    private getParamsWithItem(item: object): DynamoParamsWithItem {
      return new DynamoParamsWithItem(this.getTableName(), item);
    }
  
    private getTableName(): string {
      return PORTFOLIO_TABLE_NAME;
    }
  
    private getPartitionKey(): { pk: string } {
      return {
        pk: PORTFOLIO_TABLE_PK
      };
    }
  }
  