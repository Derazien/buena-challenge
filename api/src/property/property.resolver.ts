import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Property } from './models/property.model';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';

@Resolver(() => Property)
export class PropertyResolver {
    constructor(private readonly prisma: PrismaService) { }

    @Query(() => [Property], { name: 'properties' })
    async findAll() {
        return this.prisma.property.findMany({
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
    }

    @Query(() => Property, { name: 'property' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return this.prisma.property.findUnique({
            where: { id },
            include: {
                cashFlows: true,
                leases: true,
                tickets: true,
            },
        });
    }

    @Mutation(() => Property)
    async createProperty(@Args('createPropertyInput') createPropertyInput: CreatePropertyInput) {
        return this.prisma.property.create({
            data: createPropertyInput,
        });
    }

    @Mutation(() => Property)
    async updateProperty(@Args('updatePropertyInput') updatePropertyInput: UpdatePropertyInput) {
        const { id, ...data } = updatePropertyInput;
        return this.prisma.property.update({
            where: { id },
            data,
        });
    }

    @Mutation(() => Property)
    async removeProperty(@Args('id', { type: () => Int }) id: number) {
        return this.prisma.property.delete({
            where: { id },
        });
    }
}