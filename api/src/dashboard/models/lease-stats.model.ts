import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class UpcomingRenewal {
    @Field(() => Int)
    id: number;

    @Field()
    startDate: string;

    @Field()
    endDate: string;

    @Field(() => Float)
    monthlyRent: number;

    @Field()
    tenantName: string;

    @Field(() => Boolean)
    isActive: boolean;

    @Field(() => Int)
    propertyId: number;

    @Field()
    propertyAddress: string;
}

@ObjectType()
export class LeaseStats {
    @Field(() => [UpcomingRenewal])
    upcomingRenewals: UpcomingRenewal[];

    @Field(() => Int)
    totalCount: number;
}
