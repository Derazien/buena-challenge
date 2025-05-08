import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsArray } from 'class-validator';

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

    @Field()
    @IsNotEmpty()
    @IsEnum(['VACANT', 'OCCUPIED', 'MAINTENANCE'])
    status: string;

    @Field()
    @IsNotEmpty()
    @IsEnum(['APARTMENT', 'HOUSE', 'CONDO', 'COMMERCIAL'])
    propertyType: string;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    monthlyRent: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    image: string;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    bedrooms: number;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    bathrooms: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    sqft: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    yearBuilt: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    lastRenovated?: number;

    @Field(() => [String])
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    amenities: string[];

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    roi: number;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    occupancyRate: number;
}