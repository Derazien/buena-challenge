import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OpenTicket {
    @Field(() => Int)
    id: number;

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

    @Field()
    propertyAddress: string;

    @Field()
    createdAt: string;
}

@ObjectType()
export class TicketStats {
    @Field(() => [OpenTicket])
    openTickets: OpenTicket[];

    @Field(() => Int)
    totalCount: number;
}