import { InputType, Field, Int } from '@nestjs/graphql';

@InputType('CreateTicketInput')
export class CreateTicketDto {
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