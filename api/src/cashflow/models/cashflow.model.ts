import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Property } from '../../property/models/property.model';

@ObjectType()
export class CashFlow {
    @Field(() => Int)
    id: number;

    @Field(() => Float)
    amount: number;

    @Field()
    type: string;

    @Field()
    category: string;

    @Field(() => Date)
    date: Date;

    @Field({ nullable: true })
    note?: string;

    @Field(() => Int)
    propertyId: number;

    @Field(() => Property)
    property: Property;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}