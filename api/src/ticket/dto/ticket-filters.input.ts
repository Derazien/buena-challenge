import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class TicketFiltersInput {
    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    priority?: string;

    @Field({ nullable: true })
    searchQuery?: string;

    @Field(() => Int, { nullable: true })
    propertyId?: number;
}