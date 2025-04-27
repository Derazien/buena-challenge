import { InputType, Field, Int, PartialType, OmitType } from '@nestjs/graphql';
import { CreateTicketInput } from './create-ticket.input';

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
    @Field(() => Int)
    id: number;
}