import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * Response for delete ticket operation
 */
@ObjectType('DeleteTicketResponse')
export class DeleteTicketResponseDto {
    @Field(() => Int)
    id: number;

    @Field()
    success: boolean;
}