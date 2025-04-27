import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateTicketInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    priority: string;

    @Field()
    status: string;

    @Field(() => Int)
    propertyId: number;
}