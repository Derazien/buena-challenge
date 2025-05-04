import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Property } from '../../property/models/property.model';

@ObjectType()
export class Ticket {
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

    @Field(() => Property)
    property: Property;

    @Field()
    propertyAddress: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}