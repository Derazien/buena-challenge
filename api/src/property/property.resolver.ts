import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Property } from './models/property.model';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { Property as PrismaProperty } from '@prisma/client';

@Resolver(() => Property)
export class PropertyResolver {
    constructor(private readonly prisma: PrismaService) { }

    @Query(() => [Property], { name: 'properties' })
    async findAll() {
        const properties = await this.prisma.property.findMany({
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
        
        return properties.map(this.transformProperty);
    }

    @Query(() => Property, { name: 'property' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        const property = await this.prisma.property.findUnique({
            where: { id },
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
        
        if (!property) return null;
        
        return this.transformProperty(property);
    }

    @Mutation(() => Property)
    async createProperty(@Args('createPropertyInput') createPropertyInput: CreatePropertyInput) {
        const { amenities, ...rest } = createPropertyInput;
        const property = await this.prisma.property.create({
            data: {
                ...rest,
                amenities: JSON.stringify(amenities),
            },
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
        
        return this.transformProperty(property);
    }

    @Mutation(() => Property)
    async updateProperty(@Args('updatePropertyInput') updatePropertyInput: UpdatePropertyInput) {
        const { id, amenities, ...data } = updatePropertyInput;
        const property = await this.prisma.property.update({
            where: { id },
            data: {
                ...data,
                ...(amenities && { amenities: JSON.stringify(amenities) }),
            },
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
        
        return this.transformProperty(property);
    }

    @Mutation(() => Property)
    async removeProperty(@Args('id', { type: () => Int }) id: number) {
        const property = await this.prisma.property.delete({
            where: { id },
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
        
        return this.transformProperty(property);
    }

    private transformProperty(property: PrismaProperty & { cashFlows: any[], leases: any[], tickets: any[] }) {
        return {
            ...property,
            amenities: JSON.parse(property.amenities),
        };
    }
}