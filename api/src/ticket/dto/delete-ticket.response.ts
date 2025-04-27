import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DeleteTicketResponse {
    @Field(() => Int)
    id: number;

    @Field()
    success: boolean;
}