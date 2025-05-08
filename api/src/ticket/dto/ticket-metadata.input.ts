import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class TicketMetadataInput {
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