import { InputType, Field, Int, PartialType, OmitType } from '@nestjs/graphql';
import { CreateTicketDto } from './create-ticket.dto';

/**
 * UpdateTicketDto extends CreateTicketDto but makes all fields optional
 * and adds an ID field to identify the ticket to update
 */
@InputType('UpdateTicketInput')
export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @Field(() => Int)
    id: number;
}