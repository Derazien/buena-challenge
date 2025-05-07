import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TicketClassification {
  @Field()
  title: string;

  @Field()
  priority: string;

  @Field()
  category: string;

  @Field({ nullable: true })
  estimatedTimeToFix?: string;

  @Field({ nullable: true })
  suggestedAction?: string;
} 