import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePropertyInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    address: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    city: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    state: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    zipCode: string;
}