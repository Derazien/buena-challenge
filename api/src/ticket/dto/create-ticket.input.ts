import { InputType, Field, Int } from '@nestjs/graphql';
import { TicketMetadataInput } from './ticket-metadata.input';

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
    
    @Field(() => TicketMetadataInput, { nullable: true })
    metadata?: TicketMetadataInput;
}