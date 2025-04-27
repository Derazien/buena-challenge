import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { CashFlow } from '../../cashflow/models/cashflow.model';
import { Lease } from '../../lease/models/lease.model';
import { Ticket } from '../../ticket/models/ticket.model';

@ObjectType()
export class Property {
    @Field(() => Int)
    id: number;

    @Field()
    address: string;

    @Field()
    city: string;

    @Field()
    state: string;

    @Field()
    zipCode: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => [CashFlow], { nullable: true })
    cashFlows?: CashFlow[];

    @Field(() => [Lease], { nullable: true })
    leases?: Lease[];

    @Field(() => [Ticket], { nullable: true })
    tickets?: Ticket[];
}