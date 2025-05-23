import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Property } from '../../property/models/property.model';

@ObjectType()
export class TicketMetadata {
    @Field({ nullable: true })
    contactPhone?: string;

    @Field({ nullable: true })
    contactEmail?: string;

    @Field({ nullable: true })
    estimatedCost?: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    dueDate?: Date;

    @Field({ nullable: true })
    notes?: string;

    @Field({ nullable: true })
    useAI?: boolean;

    @Field({ nullable: true })
    generatedByAI?: boolean;

    @Field({ nullable: true })
    actionRequired?: string;

    @Field({ nullable: true })
    aiProcessed?: boolean;

    @Field({ nullable: true })
    aiResolution?: string;

    @Field({ nullable: true })
    aiActionTaken?: string;

    @Field({ nullable: true })
    aiNotes?: string;

    @Field({ nullable: true })
    aiProcessingTime?: string;
}

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

    @Field(() => TicketMetadata, { nullable: true })
    metadata?: TicketMetadata;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}