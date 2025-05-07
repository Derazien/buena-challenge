import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class HistoricalReturn {
  @Field()
  date: string;

  @Field(() => Float)
  value: number;
} 