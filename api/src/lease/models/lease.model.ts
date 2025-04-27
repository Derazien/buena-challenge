import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Property } from '../../property/models/property.model';

@ObjectType()
export class Lease {
    @Field(() => Int)
    id: number;

    @Field(() => Date)
    startDate: Date;

    @Field(() => Date)
    endDate: Date;

    @Field(() => Float)
    monthlyRent: number;

    @Field()
    tenantName: string;

    @Field({ nullable: true })
    tenantEmail?: string;

    @Field({ nullable: true })
    tenantPhone?: string;

    @Field()
    isActive: boolean;

    @Field(() => Int)
    propertyId: number;

    @Field(() => Property)
    property: Property;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}