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

    @Field()
    status: string;

    @Field()
    propertyType: string;

    @Field(() => Float)
    monthlyRent: number;

    @Field(() => String, { nullable: true })
    image?: string;

    @Field(() => Int, { nullable: true })
    bedrooms?: number;

    @Field(() => Float, { nullable: true })
    bathrooms?: number;

    @Field(() => Int, { nullable: true })
    sqft?: number;

    @Field(() => Int, { nullable: true })
    yearBuilt?: number;

    @Field(() => Int, { nullable: true })
    lastRenovated?: number;

    @Field(() => [String], { nullable: true })
    amenities?: string[];

    @Field(() => Float, { nullable: true })
    roi?: number;

    @Field(() => Float, { nullable: true })
    occupancyRate?: number;

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