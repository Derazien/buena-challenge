import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { Int } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';

export enum TicketScalarFieldEnum {
    id = "id",
    title = "title",
    description = "description",
    priority = "priority",
    status = "status",
    propertyId = "propertyId",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}

export enum PropertyScalarFieldEnum {
    id = "id",
    address = "address",
    city = "city",
    state = "state",
    zipCode = "zipCode",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}

export enum TransactionIsolationLevel {
    Serializable = "Serializable"
}

export enum SortOrder {
    asc = "asc",
    desc = "desc"
}

export enum NullsOrder {
    first = "first",
    last = "last"
}

export enum LeaseScalarFieldEnum {
    id = "id",
    startDate = "startDate",
    endDate = "endDate",
    monthlyRent = "monthlyRent",
    tenantName = "tenantName",
    tenantEmail = "tenantEmail",
    tenantPhone = "tenantPhone",
    isActive = "isActive",
    propertyId = "propertyId",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}

export enum CashFlowScalarFieldEnum {
    id = "id",
    amount = "amount",
    type = "type",
    category = "category",
    date = "date",
    note = "note",
    propertyId = "propertyId",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}

registerEnumType(CashFlowScalarFieldEnum, { name: 'CashFlowScalarFieldEnum', description: undefined })
registerEnumType(LeaseScalarFieldEnum, { name: 'LeaseScalarFieldEnum', description: undefined })
registerEnumType(NullsOrder, { name: 'NullsOrder', description: undefined })
registerEnumType(SortOrder, { name: 'SortOrder', description: undefined })
registerEnumType(TransactionIsolationLevel, { name: 'TransactionIsolationLevel', description: undefined })
registerEnumType(PropertyScalarFieldEnum, { name: 'PropertyScalarFieldEnum', description: undefined })
registerEnumType(TicketScalarFieldEnum, { name: 'TicketScalarFieldEnum', description: undefined })

@ObjectType()
export class AggregateCashFlow {
    @Field(() => CashFlowCountAggregate, {nullable:true})
    _count?: InstanceType<typeof CashFlowCountAggregate>;
    @Field(() => CashFlowAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof CashFlowAvgAggregate>;
    @Field(() => CashFlowSumAggregate, {nullable:true})
    _sum?: InstanceType<typeof CashFlowSumAggregate>;
    @Field(() => CashFlowMinAggregate, {nullable:true})
    _min?: InstanceType<typeof CashFlowMinAggregate>;
    @Field(() => CashFlowMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof CashFlowMaxAggregate>;
}

@ArgsType()
export class CashFlowAggregateArgs {
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => [CashFlowOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<CashFlowOrderByWithRelationInput>;
    @Field(() => CashFlowWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => CashFlowCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof CashFlowCountAggregateInput>;
    @Field(() => CashFlowAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof CashFlowAvgAggregateInput>;
    @Field(() => CashFlowSumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof CashFlowSumAggregateInput>;
    @Field(() => CashFlowMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof CashFlowMinAggregateInput>;
    @Field(() => CashFlowMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof CashFlowMaxAggregateInput>;
}

@InputType()
export class CashFlowAvgAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    amount?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
}

@ObjectType()
export class CashFlowAvgAggregate {
    @Field(() => Float, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => Float, {nullable:true})
    propertyId?: number;
}

@InputType()
export class CashFlowAvgOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
}

@InputType()
export class CashFlowCountAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    amount?: true;
    @Field(() => Boolean, {nullable:true})
    type?: true;
    @Field(() => Boolean, {nullable:true})
    category?: true;
    @Field(() => Boolean, {nullable:true})
    date?: true;
    @Field(() => Boolean, {nullable:true})
    note?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
    @Field(() => Boolean, {nullable:true})
    _all?: true;
}

@ObjectType()
export class CashFlowCountAggregate {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => Int, {nullable:false})
    amount!: number;
    @Field(() => Int, {nullable:false})
    type!: number;
    @Field(() => Int, {nullable:false})
    category!: number;
    @Field(() => Int, {nullable:false})
    date!: number;
    @Field(() => Int, {nullable:false})
    note!: number;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Int, {nullable:false})
    createdAt!: number;
    @Field(() => Int, {nullable:false})
    updatedAt!: number;
    @Field(() => Int, {nullable:false})
    _all!: number;
}

@InputType()
export class CashFlowCountOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    type?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    category?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    date?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    note?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class CashFlowCreateManyPropertyInputEnvelope {
    @Field(() => [CashFlowCreateManyPropertyInput], {nullable:false})
    @Type(() => CashFlowCreateManyPropertyInput)
    data!: Array<CashFlowCreateManyPropertyInput>;
}

@InputType()
export class CashFlowCreateManyPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowCreateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowCreateNestedManyWithoutPropertyInput {
    @Field(() => [CashFlowCreateWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateWithoutPropertyInput)
    create?: Array<CashFlowCreateWithoutPropertyInput>;
    @Field(() => [CashFlowCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<CashFlowCreateOrConnectWithoutPropertyInput>;
    @Field(() => CashFlowCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => CashFlowCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof CashFlowCreateManyPropertyInputEnvelope>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
}

@InputType()
export class CashFlowCreateOrConnectWithoutPropertyInput {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => CashFlowCreateWithoutPropertyInput, {nullable:false})
    @Type(() => CashFlowCreateWithoutPropertyInput)
    create!: InstanceType<typeof CashFlowCreateWithoutPropertyInput>;
}

@InputType()
export class CashFlowCreateWithoutPropertyInput {
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowCreateInput {
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => PropertyCreateNestedOneWithoutCashFlowsInput, {nullable:false})
    property!: InstanceType<typeof PropertyCreateNestedOneWithoutCashFlowsInput>;
}

@ArgsType()
export class CashFlowGroupByArgs {
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => [CashFlowOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<CashFlowOrderByWithAggregationInput>;
    @Field(() => [CashFlowScalarFieldEnum], {nullable:false})
    by!: Array<`${CashFlowScalarFieldEnum}`>;
    @Field(() => CashFlowScalarWhereWithAggregatesInput, {nullable:true})
    having?: InstanceType<typeof CashFlowScalarWhereWithAggregatesInput>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => CashFlowCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof CashFlowCountAggregateInput>;
    @Field(() => CashFlowAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof CashFlowAvgAggregateInput>;
    @Field(() => CashFlowSumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof CashFlowSumAggregateInput>;
    @Field(() => CashFlowMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof CashFlowMinAggregateInput>;
    @Field(() => CashFlowMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof CashFlowMaxAggregateInput>;
}

@ObjectType()
export class CashFlowGroupBy {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;
    @Field(() => CashFlowCountAggregate, {nullable:true})
    _count?: InstanceType<typeof CashFlowCountAggregate>;
    @Field(() => CashFlowAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof CashFlowAvgAggregate>;
    @Field(() => CashFlowSumAggregate, {nullable:true})
    _sum?: InstanceType<typeof CashFlowSumAggregate>;
    @Field(() => CashFlowMinAggregate, {nullable:true})
    _min?: InstanceType<typeof CashFlowMinAggregate>;
    @Field(() => CashFlowMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof CashFlowMaxAggregate>;
}

@InputType()
export class CashFlowListRelationFilter {
    @Field(() => CashFlowWhereInput, {nullable:true})
    every?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => CashFlowWhereInput, {nullable:true})
    some?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => CashFlowWhereInput, {nullable:true})
    none?: InstanceType<typeof CashFlowWhereInput>;
}

@InputType()
export class CashFlowMaxAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    amount?: true;
    @Field(() => Boolean, {nullable:true})
    type?: true;
    @Field(() => Boolean, {nullable:true})
    category?: true;
    @Field(() => Boolean, {nullable:true})
    date?: true;
    @Field(() => Boolean, {nullable:true})
    note?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class CashFlowMaxAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowMaxOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    type?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    category?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    date?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    note?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class CashFlowMinAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    amount?: true;
    @Field(() => Boolean, {nullable:true})
    type?: true;
    @Field(() => Boolean, {nullable:true})
    category?: true;
    @Field(() => Boolean, {nullable:true})
    date?: true;
    @Field(() => Boolean, {nullable:true})
    note?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class CashFlowMinAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowMinOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    type?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    category?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    date?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    note?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class CashFlowOrderByRelationAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    _count?: `${SortOrder}`;
}

@InputType()
export class CashFlowOrderByWithAggregationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    type?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    category?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    date?: `${SortOrder}`;
    @Field(() => SortOrderInput, {nullable:true})
    note?: InstanceType<typeof SortOrderInput>;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => CashFlowCountOrderByAggregateInput, {nullable:true})
    _count?: InstanceType<typeof CashFlowCountOrderByAggregateInput>;
    @Field(() => CashFlowAvgOrderByAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof CashFlowAvgOrderByAggregateInput>;
    @Field(() => CashFlowMaxOrderByAggregateInput, {nullable:true})
    _max?: InstanceType<typeof CashFlowMaxOrderByAggregateInput>;
    @Field(() => CashFlowMinOrderByAggregateInput, {nullable:true})
    _min?: InstanceType<typeof CashFlowMinOrderByAggregateInput>;
    @Field(() => CashFlowSumOrderByAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof CashFlowSumOrderByAggregateInput>;
}

@InputType()
export class CashFlowOrderByWithRelationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    type?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    category?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    date?: `${SortOrder}`;
    @Field(() => SortOrderInput, {nullable:true})
    note?: InstanceType<typeof SortOrderInput>;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => PropertyOrderByWithRelationInput, {nullable:true})
    property?: InstanceType<typeof PropertyOrderByWithRelationInput>;
}

@InputType()
export class CashFlowScalarWhereWithAggregatesInput {
    @Field(() => [CashFlowScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<CashFlowScalarWhereWithAggregatesInput>;
    @Field(() => [CashFlowScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<CashFlowScalarWhereWithAggregatesInput>;
    @Field(() => [CashFlowScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<CashFlowScalarWhereWithAggregatesInput>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    id?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => FloatWithAggregatesFilter, {nullable:true})
    amount?: InstanceType<typeof FloatWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    type?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    category?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    date?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    note?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class CashFlowScalarWhereInput {
    @Field(() => [CashFlowScalarWhereInput], {nullable:true})
    AND?: Array<CashFlowScalarWhereInput>;
    @Field(() => [CashFlowScalarWhereInput], {nullable:true})
    OR?: Array<CashFlowScalarWhereInput>;
    @Field(() => [CashFlowScalarWhereInput], {nullable:true})
    NOT?: Array<CashFlowScalarWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => FloatFilter, {nullable:true})
    amount?: InstanceType<typeof FloatFilter>;
    @Field(() => StringFilter, {nullable:true})
    type?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    category?: InstanceType<typeof StringFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    date?: InstanceType<typeof DateTimeFilter>;
    @Field(() => StringFilter, {nullable:true})
    note?: InstanceType<typeof StringFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class CashFlowSumAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    amount?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
}

@ObjectType()
export class CashFlowSumAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
}

@InputType()
export class CashFlowSumOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    amount?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
}

@InputType()
export class CashFlowUncheckedCreateNestedManyWithoutPropertyInput {
    @Field(() => [CashFlowCreateWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateWithoutPropertyInput)
    create?: Array<CashFlowCreateWithoutPropertyInput>;
    @Field(() => [CashFlowCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<CashFlowCreateOrConnectWithoutPropertyInput>;
    @Field(() => CashFlowCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => CashFlowCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof CashFlowCreateManyPropertyInputEnvelope>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
}

@InputType()
export class CashFlowUncheckedCreateWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUncheckedCreateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUncheckedUpdateManyWithoutPropertyNestedInput {
    @Field(() => [CashFlowCreateWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateWithoutPropertyInput)
    create?: Array<CashFlowCreateWithoutPropertyInput>;
    @Field(() => [CashFlowCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<CashFlowCreateOrConnectWithoutPropertyInput>;
    @Field(() => [CashFlowUpsertWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowUpsertWithWhereUniqueWithoutPropertyInput)
    upsert?: Array<CashFlowUpsertWithWhereUniqueWithoutPropertyInput>;
    @Field(() => CashFlowCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => CashFlowCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof CashFlowCreateManyPropertyInputEnvelope>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    set?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowUpdateWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowUpdateWithWhereUniqueWithoutPropertyInput)
    update?: Array<CashFlowUpdateWithWhereUniqueWithoutPropertyInput>;
    @Field(() => [CashFlowUpdateManyWithWhereWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowUpdateManyWithWhereWithoutPropertyInput)
    updateMany?: Array<CashFlowUpdateManyWithWhereWithoutPropertyInput>;
    @Field(() => [CashFlowScalarWhereInput], {nullable:true})
    @Type(() => CashFlowScalarWhereInput)
    deleteMany?: Array<CashFlowScalarWhereInput>;
}

@InputType()
export class CashFlowUncheckedUpdateManyWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUncheckedUpdateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUncheckedUpdateWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUncheckedUpdateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUpdateManyMutationInput {
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUpdateManyWithWhereWithoutPropertyInput {
    @Field(() => CashFlowScalarWhereInput, {nullable:false})
    @Type(() => CashFlowScalarWhereInput)
    where!: InstanceType<typeof CashFlowScalarWhereInput>;
    @Field(() => CashFlowUpdateManyMutationInput, {nullable:false})
    @Type(() => CashFlowUpdateManyMutationInput)
    data!: InstanceType<typeof CashFlowUpdateManyMutationInput>;
}

@InputType()
export class CashFlowUpdateManyWithoutPropertyNestedInput {
    @Field(() => [CashFlowCreateWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateWithoutPropertyInput)
    create?: Array<CashFlowCreateWithoutPropertyInput>;
    @Field(() => [CashFlowCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<CashFlowCreateOrConnectWithoutPropertyInput>;
    @Field(() => [CashFlowUpsertWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowUpsertWithWhereUniqueWithoutPropertyInput)
    upsert?: Array<CashFlowUpsertWithWhereUniqueWithoutPropertyInput>;
    @Field(() => CashFlowCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => CashFlowCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof CashFlowCreateManyPropertyInputEnvelope>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    set?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowWhereUniqueInput], {nullable:true})
    @Type(() => CashFlowWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>>;
    @Field(() => [CashFlowUpdateWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowUpdateWithWhereUniqueWithoutPropertyInput)
    update?: Array<CashFlowUpdateWithWhereUniqueWithoutPropertyInput>;
    @Field(() => [CashFlowUpdateManyWithWhereWithoutPropertyInput], {nullable:true})
    @Type(() => CashFlowUpdateManyWithWhereWithoutPropertyInput)
    updateMany?: Array<CashFlowUpdateManyWithWhereWithoutPropertyInput>;
    @Field(() => [CashFlowScalarWhereInput], {nullable:true})
    @Type(() => CashFlowScalarWhereInput)
    deleteMany?: Array<CashFlowScalarWhereInput>;
}

@InputType()
export class CashFlowUpdateWithWhereUniqueWithoutPropertyInput {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => CashFlowUpdateWithoutPropertyInput, {nullable:false})
    @Type(() => CashFlowUpdateWithoutPropertyInput)
    data!: InstanceType<typeof CashFlowUpdateWithoutPropertyInput>;
}

@InputType()
export class CashFlowUpdateWithoutPropertyInput {
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class CashFlowUpdateInput {
    @Field(() => Float, {nullable:true})
    amount?: number;
    @Field(() => String, {nullable:true})
    type?: string;
    @Field(() => String, {nullable:true})
    category?: string;
    @Field(() => Date, {nullable:true})
    date?: Date | string;
    @Field(() => String, {nullable:true})
    note?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => PropertyUpdateOneRequiredWithoutCashFlowsNestedInput, {nullable:true})
    property?: InstanceType<typeof PropertyUpdateOneRequiredWithoutCashFlowsNestedInput>;
}

@InputType()
export class CashFlowUpsertWithWhereUniqueWithoutPropertyInput {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => CashFlowUpdateWithoutPropertyInput, {nullable:false})
    @Type(() => CashFlowUpdateWithoutPropertyInput)
    update!: InstanceType<typeof CashFlowUpdateWithoutPropertyInput>;
    @Field(() => CashFlowCreateWithoutPropertyInput, {nullable:false})
    @Type(() => CashFlowCreateWithoutPropertyInput)
    create!: InstanceType<typeof CashFlowCreateWithoutPropertyInput>;
}

@InputType()
export class CashFlowWhereUniqueInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => [CashFlowWhereInput], {nullable:true})
    AND?: Array<CashFlowWhereInput>;
    @Field(() => [CashFlowWhereInput], {nullable:true})
    OR?: Array<CashFlowWhereInput>;
    @Field(() => [CashFlowWhereInput], {nullable:true})
    NOT?: Array<CashFlowWhereInput>;
    @Field(() => FloatFilter, {nullable:true})
    amount?: InstanceType<typeof FloatFilter>;
    @Field(() => StringFilter, {nullable:true})
    type?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    category?: InstanceType<typeof StringFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    date?: InstanceType<typeof DateTimeFilter>;
    @Field(() => StringFilter, {nullable:true})
    note?: InstanceType<typeof StringFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => PropertyScalarRelationFilter, {nullable:true})
    property?: InstanceType<typeof PropertyScalarRelationFilter>;
}

@InputType()
export class CashFlowWhereInput {
    @Field(() => [CashFlowWhereInput], {nullable:true})
    AND?: Array<CashFlowWhereInput>;
    @Field(() => [CashFlowWhereInput], {nullable:true})
    OR?: Array<CashFlowWhereInput>;
    @Field(() => [CashFlowWhereInput], {nullable:true})
    NOT?: Array<CashFlowWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => FloatFilter, {nullable:true})
    amount?: InstanceType<typeof FloatFilter>;
    @Field(() => StringFilter, {nullable:true})
    type?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    category?: InstanceType<typeof StringFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    date?: InstanceType<typeof DateTimeFilter>;
    @Field(() => StringFilter, {nullable:true})
    note?: InstanceType<typeof StringFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => PropertyScalarRelationFilter, {nullable:true})
    property?: InstanceType<typeof PropertyScalarRelationFilter>;
}

@ObjectType()
export class CashFlow {
    @Field(() => ID, {nullable:false})
    id!: number;
    @Field(() => Float, {nullable:false})
    amount!: number;
    @Field(() => String, {nullable:false})
    type!: string;
    @Field(() => String, {nullable:false})
    category!: string;
    @Field(() => Date, {nullable:false})
    date!: Date;
    @Field(() => String, {nullable:true})
    note!: string | null;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:false})
    createdAt!: Date;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date;
    @Field(() => Property, {nullable:false})
    property?: InstanceType<typeof Property>;
}

@ArgsType()
export class CreateManyCashFlowArgs {
    @Field(() => [CashFlowCreateManyInput], {nullable:false})
    @Type(() => CashFlowCreateManyInput)
    data!: Array<CashFlowCreateManyInput>;
}

@ArgsType()
export class CreateOneCashFlowArgs {
    @Field(() => CashFlowCreateInput, {nullable:false})
    @Type(() => CashFlowCreateInput)
    data!: InstanceType<typeof CashFlowCreateInput>;
}

@ArgsType()
export class DeleteManyCashFlowArgs {
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class DeleteOneCashFlowArgs {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindFirstCashFlowOrThrowArgs {
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => [CashFlowOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<CashFlowOrderByWithRelationInput>;
    @Field(() => CashFlowWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [CashFlowScalarFieldEnum], {nullable:true})
    distinct?: Array<`${CashFlowScalarFieldEnum}`>;
}

@ArgsType()
export class FindFirstCashFlowArgs {
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => [CashFlowOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<CashFlowOrderByWithRelationInput>;
    @Field(() => CashFlowWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [CashFlowScalarFieldEnum], {nullable:true})
    distinct?: Array<`${CashFlowScalarFieldEnum}`>;
}

@ArgsType()
export class FindManyCashFlowArgs {
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => [CashFlowOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<CashFlowOrderByWithRelationInput>;
    @Field(() => CashFlowWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [CashFlowScalarFieldEnum], {nullable:true})
    distinct?: Array<`${CashFlowScalarFieldEnum}`>;
}

@ArgsType()
export class FindUniqueCashFlowOrThrowArgs {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindUniqueCashFlowArgs {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
}

@ArgsType()
export class UpdateManyCashFlowArgs {
    @Field(() => CashFlowUpdateManyMutationInput, {nullable:false})
    @Type(() => CashFlowUpdateManyMutationInput)
    data!: InstanceType<typeof CashFlowUpdateManyMutationInput>;
    @Field(() => CashFlowWhereInput, {nullable:true})
    @Type(() => CashFlowWhereInput)
    where?: InstanceType<typeof CashFlowWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class UpdateOneCashFlowArgs {
    @Field(() => CashFlowUpdateInput, {nullable:false})
    @Type(() => CashFlowUpdateInput)
    data!: InstanceType<typeof CashFlowUpdateInput>;
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
}

@ArgsType()
export class UpsertOneCashFlowArgs {
    @Field(() => CashFlowWhereUniqueInput, {nullable:false})
    @Type(() => CashFlowWhereUniqueInput)
    where!: Prisma.AtLeast<CashFlowWhereUniqueInput, 'id'>;
    @Field(() => CashFlowCreateInput, {nullable:false})
    @Type(() => CashFlowCreateInput)
    create!: InstanceType<typeof CashFlowCreateInput>;
    @Field(() => CashFlowUpdateInput, {nullable:false})
    @Type(() => CashFlowUpdateInput)
    update!: InstanceType<typeof CashFlowUpdateInput>;
}

@ObjectType()
export class AggregateLease {
    @Field(() => LeaseCountAggregate, {nullable:true})
    _count?: InstanceType<typeof LeaseCountAggregate>;
    @Field(() => LeaseAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof LeaseAvgAggregate>;
    @Field(() => LeaseSumAggregate, {nullable:true})
    _sum?: InstanceType<typeof LeaseSumAggregate>;
    @Field(() => LeaseMinAggregate, {nullable:true})
    _min?: InstanceType<typeof LeaseMinAggregate>;
    @Field(() => LeaseMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof LeaseMaxAggregate>;
}

@ArgsType()
export class CreateManyLeaseArgs {
    @Field(() => [LeaseCreateManyInput], {nullable:false})
    @Type(() => LeaseCreateManyInput)
    data!: Array<LeaseCreateManyInput>;
}

@ArgsType()
export class CreateOneLeaseArgs {
    @Field(() => LeaseCreateInput, {nullable:false})
    @Type(() => LeaseCreateInput)
    data!: InstanceType<typeof LeaseCreateInput>;
}

@ArgsType()
export class DeleteManyLeaseArgs {
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class DeleteOneLeaseArgs {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindFirstLeaseOrThrowArgs {
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => [LeaseOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<LeaseOrderByWithRelationInput>;
    @Field(() => LeaseWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [LeaseScalarFieldEnum], {nullable:true})
    distinct?: Array<`${LeaseScalarFieldEnum}`>;
}

@ArgsType()
export class FindFirstLeaseArgs {
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => [LeaseOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<LeaseOrderByWithRelationInput>;
    @Field(() => LeaseWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [LeaseScalarFieldEnum], {nullable:true})
    distinct?: Array<`${LeaseScalarFieldEnum}`>;
}

@ArgsType()
export class FindManyLeaseArgs {
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => [LeaseOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<LeaseOrderByWithRelationInput>;
    @Field(() => LeaseWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [LeaseScalarFieldEnum], {nullable:true})
    distinct?: Array<`${LeaseScalarFieldEnum}`>;
}

@ArgsType()
export class FindUniqueLeaseOrThrowArgs {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindUniqueLeaseArgs {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
}

@ArgsType()
export class LeaseAggregateArgs {
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => [LeaseOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<LeaseOrderByWithRelationInput>;
    @Field(() => LeaseWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => LeaseCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof LeaseCountAggregateInput>;
    @Field(() => LeaseAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof LeaseAvgAggregateInput>;
    @Field(() => LeaseSumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof LeaseSumAggregateInput>;
    @Field(() => LeaseMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof LeaseMinAggregateInput>;
    @Field(() => LeaseMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof LeaseMaxAggregateInput>;
}

@InputType()
export class LeaseAvgAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    monthlyRent?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
}

@ObjectType()
export class LeaseAvgAggregate {
    @Field(() => Float, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => Float, {nullable:true})
    propertyId?: number;
}

@InputType()
export class LeaseAvgOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
}

@InputType()
export class LeaseCountAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    startDate?: true;
    @Field(() => Boolean, {nullable:true})
    endDate?: true;
    @Field(() => Boolean, {nullable:true})
    monthlyRent?: true;
    @Field(() => Boolean, {nullable:true})
    tenantName?: true;
    @Field(() => Boolean, {nullable:true})
    tenantEmail?: true;
    @Field(() => Boolean, {nullable:true})
    tenantPhone?: true;
    @Field(() => Boolean, {nullable:true})
    isActive?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
    @Field(() => Boolean, {nullable:true})
    _all?: true;
}

@ObjectType()
export class LeaseCountAggregate {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => Int, {nullable:false})
    startDate!: number;
    @Field(() => Int, {nullable:false})
    endDate!: number;
    @Field(() => Int, {nullable:false})
    monthlyRent!: number;
    @Field(() => Int, {nullable:false})
    tenantName!: number;
    @Field(() => Int, {nullable:false})
    tenantEmail!: number;
    @Field(() => Int, {nullable:false})
    tenantPhone!: number;
    @Field(() => Int, {nullable:false})
    isActive!: number;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Int, {nullable:false})
    createdAt!: number;
    @Field(() => Int, {nullable:false})
    updatedAt!: number;
    @Field(() => Int, {nullable:false})
    _all!: number;
}

@InputType()
export class LeaseCountOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    startDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    endDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantName?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantEmail?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantPhone?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    isActive?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class LeaseCreateManyPropertyInputEnvelope {
    @Field(() => [LeaseCreateManyPropertyInput], {nullable:false})
    @Type(() => LeaseCreateManyPropertyInput)
    data!: Array<LeaseCreateManyPropertyInput>;
}

@InputType()
export class LeaseCreateManyPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseCreateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseCreateNestedManyWithoutPropertyInput {
    @Field(() => [LeaseCreateWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateWithoutPropertyInput)
    create?: Array<LeaseCreateWithoutPropertyInput>;
    @Field(() => [LeaseCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<LeaseCreateOrConnectWithoutPropertyInput>;
    @Field(() => LeaseCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => LeaseCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof LeaseCreateManyPropertyInputEnvelope>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
}

@InputType()
export class LeaseCreateOrConnectWithoutPropertyInput {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => LeaseCreateWithoutPropertyInput, {nullable:false})
    @Type(() => LeaseCreateWithoutPropertyInput)
    create!: InstanceType<typeof LeaseCreateWithoutPropertyInput>;
}

@InputType()
export class LeaseCreateWithoutPropertyInput {
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseCreateInput {
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => PropertyCreateNestedOneWithoutLeasesInput, {nullable:false})
    property!: InstanceType<typeof PropertyCreateNestedOneWithoutLeasesInput>;
}

@ArgsType()
export class LeaseGroupByArgs {
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => [LeaseOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<LeaseOrderByWithAggregationInput>;
    @Field(() => [LeaseScalarFieldEnum], {nullable:false})
    by!: Array<`${LeaseScalarFieldEnum}`>;
    @Field(() => LeaseScalarWhereWithAggregatesInput, {nullable:true})
    having?: InstanceType<typeof LeaseScalarWhereWithAggregatesInput>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => LeaseCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof LeaseCountAggregateInput>;
    @Field(() => LeaseAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof LeaseAvgAggregateInput>;
    @Field(() => LeaseSumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof LeaseSumAggregateInput>;
    @Field(() => LeaseMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof LeaseMinAggregateInput>;
    @Field(() => LeaseMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof LeaseMaxAggregateInput>;
}

@ObjectType()
export class LeaseGroupBy {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:false})
    isActive!: boolean;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;
    @Field(() => LeaseCountAggregate, {nullable:true})
    _count?: InstanceType<typeof LeaseCountAggregate>;
    @Field(() => LeaseAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof LeaseAvgAggregate>;
    @Field(() => LeaseSumAggregate, {nullable:true})
    _sum?: InstanceType<typeof LeaseSumAggregate>;
    @Field(() => LeaseMinAggregate, {nullable:true})
    _min?: InstanceType<typeof LeaseMinAggregate>;
    @Field(() => LeaseMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof LeaseMaxAggregate>;
}

@InputType()
export class LeaseListRelationFilter {
    @Field(() => LeaseWhereInput, {nullable:true})
    every?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => LeaseWhereInput, {nullable:true})
    some?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => LeaseWhereInput, {nullable:true})
    none?: InstanceType<typeof LeaseWhereInput>;
}

@InputType()
export class LeaseMaxAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    startDate?: true;
    @Field(() => Boolean, {nullable:true})
    endDate?: true;
    @Field(() => Boolean, {nullable:true})
    monthlyRent?: true;
    @Field(() => Boolean, {nullable:true})
    tenantName?: true;
    @Field(() => Boolean, {nullable:true})
    tenantEmail?: true;
    @Field(() => Boolean, {nullable:true})
    tenantPhone?: true;
    @Field(() => Boolean, {nullable:true})
    isActive?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class LeaseMaxAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseMaxOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    startDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    endDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantName?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantEmail?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantPhone?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    isActive?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class LeaseMinAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    startDate?: true;
    @Field(() => Boolean, {nullable:true})
    endDate?: true;
    @Field(() => Boolean, {nullable:true})
    monthlyRent?: true;
    @Field(() => Boolean, {nullable:true})
    tenantName?: true;
    @Field(() => Boolean, {nullable:true})
    tenantEmail?: true;
    @Field(() => Boolean, {nullable:true})
    tenantPhone?: true;
    @Field(() => Boolean, {nullable:true})
    isActive?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class LeaseMinAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseMinOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    startDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    endDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantName?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantEmail?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantPhone?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    isActive?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class LeaseOrderByRelationAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    _count?: `${SortOrder}`;
}

@InputType()
export class LeaseOrderByWithAggregationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    startDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    endDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantName?: `${SortOrder}`;
    @Field(() => SortOrderInput, {nullable:true})
    tenantEmail?: InstanceType<typeof SortOrderInput>;
    @Field(() => SortOrderInput, {nullable:true})
    tenantPhone?: InstanceType<typeof SortOrderInput>;
    @Field(() => SortOrder, {nullable:true})
    isActive?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => LeaseCountOrderByAggregateInput, {nullable:true})
    _count?: InstanceType<typeof LeaseCountOrderByAggregateInput>;
    @Field(() => LeaseAvgOrderByAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof LeaseAvgOrderByAggregateInput>;
    @Field(() => LeaseMaxOrderByAggregateInput, {nullable:true})
    _max?: InstanceType<typeof LeaseMaxOrderByAggregateInput>;
    @Field(() => LeaseMinOrderByAggregateInput, {nullable:true})
    _min?: InstanceType<typeof LeaseMinOrderByAggregateInput>;
    @Field(() => LeaseSumOrderByAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof LeaseSumOrderByAggregateInput>;
}

@InputType()
export class LeaseOrderByWithRelationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    startDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    endDate?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    tenantName?: `${SortOrder}`;
    @Field(() => SortOrderInput, {nullable:true})
    tenantEmail?: InstanceType<typeof SortOrderInput>;
    @Field(() => SortOrderInput, {nullable:true})
    tenantPhone?: InstanceType<typeof SortOrderInput>;
    @Field(() => SortOrder, {nullable:true})
    isActive?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => PropertyOrderByWithRelationInput, {nullable:true})
    property?: InstanceType<typeof PropertyOrderByWithRelationInput>;
}

@InputType()
export class LeaseScalarWhereWithAggregatesInput {
    @Field(() => [LeaseScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<LeaseScalarWhereWithAggregatesInput>;
    @Field(() => [LeaseScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<LeaseScalarWhereWithAggregatesInput>;
    @Field(() => [LeaseScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<LeaseScalarWhereWithAggregatesInput>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    id?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    startDate?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    endDate?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => FloatWithAggregatesFilter, {nullable:true})
    monthlyRent?: InstanceType<typeof FloatWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    tenantName?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    tenantEmail?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    tenantPhone?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => BoolWithAggregatesFilter, {nullable:true})
    isActive?: InstanceType<typeof BoolWithAggregatesFilter>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class LeaseScalarWhereInput {
    @Field(() => [LeaseScalarWhereInput], {nullable:true})
    AND?: Array<LeaseScalarWhereInput>;
    @Field(() => [LeaseScalarWhereInput], {nullable:true})
    OR?: Array<LeaseScalarWhereInput>;
    @Field(() => [LeaseScalarWhereInput], {nullable:true})
    NOT?: Array<LeaseScalarWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    startDate?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    endDate?: InstanceType<typeof DateTimeFilter>;
    @Field(() => FloatFilter, {nullable:true})
    monthlyRent?: InstanceType<typeof FloatFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantName?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantEmail?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantPhone?: InstanceType<typeof StringFilter>;
    @Field(() => BoolFilter, {nullable:true})
    isActive?: InstanceType<typeof BoolFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class LeaseSumAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    monthlyRent?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
}

@ObjectType()
export class LeaseSumAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
}

@InputType()
export class LeaseSumOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    monthlyRent?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
}

@InputType()
export class LeaseUncheckedCreateNestedManyWithoutPropertyInput {
    @Field(() => [LeaseCreateWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateWithoutPropertyInput)
    create?: Array<LeaseCreateWithoutPropertyInput>;
    @Field(() => [LeaseCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<LeaseCreateOrConnectWithoutPropertyInput>;
    @Field(() => LeaseCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => LeaseCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof LeaseCreateManyPropertyInputEnvelope>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
}

@InputType()
export class LeaseUncheckedCreateWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUncheckedCreateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:false})
    startDate!: Date | string;
    @Field(() => Date, {nullable:false})
    endDate!: Date | string;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUncheckedUpdateManyWithoutPropertyNestedInput {
    @Field(() => [LeaseCreateWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateWithoutPropertyInput)
    create?: Array<LeaseCreateWithoutPropertyInput>;
    @Field(() => [LeaseCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<LeaseCreateOrConnectWithoutPropertyInput>;
    @Field(() => [LeaseUpsertWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseUpsertWithWhereUniqueWithoutPropertyInput)
    upsert?: Array<LeaseUpsertWithWhereUniqueWithoutPropertyInput>;
    @Field(() => LeaseCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => LeaseCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof LeaseCreateManyPropertyInputEnvelope>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    set?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseUpdateWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseUpdateWithWhereUniqueWithoutPropertyInput)
    update?: Array<LeaseUpdateWithWhereUniqueWithoutPropertyInput>;
    @Field(() => [LeaseUpdateManyWithWhereWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseUpdateManyWithWhereWithoutPropertyInput)
    updateMany?: Array<LeaseUpdateManyWithWhereWithoutPropertyInput>;
    @Field(() => [LeaseScalarWhereInput], {nullable:true})
    @Type(() => LeaseScalarWhereInput)
    deleteMany?: Array<LeaseScalarWhereInput>;
}

@InputType()
export class LeaseUncheckedUpdateManyWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUncheckedUpdateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUncheckedUpdateWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUncheckedUpdateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUpdateManyMutationInput {
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUpdateManyWithWhereWithoutPropertyInput {
    @Field(() => LeaseScalarWhereInput, {nullable:false})
    @Type(() => LeaseScalarWhereInput)
    where!: InstanceType<typeof LeaseScalarWhereInput>;
    @Field(() => LeaseUpdateManyMutationInput, {nullable:false})
    @Type(() => LeaseUpdateManyMutationInput)
    data!: InstanceType<typeof LeaseUpdateManyMutationInput>;
}

@InputType()
export class LeaseUpdateManyWithoutPropertyNestedInput {
    @Field(() => [LeaseCreateWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateWithoutPropertyInput)
    create?: Array<LeaseCreateWithoutPropertyInput>;
    @Field(() => [LeaseCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<LeaseCreateOrConnectWithoutPropertyInput>;
    @Field(() => [LeaseUpsertWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseUpsertWithWhereUniqueWithoutPropertyInput)
    upsert?: Array<LeaseUpsertWithWhereUniqueWithoutPropertyInput>;
    @Field(() => LeaseCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => LeaseCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof LeaseCreateManyPropertyInputEnvelope>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    set?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseWhereUniqueInput], {nullable:true})
    @Type(() => LeaseWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>>;
    @Field(() => [LeaseUpdateWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseUpdateWithWhereUniqueWithoutPropertyInput)
    update?: Array<LeaseUpdateWithWhereUniqueWithoutPropertyInput>;
    @Field(() => [LeaseUpdateManyWithWhereWithoutPropertyInput], {nullable:true})
    @Type(() => LeaseUpdateManyWithWhereWithoutPropertyInput)
    updateMany?: Array<LeaseUpdateManyWithWhereWithoutPropertyInput>;
    @Field(() => [LeaseScalarWhereInput], {nullable:true})
    @Type(() => LeaseScalarWhereInput)
    deleteMany?: Array<LeaseScalarWhereInput>;
}

@InputType()
export class LeaseUpdateWithWhereUniqueWithoutPropertyInput {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => LeaseUpdateWithoutPropertyInput, {nullable:false})
    @Type(() => LeaseUpdateWithoutPropertyInput)
    data!: InstanceType<typeof LeaseUpdateWithoutPropertyInput>;
}

@InputType()
export class LeaseUpdateWithoutPropertyInput {
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class LeaseUpdateInput {
    @Field(() => Date, {nullable:true})
    startDate?: Date | string;
    @Field(() => Date, {nullable:true})
    endDate?: Date | string;
    @Field(() => Float, {nullable:true})
    monthlyRent?: number;
    @Field(() => String, {nullable:true})
    tenantName?: string;
    @Field(() => String, {nullable:true})
    tenantEmail?: string;
    @Field(() => String, {nullable:true})
    tenantPhone?: string;
    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => PropertyUpdateOneRequiredWithoutLeasesNestedInput, {nullable:true})
    property?: InstanceType<typeof PropertyUpdateOneRequiredWithoutLeasesNestedInput>;
}

@InputType()
export class LeaseUpsertWithWhereUniqueWithoutPropertyInput {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => LeaseUpdateWithoutPropertyInput, {nullable:false})
    @Type(() => LeaseUpdateWithoutPropertyInput)
    update!: InstanceType<typeof LeaseUpdateWithoutPropertyInput>;
    @Field(() => LeaseCreateWithoutPropertyInput, {nullable:false})
    @Type(() => LeaseCreateWithoutPropertyInput)
    create!: InstanceType<typeof LeaseCreateWithoutPropertyInput>;
}

@InputType()
export class LeaseWhereUniqueInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => [LeaseWhereInput], {nullable:true})
    AND?: Array<LeaseWhereInput>;
    @Field(() => [LeaseWhereInput], {nullable:true})
    OR?: Array<LeaseWhereInput>;
    @Field(() => [LeaseWhereInput], {nullable:true})
    NOT?: Array<LeaseWhereInput>;
    @Field(() => DateTimeFilter, {nullable:true})
    startDate?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    endDate?: InstanceType<typeof DateTimeFilter>;
    @Field(() => FloatFilter, {nullable:true})
    monthlyRent?: InstanceType<typeof FloatFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantName?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantEmail?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantPhone?: InstanceType<typeof StringFilter>;
    @Field(() => BoolFilter, {nullable:true})
    isActive?: InstanceType<typeof BoolFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => PropertyScalarRelationFilter, {nullable:true})
    property?: InstanceType<typeof PropertyScalarRelationFilter>;
}

@InputType()
export class LeaseWhereInput {
    @Field(() => [LeaseWhereInput], {nullable:true})
    AND?: Array<LeaseWhereInput>;
    @Field(() => [LeaseWhereInput], {nullable:true})
    OR?: Array<LeaseWhereInput>;
    @Field(() => [LeaseWhereInput], {nullable:true})
    NOT?: Array<LeaseWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    startDate?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    endDate?: InstanceType<typeof DateTimeFilter>;
    @Field(() => FloatFilter, {nullable:true})
    monthlyRent?: InstanceType<typeof FloatFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantName?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantEmail?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    tenantPhone?: InstanceType<typeof StringFilter>;
    @Field(() => BoolFilter, {nullable:true})
    isActive?: InstanceType<typeof BoolFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => PropertyScalarRelationFilter, {nullable:true})
    property?: InstanceType<typeof PropertyScalarRelationFilter>;
}

@ObjectType()
export class Lease {
    @Field(() => ID, {nullable:false})
    id!: number;
    @Field(() => Date, {nullable:false})
    startDate!: Date;
    @Field(() => Date, {nullable:false})
    endDate!: Date;
    @Field(() => Float, {nullable:false})
    monthlyRent!: number;
    @Field(() => String, {nullable:false})
    tenantName!: string;
    @Field(() => String, {nullable:true})
    tenantEmail!: string | null;
    @Field(() => String, {nullable:true})
    tenantPhone!: string | null;
    @Field(() => Boolean, {defaultValue:true,nullable:false})
    isActive!: boolean;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:false})
    createdAt!: Date;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date;
    @Field(() => Property, {nullable:false})
    property?: InstanceType<typeof Property>;
}

@ArgsType()
export class UpdateManyLeaseArgs {
    @Field(() => LeaseUpdateManyMutationInput, {nullable:false})
    @Type(() => LeaseUpdateManyMutationInput)
    data!: InstanceType<typeof LeaseUpdateManyMutationInput>;
    @Field(() => LeaseWhereInput, {nullable:true})
    @Type(() => LeaseWhereInput)
    where?: InstanceType<typeof LeaseWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class UpdateOneLeaseArgs {
    @Field(() => LeaseUpdateInput, {nullable:false})
    @Type(() => LeaseUpdateInput)
    data!: InstanceType<typeof LeaseUpdateInput>;
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
}

@ArgsType()
export class UpsertOneLeaseArgs {
    @Field(() => LeaseWhereUniqueInput, {nullable:false})
    @Type(() => LeaseWhereUniqueInput)
    where!: Prisma.AtLeast<LeaseWhereUniqueInput, 'id'>;
    @Field(() => LeaseCreateInput, {nullable:false})
    @Type(() => LeaseCreateInput)
    create!: InstanceType<typeof LeaseCreateInput>;
    @Field(() => LeaseUpdateInput, {nullable:false})
    @Type(() => LeaseUpdateInput)
    update!: InstanceType<typeof LeaseUpdateInput>;
}

@ObjectType()
export class AffectedRows {
    @Field(() => Int, {nullable:false})
    count!: number;
}

@InputType()
export class BoolFilter {
    @Field(() => Boolean, {nullable:true})
    equals?: boolean;
    @Field(() => BoolFilter, {nullable:true})
    not?: InstanceType<typeof BoolFilter>;
}

@InputType()
export class BoolWithAggregatesFilter {
    @Field(() => Boolean, {nullable:true})
    equals?: boolean;
    @Field(() => BoolWithAggregatesFilter, {nullable:true})
    not?: InstanceType<typeof BoolWithAggregatesFilter>;
    @Field(() => IntFilter, {nullable:true})
    _count?: InstanceType<typeof IntFilter>;
    @Field(() => BoolFilter, {nullable:true})
    _min?: InstanceType<typeof BoolFilter>;
    @Field(() => BoolFilter, {nullable:true})
    _max?: InstanceType<typeof BoolFilter>;
}

@InputType()
export class DateTimeFilter {
    @Field(() => Date, {nullable:true})
    equals?: Date | string;
    @Field(() => [Date], {nullable:true})
    in?: Array<Date> | Array<string>;
    @Field(() => [Date], {nullable:true})
    notIn?: Array<Date> | Array<string>;
    @Field(() => Date, {nullable:true})
    lt?: Date | string;
    @Field(() => Date, {nullable:true})
    lte?: Date | string;
    @Field(() => Date, {nullable:true})
    gt?: Date | string;
    @Field(() => Date, {nullable:true})
    gte?: Date | string;
    @Field(() => DateTimeFilter, {nullable:true})
    not?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class DateTimeWithAggregatesFilter {
    @Field(() => Date, {nullable:true})
    equals?: Date | string;
    @Field(() => [Date], {nullable:true})
    in?: Array<Date> | Array<string>;
    @Field(() => [Date], {nullable:true})
    notIn?: Array<Date> | Array<string>;
    @Field(() => Date, {nullable:true})
    lt?: Date | string;
    @Field(() => Date, {nullable:true})
    lte?: Date | string;
    @Field(() => Date, {nullable:true})
    gt?: Date | string;
    @Field(() => Date, {nullable:true})
    gte?: Date | string;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    not?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => IntFilter, {nullable:true})
    _count?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    _min?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    _max?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class FloatFilter {
    @Field(() => Float, {nullable:true})
    equals?: number;
    @Field(() => [Float], {nullable:true})
    in?: Array<number>;
    @Field(() => [Float], {nullable:true})
    notIn?: Array<number>;
    @Field(() => Float, {nullable:true})
    lt?: number;
    @Field(() => Float, {nullable:true})
    lte?: number;
    @Field(() => Float, {nullable:true})
    gt?: number;
    @Field(() => Float, {nullable:true})
    gte?: number;
    @Field(() => FloatFilter, {nullable:true})
    not?: InstanceType<typeof FloatFilter>;
}

@InputType()
export class FloatWithAggregatesFilter {
    @Field(() => Float, {nullable:true})
    equals?: number;
    @Field(() => [Float], {nullable:true})
    in?: Array<number>;
    @Field(() => [Float], {nullable:true})
    notIn?: Array<number>;
    @Field(() => Float, {nullable:true})
    lt?: number;
    @Field(() => Float, {nullable:true})
    lte?: number;
    @Field(() => Float, {nullable:true})
    gt?: number;
    @Field(() => Float, {nullable:true})
    gte?: number;
    @Field(() => FloatWithAggregatesFilter, {nullable:true})
    not?: InstanceType<typeof FloatWithAggregatesFilter>;
    @Field(() => IntFilter, {nullable:true})
    _count?: InstanceType<typeof IntFilter>;
    @Field(() => FloatFilter, {nullable:true})
    _avg?: InstanceType<typeof FloatFilter>;
    @Field(() => FloatFilter, {nullable:true})
    _sum?: InstanceType<typeof FloatFilter>;
    @Field(() => FloatFilter, {nullable:true})
    _min?: InstanceType<typeof FloatFilter>;
    @Field(() => FloatFilter, {nullable:true})
    _max?: InstanceType<typeof FloatFilter>;
}

@InputType()
export class IntFilter {
    @Field(() => Int, {nullable:true})
    equals?: number;
    @Field(() => [Int], {nullable:true})
    in?: Array<number>;
    @Field(() => [Int], {nullable:true})
    notIn?: Array<number>;
    @Field(() => Int, {nullable:true})
    lt?: number;
    @Field(() => Int, {nullable:true})
    lte?: number;
    @Field(() => Int, {nullable:true})
    gt?: number;
    @Field(() => Int, {nullable:true})
    gte?: number;
    @Field(() => IntFilter, {nullable:true})
    not?: InstanceType<typeof IntFilter>;
}

@InputType()
export class IntWithAggregatesFilter {
    @Field(() => Int, {nullable:true})
    equals?: number;
    @Field(() => [Int], {nullable:true})
    in?: Array<number>;
    @Field(() => [Int], {nullable:true})
    notIn?: Array<number>;
    @Field(() => Int, {nullable:true})
    lt?: number;
    @Field(() => Int, {nullable:true})
    lte?: number;
    @Field(() => Int, {nullable:true})
    gt?: number;
    @Field(() => Int, {nullable:true})
    gte?: number;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    not?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => IntFilter, {nullable:true})
    _count?: InstanceType<typeof IntFilter>;
    @Field(() => FloatFilter, {nullable:true})
    _avg?: InstanceType<typeof FloatFilter>;
    @Field(() => IntFilter, {nullable:true})
    _sum?: InstanceType<typeof IntFilter>;
    @Field(() => IntFilter, {nullable:true})
    _min?: InstanceType<typeof IntFilter>;
    @Field(() => IntFilter, {nullable:true})
    _max?: InstanceType<typeof IntFilter>;
}

@InputType()
export class SortOrderInput {
    @Field(() => SortOrder, {nullable:false})
    sort!: `${SortOrder}`;
    @Field(() => NullsOrder, {nullable:true})
    nulls?: `${NullsOrder}`;
}

@InputType()
export class StringFilter {
    @Field(() => String, {nullable:true})
    equals?: string;
    @Field(() => [String], {nullable:true})
    in?: Array<string>;
    @Field(() => [String], {nullable:true})
    notIn?: Array<string>;
    @Field(() => String, {nullable:true})
    lt?: string;
    @Field(() => String, {nullable:true})
    lte?: string;
    @Field(() => String, {nullable:true})
    gt?: string;
    @Field(() => String, {nullable:true})
    gte?: string;
    @Field(() => String, {nullable:true})
    contains?: string;
    @Field(() => String, {nullable:true})
    startsWith?: string;
    @Field(() => String, {nullable:true})
    endsWith?: string;
    @Field(() => StringFilter, {nullable:true})
    not?: InstanceType<typeof StringFilter>;
}

@InputType()
export class StringWithAggregatesFilter {
    @Field(() => String, {nullable:true})
    equals?: string;
    @Field(() => [String], {nullable:true})
    in?: Array<string>;
    @Field(() => [String], {nullable:true})
    notIn?: Array<string>;
    @Field(() => String, {nullable:true})
    lt?: string;
    @Field(() => String, {nullable:true})
    lte?: string;
    @Field(() => String, {nullable:true})
    gt?: string;
    @Field(() => String, {nullable:true})
    gte?: string;
    @Field(() => String, {nullable:true})
    contains?: string;
    @Field(() => String, {nullable:true})
    startsWith?: string;
    @Field(() => String, {nullable:true})
    endsWith?: string;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    not?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => IntFilter, {nullable:true})
    _count?: InstanceType<typeof IntFilter>;
    @Field(() => StringFilter, {nullable:true})
    _min?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    _max?: InstanceType<typeof StringFilter>;
}

@ObjectType()
export class AggregateProperty {
    @Field(() => PropertyCountAggregate, {nullable:true})
    _count?: InstanceType<typeof PropertyCountAggregate>;
    @Field(() => PropertyAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof PropertyAvgAggregate>;
    @Field(() => PropertySumAggregate, {nullable:true})
    _sum?: InstanceType<typeof PropertySumAggregate>;
    @Field(() => PropertyMinAggregate, {nullable:true})
    _min?: InstanceType<typeof PropertyMinAggregate>;
    @Field(() => PropertyMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof PropertyMaxAggregate>;
}

@ArgsType()
export class CreateManyPropertyArgs {
    @Field(() => [PropertyCreateManyInput], {nullable:false})
    @Type(() => PropertyCreateManyInput)
    data!: Array<PropertyCreateManyInput>;
}

@ArgsType()
export class CreateOnePropertyArgs {
    @Field(() => PropertyCreateInput, {nullable:false})
    @Type(() => PropertyCreateInput)
    data!: InstanceType<typeof PropertyCreateInput>;
}

@ArgsType()
export class DeleteManyPropertyArgs {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class DeleteOnePropertyArgs {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindFirstPropertyOrThrowArgs {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => [PropertyOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<PropertyOrderByWithRelationInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [PropertyScalarFieldEnum], {nullable:true})
    distinct?: Array<`${PropertyScalarFieldEnum}`>;
}

@ArgsType()
export class FindFirstPropertyArgs {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => [PropertyOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<PropertyOrderByWithRelationInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [PropertyScalarFieldEnum], {nullable:true})
    distinct?: Array<`${PropertyScalarFieldEnum}`>;
}

@ArgsType()
export class FindManyPropertyArgs {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => [PropertyOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<PropertyOrderByWithRelationInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [PropertyScalarFieldEnum], {nullable:true})
    distinct?: Array<`${PropertyScalarFieldEnum}`>;
}

@ArgsType()
export class FindUniquePropertyOrThrowArgs {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindUniquePropertyArgs {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@ArgsType()
export class PropertyAggregateArgs {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => [PropertyOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<PropertyOrderByWithRelationInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => PropertyCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof PropertyCountAggregateInput>;
    @Field(() => PropertyAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof PropertyAvgAggregateInput>;
    @Field(() => PropertySumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof PropertySumAggregateInput>;
    @Field(() => PropertyMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof PropertyMinAggregateInput>;
    @Field(() => PropertyMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof PropertyMaxAggregateInput>;
}

@InputType()
export class PropertyAvgAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
}

@ObjectType()
export class PropertyAvgAggregate {
    @Field(() => Float, {nullable:true})
    id?: number;
}

@InputType()
export class PropertyAvgOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
}

@InputType()
export class PropertyCountAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    address?: true;
    @Field(() => Boolean, {nullable:true})
    city?: true;
    @Field(() => Boolean, {nullable:true})
    state?: true;
    @Field(() => Boolean, {nullable:true})
    zipCode?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
    @Field(() => Boolean, {nullable:true})
    _all?: true;
}

@ObjectType()
export class PropertyCountAggregate {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => Int, {nullable:false})
    address!: number;
    @Field(() => Int, {nullable:false})
    city!: number;
    @Field(() => Int, {nullable:false})
    state!: number;
    @Field(() => Int, {nullable:false})
    zipCode!: number;
    @Field(() => Int, {nullable:false})
    createdAt!: number;
    @Field(() => Int, {nullable:false})
    updatedAt!: number;
    @Field(() => Int, {nullable:false})
    _all!: number;
}

@InputType()
export class PropertyCountOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    address?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    city?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    state?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    zipCode?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@ObjectType()
export class PropertyCount {
    @Field(() => Int, {nullable:false})
    cashFlows?: number;
    @Field(() => Int, {nullable:false})
    tickets?: number;
    @Field(() => Int, {nullable:false})
    leases?: number;
}

@InputType()
export class PropertyCreateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class PropertyCreateNestedOneWithoutCashFlowsInput {
    @Field(() => PropertyCreateWithoutCashFlowsInput, {nullable:true})
    @Type(() => PropertyCreateWithoutCashFlowsInput)
    create?: InstanceType<typeof PropertyCreateWithoutCashFlowsInput>;
    @Field(() => PropertyCreateOrConnectWithoutCashFlowsInput, {nullable:true})
    @Type(() => PropertyCreateOrConnectWithoutCashFlowsInput)
    connectOrCreate?: InstanceType<typeof PropertyCreateOrConnectWithoutCashFlowsInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    @Type(() => PropertyWhereUniqueInput)
    connect?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@InputType()
export class PropertyCreateNestedOneWithoutLeasesInput {
    @Field(() => PropertyCreateWithoutLeasesInput, {nullable:true})
    @Type(() => PropertyCreateWithoutLeasesInput)
    create?: InstanceType<typeof PropertyCreateWithoutLeasesInput>;
    @Field(() => PropertyCreateOrConnectWithoutLeasesInput, {nullable:true})
    @Type(() => PropertyCreateOrConnectWithoutLeasesInput)
    connectOrCreate?: InstanceType<typeof PropertyCreateOrConnectWithoutLeasesInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    @Type(() => PropertyWhereUniqueInput)
    connect?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@InputType()
export class PropertyCreateNestedOneWithoutTicketsInput {
    @Field(() => PropertyCreateWithoutTicketsInput, {nullable:true})
    @Type(() => PropertyCreateWithoutTicketsInput)
    create?: InstanceType<typeof PropertyCreateWithoutTicketsInput>;
    @Field(() => PropertyCreateOrConnectWithoutTicketsInput, {nullable:true})
    @Type(() => PropertyCreateOrConnectWithoutTicketsInput)
    connectOrCreate?: InstanceType<typeof PropertyCreateOrConnectWithoutTicketsInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    @Type(() => PropertyWhereUniqueInput)
    connect?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@InputType()
export class PropertyCreateOrConnectWithoutCashFlowsInput {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyCreateWithoutCashFlowsInput, {nullable:false})
    @Type(() => PropertyCreateWithoutCashFlowsInput)
    create!: InstanceType<typeof PropertyCreateWithoutCashFlowsInput>;
}

@InputType()
export class PropertyCreateOrConnectWithoutLeasesInput {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyCreateWithoutLeasesInput, {nullable:false})
    @Type(() => PropertyCreateWithoutLeasesInput)
    create!: InstanceType<typeof PropertyCreateWithoutLeasesInput>;
}

@InputType()
export class PropertyCreateOrConnectWithoutTicketsInput {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyCreateWithoutTicketsInput, {nullable:false})
    @Type(() => PropertyCreateWithoutTicketsInput)
    create!: InstanceType<typeof PropertyCreateWithoutTicketsInput>;
}

@InputType()
export class PropertyCreateWithoutCashFlowsInput {
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => TicketCreateNestedManyWithoutPropertyInput, {nullable:true})
    tickets?: InstanceType<typeof TicketCreateNestedManyWithoutPropertyInput>;
    @Field(() => LeaseCreateNestedManyWithoutPropertyInput, {nullable:true})
    leases?: InstanceType<typeof LeaseCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyCreateWithoutLeasesInput {
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowCreateNestedManyWithoutPropertyInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowCreateNestedManyWithoutPropertyInput>;
    @Field(() => TicketCreateNestedManyWithoutPropertyInput, {nullable:true})
    tickets?: InstanceType<typeof TicketCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyCreateWithoutTicketsInput {
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowCreateNestedManyWithoutPropertyInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowCreateNestedManyWithoutPropertyInput>;
    @Field(() => LeaseCreateNestedManyWithoutPropertyInput, {nullable:true})
    leases?: InstanceType<typeof LeaseCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyCreateInput {
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowCreateNestedManyWithoutPropertyInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowCreateNestedManyWithoutPropertyInput>;
    @Field(() => TicketCreateNestedManyWithoutPropertyInput, {nullable:true})
    tickets?: InstanceType<typeof TicketCreateNestedManyWithoutPropertyInput>;
    @Field(() => LeaseCreateNestedManyWithoutPropertyInput, {nullable:true})
    leases?: InstanceType<typeof LeaseCreateNestedManyWithoutPropertyInput>;
}

@ArgsType()
export class PropertyGroupByArgs {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => [PropertyOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<PropertyOrderByWithAggregationInput>;
    @Field(() => [PropertyScalarFieldEnum], {nullable:false})
    by!: Array<`${PropertyScalarFieldEnum}`>;
    @Field(() => PropertyScalarWhereWithAggregatesInput, {nullable:true})
    having?: InstanceType<typeof PropertyScalarWhereWithAggregatesInput>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => PropertyCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof PropertyCountAggregateInput>;
    @Field(() => PropertyAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof PropertyAvgAggregateInput>;
    @Field(() => PropertySumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof PropertySumAggregateInput>;
    @Field(() => PropertyMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof PropertyMinAggregateInput>;
    @Field(() => PropertyMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof PropertyMaxAggregateInput>;
}

@ObjectType()
export class PropertyGroupBy {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;
    @Field(() => PropertyCountAggregate, {nullable:true})
    _count?: InstanceType<typeof PropertyCountAggregate>;
    @Field(() => PropertyAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof PropertyAvgAggregate>;
    @Field(() => PropertySumAggregate, {nullable:true})
    _sum?: InstanceType<typeof PropertySumAggregate>;
    @Field(() => PropertyMinAggregate, {nullable:true})
    _min?: InstanceType<typeof PropertyMinAggregate>;
    @Field(() => PropertyMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof PropertyMaxAggregate>;
}

@InputType()
export class PropertyMaxAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    address?: true;
    @Field(() => Boolean, {nullable:true})
    city?: true;
    @Field(() => Boolean, {nullable:true})
    state?: true;
    @Field(() => Boolean, {nullable:true})
    zipCode?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class PropertyMaxAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class PropertyMaxOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    address?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    city?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    state?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    zipCode?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class PropertyMinAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    address?: true;
    @Field(() => Boolean, {nullable:true})
    city?: true;
    @Field(() => Boolean, {nullable:true})
    state?: true;
    @Field(() => Boolean, {nullable:true})
    zipCode?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class PropertyMinAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class PropertyMinOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    address?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    city?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    state?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    zipCode?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class PropertyOrderByWithAggregationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    address?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    city?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    state?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    zipCode?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => PropertyCountOrderByAggregateInput, {nullable:true})
    _count?: InstanceType<typeof PropertyCountOrderByAggregateInput>;
    @Field(() => PropertyAvgOrderByAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof PropertyAvgOrderByAggregateInput>;
    @Field(() => PropertyMaxOrderByAggregateInput, {nullable:true})
    _max?: InstanceType<typeof PropertyMaxOrderByAggregateInput>;
    @Field(() => PropertyMinOrderByAggregateInput, {nullable:true})
    _min?: InstanceType<typeof PropertyMinOrderByAggregateInput>;
    @Field(() => PropertySumOrderByAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof PropertySumOrderByAggregateInput>;
}

@InputType()
export class PropertyOrderByWithRelationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    address?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    city?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    state?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    zipCode?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => CashFlowOrderByRelationAggregateInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowOrderByRelationAggregateInput>;
    @Field(() => TicketOrderByRelationAggregateInput, {nullable:true})
    tickets?: InstanceType<typeof TicketOrderByRelationAggregateInput>;
    @Field(() => LeaseOrderByRelationAggregateInput, {nullable:true})
    leases?: InstanceType<typeof LeaseOrderByRelationAggregateInput>;
}

@InputType()
export class PropertyScalarRelationFilter {
    @Field(() => PropertyWhereInput, {nullable:true})
    is?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => PropertyWhereInput, {nullable:true})
    isNot?: InstanceType<typeof PropertyWhereInput>;
}

@InputType()
export class PropertyScalarWhereWithAggregatesInput {
    @Field(() => [PropertyScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<PropertyScalarWhereWithAggregatesInput>;
    @Field(() => [PropertyScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<PropertyScalarWhereWithAggregatesInput>;
    @Field(() => [PropertyScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<PropertyScalarWhereWithAggregatesInput>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    id?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    address?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    city?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    state?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    zipCode?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class PropertySumAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
}

@ObjectType()
export class PropertySumAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
}

@InputType()
export class PropertySumOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
}

@InputType()
export class PropertyUncheckedCreateWithoutCashFlowsInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => TicketUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUncheckedCreateNestedManyWithoutPropertyInput>;
    @Field(() => LeaseUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUncheckedCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyUncheckedCreateWithoutLeasesInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUncheckedCreateNestedManyWithoutPropertyInput>;
    @Field(() => TicketUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUncheckedCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyUncheckedCreateWithoutTicketsInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUncheckedCreateNestedManyWithoutPropertyInput>;
    @Field(() => LeaseUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUncheckedCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyUncheckedCreateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUncheckedCreateNestedManyWithoutPropertyInput>;
    @Field(() => TicketUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUncheckedCreateNestedManyWithoutPropertyInput>;
    @Field(() => LeaseUncheckedCreateNestedManyWithoutPropertyInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUncheckedCreateNestedManyWithoutPropertyInput>;
}

@InputType()
export class PropertyUncheckedUpdateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class PropertyUncheckedUpdateWithoutCashFlowsInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => TicketUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUncheckedUpdateManyWithoutPropertyNestedInput>;
    @Field(() => LeaseUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUncheckedUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUncheckedUpdateWithoutLeasesInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUncheckedUpdateManyWithoutPropertyNestedInput>;
    @Field(() => TicketUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUncheckedUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUncheckedUpdateWithoutTicketsInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUncheckedUpdateManyWithoutPropertyNestedInput>;
    @Field(() => LeaseUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUncheckedUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUncheckedUpdateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUncheckedUpdateManyWithoutPropertyNestedInput>;
    @Field(() => TicketUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUncheckedUpdateManyWithoutPropertyNestedInput>;
    @Field(() => LeaseUncheckedUpdateManyWithoutPropertyNestedInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUncheckedUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUpdateManyMutationInput {
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class PropertyUpdateOneRequiredWithoutCashFlowsNestedInput {
    @Field(() => PropertyCreateWithoutCashFlowsInput, {nullable:true})
    @Type(() => PropertyCreateWithoutCashFlowsInput)
    create?: InstanceType<typeof PropertyCreateWithoutCashFlowsInput>;
    @Field(() => PropertyCreateOrConnectWithoutCashFlowsInput, {nullable:true})
    @Type(() => PropertyCreateOrConnectWithoutCashFlowsInput)
    connectOrCreate?: InstanceType<typeof PropertyCreateOrConnectWithoutCashFlowsInput>;
    @Field(() => PropertyUpsertWithoutCashFlowsInput, {nullable:true})
    @Type(() => PropertyUpsertWithoutCashFlowsInput)
    upsert?: InstanceType<typeof PropertyUpsertWithoutCashFlowsInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    @Type(() => PropertyWhereUniqueInput)
    connect?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyUpdateToOneWithWhereWithoutCashFlowsInput, {nullable:true})
    @Type(() => PropertyUpdateToOneWithWhereWithoutCashFlowsInput)
    update?: InstanceType<typeof PropertyUpdateToOneWithWhereWithoutCashFlowsInput>;
}

@InputType()
export class PropertyUpdateOneRequiredWithoutLeasesNestedInput {
    @Field(() => PropertyCreateWithoutLeasesInput, {nullable:true})
    @Type(() => PropertyCreateWithoutLeasesInput)
    create?: InstanceType<typeof PropertyCreateWithoutLeasesInput>;
    @Field(() => PropertyCreateOrConnectWithoutLeasesInput, {nullable:true})
    @Type(() => PropertyCreateOrConnectWithoutLeasesInput)
    connectOrCreate?: InstanceType<typeof PropertyCreateOrConnectWithoutLeasesInput>;
    @Field(() => PropertyUpsertWithoutLeasesInput, {nullable:true})
    @Type(() => PropertyUpsertWithoutLeasesInput)
    upsert?: InstanceType<typeof PropertyUpsertWithoutLeasesInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    @Type(() => PropertyWhereUniqueInput)
    connect?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyUpdateToOneWithWhereWithoutLeasesInput, {nullable:true})
    @Type(() => PropertyUpdateToOneWithWhereWithoutLeasesInput)
    update?: InstanceType<typeof PropertyUpdateToOneWithWhereWithoutLeasesInput>;
}

@InputType()
export class PropertyUpdateOneRequiredWithoutTicketsNestedInput {
    @Field(() => PropertyCreateWithoutTicketsInput, {nullable:true})
    @Type(() => PropertyCreateWithoutTicketsInput)
    create?: InstanceType<typeof PropertyCreateWithoutTicketsInput>;
    @Field(() => PropertyCreateOrConnectWithoutTicketsInput, {nullable:true})
    @Type(() => PropertyCreateOrConnectWithoutTicketsInput)
    connectOrCreate?: InstanceType<typeof PropertyCreateOrConnectWithoutTicketsInput>;
    @Field(() => PropertyUpsertWithoutTicketsInput, {nullable:true})
    @Type(() => PropertyUpsertWithoutTicketsInput)
    upsert?: InstanceType<typeof PropertyUpsertWithoutTicketsInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:true})
    @Type(() => PropertyWhereUniqueInput)
    connect?: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyUpdateToOneWithWhereWithoutTicketsInput, {nullable:true})
    @Type(() => PropertyUpdateToOneWithWhereWithoutTicketsInput)
    update?: InstanceType<typeof PropertyUpdateToOneWithWhereWithoutTicketsInput>;
}

@InputType()
export class PropertyUpdateToOneWithWhereWithoutCashFlowsInput {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => PropertyUpdateWithoutCashFlowsInput, {nullable:false})
    @Type(() => PropertyUpdateWithoutCashFlowsInput)
    data!: InstanceType<typeof PropertyUpdateWithoutCashFlowsInput>;
}

@InputType()
export class PropertyUpdateToOneWithWhereWithoutLeasesInput {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => PropertyUpdateWithoutLeasesInput, {nullable:false})
    @Type(() => PropertyUpdateWithoutLeasesInput)
    data!: InstanceType<typeof PropertyUpdateWithoutLeasesInput>;
}

@InputType()
export class PropertyUpdateToOneWithWhereWithoutTicketsInput {
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => PropertyUpdateWithoutTicketsInput, {nullable:false})
    @Type(() => PropertyUpdateWithoutTicketsInput)
    data!: InstanceType<typeof PropertyUpdateWithoutTicketsInput>;
}

@InputType()
export class PropertyUpdateWithoutCashFlowsInput {
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => TicketUpdateManyWithoutPropertyNestedInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUpdateManyWithoutPropertyNestedInput>;
    @Field(() => LeaseUpdateManyWithoutPropertyNestedInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUpdateWithoutLeasesInput {
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUpdateManyWithoutPropertyNestedInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUpdateManyWithoutPropertyNestedInput>;
    @Field(() => TicketUpdateManyWithoutPropertyNestedInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUpdateWithoutTicketsInput {
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUpdateManyWithoutPropertyNestedInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUpdateManyWithoutPropertyNestedInput>;
    @Field(() => LeaseUpdateManyWithoutPropertyNestedInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUpdateInput {
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    city?: string;
    @Field(() => String, {nullable:true})
    state?: string;
    @Field(() => String, {nullable:true})
    zipCode?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => CashFlowUpdateManyWithoutPropertyNestedInput, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowUpdateManyWithoutPropertyNestedInput>;
    @Field(() => TicketUpdateManyWithoutPropertyNestedInput, {nullable:true})
    tickets?: InstanceType<typeof TicketUpdateManyWithoutPropertyNestedInput>;
    @Field(() => LeaseUpdateManyWithoutPropertyNestedInput, {nullable:true})
    leases?: InstanceType<typeof LeaseUpdateManyWithoutPropertyNestedInput>;
}

@InputType()
export class PropertyUpsertWithoutCashFlowsInput {
    @Field(() => PropertyUpdateWithoutCashFlowsInput, {nullable:false})
    @Type(() => PropertyUpdateWithoutCashFlowsInput)
    update!: InstanceType<typeof PropertyUpdateWithoutCashFlowsInput>;
    @Field(() => PropertyCreateWithoutCashFlowsInput, {nullable:false})
    @Type(() => PropertyCreateWithoutCashFlowsInput)
    create!: InstanceType<typeof PropertyCreateWithoutCashFlowsInput>;
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
}

@InputType()
export class PropertyUpsertWithoutLeasesInput {
    @Field(() => PropertyUpdateWithoutLeasesInput, {nullable:false})
    @Type(() => PropertyUpdateWithoutLeasesInput)
    update!: InstanceType<typeof PropertyUpdateWithoutLeasesInput>;
    @Field(() => PropertyCreateWithoutLeasesInput, {nullable:false})
    @Type(() => PropertyCreateWithoutLeasesInput)
    create!: InstanceType<typeof PropertyCreateWithoutLeasesInput>;
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
}

@InputType()
export class PropertyUpsertWithoutTicketsInput {
    @Field(() => PropertyUpdateWithoutTicketsInput, {nullable:false})
    @Type(() => PropertyUpdateWithoutTicketsInput)
    update!: InstanceType<typeof PropertyUpdateWithoutTicketsInput>;
    @Field(() => PropertyCreateWithoutTicketsInput, {nullable:false})
    @Type(() => PropertyCreateWithoutTicketsInput)
    create!: InstanceType<typeof PropertyCreateWithoutTicketsInput>;
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
}

@InputType()
export class PropertyWhereUniqueInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => [PropertyWhereInput], {nullable:true})
    AND?: Array<PropertyWhereInput>;
    @Field(() => [PropertyWhereInput], {nullable:true})
    OR?: Array<PropertyWhereInput>;
    @Field(() => [PropertyWhereInput], {nullable:true})
    NOT?: Array<PropertyWhereInput>;
    @Field(() => StringFilter, {nullable:true})
    address?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    city?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    state?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    zipCode?: InstanceType<typeof StringFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => CashFlowListRelationFilter, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowListRelationFilter>;
    @Field(() => TicketListRelationFilter, {nullable:true})
    tickets?: InstanceType<typeof TicketListRelationFilter>;
    @Field(() => LeaseListRelationFilter, {nullable:true})
    leases?: InstanceType<typeof LeaseListRelationFilter>;
}

@InputType()
export class PropertyWhereInput {
    @Field(() => [PropertyWhereInput], {nullable:true})
    AND?: Array<PropertyWhereInput>;
    @Field(() => [PropertyWhereInput], {nullable:true})
    OR?: Array<PropertyWhereInput>;
    @Field(() => [PropertyWhereInput], {nullable:true})
    NOT?: Array<PropertyWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => StringFilter, {nullable:true})
    address?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    city?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    state?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    zipCode?: InstanceType<typeof StringFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => CashFlowListRelationFilter, {nullable:true})
    cashFlows?: InstanceType<typeof CashFlowListRelationFilter>;
    @Field(() => TicketListRelationFilter, {nullable:true})
    tickets?: InstanceType<typeof TicketListRelationFilter>;
    @Field(() => LeaseListRelationFilter, {nullable:true})
    leases?: InstanceType<typeof LeaseListRelationFilter>;
}

@ObjectType()
export class Property {
    @Field(() => ID, {nullable:false})
    id!: number;
    @Field(() => String, {nullable:false})
    address!: string;
    @Field(() => String, {nullable:false})
    city!: string;
    @Field(() => String, {nullable:false})
    state!: string;
    @Field(() => String, {nullable:false})
    zipCode!: string;
    @Field(() => Date, {nullable:false})
    createdAt!: Date;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date;
    @Field(() => [CashFlow], {nullable:true})
    cashFlows?: Array<CashFlow>;
    @Field(() => [Ticket], {nullable:true})
    tickets?: Array<Ticket>;
    @Field(() => [Lease], {nullable:true})
    leases?: Array<Lease>;
    @Field(() => PropertyCount, {nullable:false})
    _count?: InstanceType<typeof PropertyCount>;
}

@ArgsType()
export class UpdateManyPropertyArgs {
    @Field(() => PropertyUpdateManyMutationInput, {nullable:false})
    @Type(() => PropertyUpdateManyMutationInput)
    data!: InstanceType<typeof PropertyUpdateManyMutationInput>;
    @Field(() => PropertyWhereInput, {nullable:true})
    @Type(() => PropertyWhereInput)
    where?: InstanceType<typeof PropertyWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class UpdateOnePropertyArgs {
    @Field(() => PropertyUpdateInput, {nullable:false})
    @Type(() => PropertyUpdateInput)
    data!: InstanceType<typeof PropertyUpdateInput>;
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
}

@ArgsType()
export class UpsertOnePropertyArgs {
    @Field(() => PropertyWhereUniqueInput, {nullable:false})
    @Type(() => PropertyWhereUniqueInput)
    where!: Prisma.AtLeast<PropertyWhereUniqueInput, 'id'>;
    @Field(() => PropertyCreateInput, {nullable:false})
    @Type(() => PropertyCreateInput)
    create!: InstanceType<typeof PropertyCreateInput>;
    @Field(() => PropertyUpdateInput, {nullable:false})
    @Type(() => PropertyUpdateInput)
    update!: InstanceType<typeof PropertyUpdateInput>;
}

@ObjectType()
export class AggregateTicket {
    @Field(() => TicketCountAggregate, {nullable:true})
    _count?: InstanceType<typeof TicketCountAggregate>;
    @Field(() => TicketAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof TicketAvgAggregate>;
    @Field(() => TicketSumAggregate, {nullable:true})
    _sum?: InstanceType<typeof TicketSumAggregate>;
    @Field(() => TicketMinAggregate, {nullable:true})
    _min?: InstanceType<typeof TicketMinAggregate>;
    @Field(() => TicketMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof TicketMaxAggregate>;
}

@ArgsType()
export class CreateManyTicketArgs {
    @Field(() => [TicketCreateManyInput], {nullable:false})
    @Type(() => TicketCreateManyInput)
    data!: Array<TicketCreateManyInput>;
}

@ArgsType()
export class CreateOneTicketArgs {
    @Field(() => TicketCreateInput, {nullable:false})
    @Type(() => TicketCreateInput)
    data!: InstanceType<typeof TicketCreateInput>;
}

@ArgsType()
export class DeleteManyTicketArgs {
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class DeleteOneTicketArgs {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindFirstTicketOrThrowArgs {
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => [TicketOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<TicketOrderByWithRelationInput>;
    @Field(() => TicketWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [TicketScalarFieldEnum], {nullable:true})
    distinct?: Array<`${TicketScalarFieldEnum}`>;
}

@ArgsType()
export class FindFirstTicketArgs {
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => [TicketOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<TicketOrderByWithRelationInput>;
    @Field(() => TicketWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [TicketScalarFieldEnum], {nullable:true})
    distinct?: Array<`${TicketScalarFieldEnum}`>;
}

@ArgsType()
export class FindManyTicketArgs {
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => [TicketOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<TicketOrderByWithRelationInput>;
    @Field(() => TicketWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => [TicketScalarFieldEnum], {nullable:true})
    distinct?: Array<`${TicketScalarFieldEnum}`>;
}

@ArgsType()
export class FindUniqueTicketOrThrowArgs {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindUniqueTicketArgs {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
}

@ArgsType()
export class TicketAggregateArgs {
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => [TicketOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<TicketOrderByWithRelationInput>;
    @Field(() => TicketWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => TicketCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof TicketCountAggregateInput>;
    @Field(() => TicketAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof TicketAvgAggregateInput>;
    @Field(() => TicketSumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof TicketSumAggregateInput>;
    @Field(() => TicketMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof TicketMinAggregateInput>;
    @Field(() => TicketMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof TicketMaxAggregateInput>;
}

@InputType()
export class TicketAvgAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
}

@ObjectType()
export class TicketAvgAggregate {
    @Field(() => Float, {nullable:true})
    id?: number;
    @Field(() => Float, {nullable:true})
    propertyId?: number;
}

@InputType()
export class TicketAvgOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
}

@InputType()
export class TicketCountAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    title?: true;
    @Field(() => Boolean, {nullable:true})
    description?: true;
    @Field(() => Boolean, {nullable:true})
    priority?: true;
    @Field(() => Boolean, {nullable:true})
    status?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
    @Field(() => Boolean, {nullable:true})
    _all?: true;
}

@ObjectType()
export class TicketCountAggregate {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => Int, {nullable:false})
    title!: number;
    @Field(() => Int, {nullable:false})
    description!: number;
    @Field(() => Int, {nullable:false})
    priority!: number;
    @Field(() => Int, {nullable:false})
    status!: number;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Int, {nullable:false})
    createdAt!: number;
    @Field(() => Int, {nullable:false})
    updatedAt!: number;
    @Field(() => Int, {nullable:false})
    _all!: number;
}

@InputType()
export class TicketCountOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    title?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    description?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    priority?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    status?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class TicketCreateManyPropertyInputEnvelope {
    @Field(() => [TicketCreateManyPropertyInput], {nullable:false})
    @Type(() => TicketCreateManyPropertyInput)
    data!: Array<TicketCreateManyPropertyInput>;
}

@InputType()
export class TicketCreateManyPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketCreateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketCreateNestedManyWithoutPropertyInput {
    @Field(() => [TicketCreateWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateWithoutPropertyInput)
    create?: Array<TicketCreateWithoutPropertyInput>;
    @Field(() => [TicketCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<TicketCreateOrConnectWithoutPropertyInput>;
    @Field(() => TicketCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => TicketCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof TicketCreateManyPropertyInputEnvelope>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
}

@InputType()
export class TicketCreateOrConnectWithoutPropertyInput {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => TicketCreateWithoutPropertyInput, {nullable:false})
    @Type(() => TicketCreateWithoutPropertyInput)
    create!: InstanceType<typeof TicketCreateWithoutPropertyInput>;
}

@InputType()
export class TicketCreateWithoutPropertyInput {
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketCreateInput {
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => PropertyCreateNestedOneWithoutTicketsInput, {nullable:false})
    property!: InstanceType<typeof PropertyCreateNestedOneWithoutTicketsInput>;
}

@ArgsType()
export class TicketGroupByArgs {
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => [TicketOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<TicketOrderByWithAggregationInput>;
    @Field(() => [TicketScalarFieldEnum], {nullable:false})
    by!: Array<`${TicketScalarFieldEnum}`>;
    @Field(() => TicketScalarWhereWithAggregatesInput, {nullable:true})
    having?: InstanceType<typeof TicketScalarWhereWithAggregatesInput>;
    @Field(() => Int, {nullable:true})
    take?: number;
    @Field(() => Int, {nullable:true})
    skip?: number;
    @Field(() => TicketCountAggregateInput, {nullable:true})
    _count?: InstanceType<typeof TicketCountAggregateInput>;
    @Field(() => TicketAvgAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof TicketAvgAggregateInput>;
    @Field(() => TicketSumAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof TicketSumAggregateInput>;
    @Field(() => TicketMinAggregateInput, {nullable:true})
    _min?: InstanceType<typeof TicketMinAggregateInput>;
    @Field(() => TicketMaxAggregateInput, {nullable:true})
    _max?: InstanceType<typeof TicketMaxAggregateInput>;
}

@ObjectType()
export class TicketGroupBy {
    @Field(() => Int, {nullable:false})
    id!: number;
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;
    @Field(() => TicketCountAggregate, {nullable:true})
    _count?: InstanceType<typeof TicketCountAggregate>;
    @Field(() => TicketAvgAggregate, {nullable:true})
    _avg?: InstanceType<typeof TicketAvgAggregate>;
    @Field(() => TicketSumAggregate, {nullable:true})
    _sum?: InstanceType<typeof TicketSumAggregate>;
    @Field(() => TicketMinAggregate, {nullable:true})
    _min?: InstanceType<typeof TicketMinAggregate>;
    @Field(() => TicketMaxAggregate, {nullable:true})
    _max?: InstanceType<typeof TicketMaxAggregate>;
}

@InputType()
export class TicketListRelationFilter {
    @Field(() => TicketWhereInput, {nullable:true})
    every?: InstanceType<typeof TicketWhereInput>;
    @Field(() => TicketWhereInput, {nullable:true})
    some?: InstanceType<typeof TicketWhereInput>;
    @Field(() => TicketWhereInput, {nullable:true})
    none?: InstanceType<typeof TicketWhereInput>;
}

@InputType()
export class TicketMaxAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    title?: true;
    @Field(() => Boolean, {nullable:true})
    description?: true;
    @Field(() => Boolean, {nullable:true})
    priority?: true;
    @Field(() => Boolean, {nullable:true})
    status?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class TicketMaxAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketMaxOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    title?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    description?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    priority?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    status?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class TicketMinAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    title?: true;
    @Field(() => Boolean, {nullable:true})
    description?: true;
    @Field(() => Boolean, {nullable:true})
    priority?: true;
    @Field(() => Boolean, {nullable:true})
    status?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
    @Field(() => Boolean, {nullable:true})
    createdAt?: true;
    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}

@ObjectType()
export class TicketMinAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketMinOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    title?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    description?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    priority?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    status?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
}

@InputType()
export class TicketOrderByRelationAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    _count?: `${SortOrder}`;
}

@InputType()
export class TicketOrderByWithAggregationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    title?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    description?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    priority?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    status?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => TicketCountOrderByAggregateInput, {nullable:true})
    _count?: InstanceType<typeof TicketCountOrderByAggregateInput>;
    @Field(() => TicketAvgOrderByAggregateInput, {nullable:true})
    _avg?: InstanceType<typeof TicketAvgOrderByAggregateInput>;
    @Field(() => TicketMaxOrderByAggregateInput, {nullable:true})
    _max?: InstanceType<typeof TicketMaxOrderByAggregateInput>;
    @Field(() => TicketMinOrderByAggregateInput, {nullable:true})
    _min?: InstanceType<typeof TicketMinOrderByAggregateInput>;
    @Field(() => TicketSumOrderByAggregateInput, {nullable:true})
    _sum?: InstanceType<typeof TicketSumOrderByAggregateInput>;
}

@InputType()
export class TicketOrderByWithRelationInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    title?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    description?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    priority?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    status?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;
    @Field(() => PropertyOrderByWithRelationInput, {nullable:true})
    property?: InstanceType<typeof PropertyOrderByWithRelationInput>;
}

@InputType()
export class TicketScalarWhereWithAggregatesInput {
    @Field(() => [TicketScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<TicketScalarWhereWithAggregatesInput>;
    @Field(() => [TicketScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<TicketScalarWhereWithAggregatesInput>;
    @Field(() => [TicketScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<TicketScalarWhereWithAggregatesInput>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    id?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    title?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    description?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    priority?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => StringWithAggregatesFilter, {nullable:true})
    status?: InstanceType<typeof StringWithAggregatesFilter>;
    @Field(() => IntWithAggregatesFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class TicketScalarWhereInput {
    @Field(() => [TicketScalarWhereInput], {nullable:true})
    AND?: Array<TicketScalarWhereInput>;
    @Field(() => [TicketScalarWhereInput], {nullable:true})
    OR?: Array<TicketScalarWhereInput>;
    @Field(() => [TicketScalarWhereInput], {nullable:true})
    NOT?: Array<TicketScalarWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => StringFilter, {nullable:true})
    title?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    description?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    priority?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    status?: InstanceType<typeof StringFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class TicketSumAggregateInput {
    @Field(() => Boolean, {nullable:true})
    id?: true;
    @Field(() => Boolean, {nullable:true})
    propertyId?: true;
}

@ObjectType()
export class TicketSumAggregate {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
}

@InputType()
export class TicketSumOrderByAggregateInput {
    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;
    @Field(() => SortOrder, {nullable:true})
    propertyId?: `${SortOrder}`;
}

@InputType()
export class TicketUncheckedCreateNestedManyWithoutPropertyInput {
    @Field(() => [TicketCreateWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateWithoutPropertyInput)
    create?: Array<TicketCreateWithoutPropertyInput>;
    @Field(() => [TicketCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<TicketCreateOrConnectWithoutPropertyInput>;
    @Field(() => TicketCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => TicketCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof TicketCreateManyPropertyInputEnvelope>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
}

@InputType()
export class TicketUncheckedCreateWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUncheckedCreateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUncheckedUpdateManyWithoutPropertyNestedInput {
    @Field(() => [TicketCreateWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateWithoutPropertyInput)
    create?: Array<TicketCreateWithoutPropertyInput>;
    @Field(() => [TicketCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<TicketCreateOrConnectWithoutPropertyInput>;
    @Field(() => [TicketUpsertWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => TicketUpsertWithWhereUniqueWithoutPropertyInput)
    upsert?: Array<TicketUpsertWithWhereUniqueWithoutPropertyInput>;
    @Field(() => TicketCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => TicketCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof TicketCreateManyPropertyInputEnvelope>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    set?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketUpdateWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => TicketUpdateWithWhereUniqueWithoutPropertyInput)
    update?: Array<TicketUpdateWithWhereUniqueWithoutPropertyInput>;
    @Field(() => [TicketUpdateManyWithWhereWithoutPropertyInput], {nullable:true})
    @Type(() => TicketUpdateManyWithWhereWithoutPropertyInput)
    updateMany?: Array<TicketUpdateManyWithWhereWithoutPropertyInput>;
    @Field(() => [TicketScalarWhereInput], {nullable:true})
    @Type(() => TicketScalarWhereInput)
    deleteMany?: Array<TicketScalarWhereInput>;
}

@InputType()
export class TicketUncheckedUpdateManyWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUncheckedUpdateManyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUncheckedUpdateWithoutPropertyInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUncheckedUpdateInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Int, {nullable:true})
    propertyId?: number;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUpdateManyMutationInput {
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUpdateManyWithWhereWithoutPropertyInput {
    @Field(() => TicketScalarWhereInput, {nullable:false})
    @Type(() => TicketScalarWhereInput)
    where!: InstanceType<typeof TicketScalarWhereInput>;
    @Field(() => TicketUpdateManyMutationInput, {nullable:false})
    @Type(() => TicketUpdateManyMutationInput)
    data!: InstanceType<typeof TicketUpdateManyMutationInput>;
}

@InputType()
export class TicketUpdateManyWithoutPropertyNestedInput {
    @Field(() => [TicketCreateWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateWithoutPropertyInput)
    create?: Array<TicketCreateWithoutPropertyInput>;
    @Field(() => [TicketCreateOrConnectWithoutPropertyInput], {nullable:true})
    @Type(() => TicketCreateOrConnectWithoutPropertyInput)
    connectOrCreate?: Array<TicketCreateOrConnectWithoutPropertyInput>;
    @Field(() => [TicketUpsertWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => TicketUpsertWithWhereUniqueWithoutPropertyInput)
    upsert?: Array<TicketUpsertWithWhereUniqueWithoutPropertyInput>;
    @Field(() => TicketCreateManyPropertyInputEnvelope, {nullable:true})
    @Type(() => TicketCreateManyPropertyInputEnvelope)
    createMany?: InstanceType<typeof TicketCreateManyPropertyInputEnvelope>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    set?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketWhereUniqueInput], {nullable:true})
    @Type(() => TicketWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<TicketWhereUniqueInput, 'id'>>;
    @Field(() => [TicketUpdateWithWhereUniqueWithoutPropertyInput], {nullable:true})
    @Type(() => TicketUpdateWithWhereUniqueWithoutPropertyInput)
    update?: Array<TicketUpdateWithWhereUniqueWithoutPropertyInput>;
    @Field(() => [TicketUpdateManyWithWhereWithoutPropertyInput], {nullable:true})
    @Type(() => TicketUpdateManyWithWhereWithoutPropertyInput)
    updateMany?: Array<TicketUpdateManyWithWhereWithoutPropertyInput>;
    @Field(() => [TicketScalarWhereInput], {nullable:true})
    @Type(() => TicketScalarWhereInput)
    deleteMany?: Array<TicketScalarWhereInput>;
}

@InputType()
export class TicketUpdateWithWhereUniqueWithoutPropertyInput {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => TicketUpdateWithoutPropertyInput, {nullable:false})
    @Type(() => TicketUpdateWithoutPropertyInput)
    data!: InstanceType<typeof TicketUpdateWithoutPropertyInput>;
}

@InputType()
export class TicketUpdateWithoutPropertyInput {
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}

@InputType()
export class TicketUpdateInput {
    @Field(() => String, {nullable:true})
    title?: string;
    @Field(() => String, {nullable:true})
    description?: string;
    @Field(() => String, {nullable:true})
    priority?: string;
    @Field(() => String, {nullable:true})
    status?: string;
    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;
    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
    @Field(() => PropertyUpdateOneRequiredWithoutTicketsNestedInput, {nullable:true})
    property?: InstanceType<typeof PropertyUpdateOneRequiredWithoutTicketsNestedInput>;
}

@InputType()
export class TicketUpsertWithWhereUniqueWithoutPropertyInput {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => TicketUpdateWithoutPropertyInput, {nullable:false})
    @Type(() => TicketUpdateWithoutPropertyInput)
    update!: InstanceType<typeof TicketUpdateWithoutPropertyInput>;
    @Field(() => TicketCreateWithoutPropertyInput, {nullable:false})
    @Type(() => TicketCreateWithoutPropertyInput)
    create!: InstanceType<typeof TicketCreateWithoutPropertyInput>;
}

@InputType()
export class TicketWhereUniqueInput {
    @Field(() => Int, {nullable:true})
    id?: number;
    @Field(() => [TicketWhereInput], {nullable:true})
    AND?: Array<TicketWhereInput>;
    @Field(() => [TicketWhereInput], {nullable:true})
    OR?: Array<TicketWhereInput>;
    @Field(() => [TicketWhereInput], {nullable:true})
    NOT?: Array<TicketWhereInput>;
    @Field(() => StringFilter, {nullable:true})
    title?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    description?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    priority?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    status?: InstanceType<typeof StringFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => PropertyScalarRelationFilter, {nullable:true})
    property?: InstanceType<typeof PropertyScalarRelationFilter>;
}

@InputType()
export class TicketWhereInput {
    @Field(() => [TicketWhereInput], {nullable:true})
    AND?: Array<TicketWhereInput>;
    @Field(() => [TicketWhereInput], {nullable:true})
    OR?: Array<TicketWhereInput>;
    @Field(() => [TicketWhereInput], {nullable:true})
    NOT?: Array<TicketWhereInput>;
    @Field(() => IntFilter, {nullable:true})
    id?: InstanceType<typeof IntFilter>;
    @Field(() => StringFilter, {nullable:true})
    title?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    description?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    priority?: InstanceType<typeof StringFilter>;
    @Field(() => StringFilter, {nullable:true})
    status?: InstanceType<typeof StringFilter>;
    @Field(() => IntFilter, {nullable:true})
    propertyId?: InstanceType<typeof IntFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: InstanceType<typeof DateTimeFilter>;
    @Field(() => PropertyScalarRelationFilter, {nullable:true})
    property?: InstanceType<typeof PropertyScalarRelationFilter>;
}

@ObjectType()
export class Ticket {
    @Field(() => ID, {nullable:false})
    id!: number;
    @Field(() => String, {nullable:false})
    title!: string;
    @Field(() => String, {nullable:false})
    description!: string;
    @Field(() => String, {nullable:false})
    priority!: string;
    @Field(() => String, {nullable:false})
    status!: string;
    @Field(() => Int, {nullable:false})
    propertyId!: number;
    @Field(() => Date, {nullable:false})
    createdAt!: Date;
    @Field(() => Date, {nullable:false})
    updatedAt!: Date;
    @Field(() => Property, {nullable:false})
    property?: InstanceType<typeof Property>;
}

@ArgsType()
export class UpdateManyTicketArgs {
    @Field(() => TicketUpdateManyMutationInput, {nullable:false})
    @Type(() => TicketUpdateManyMutationInput)
    data!: InstanceType<typeof TicketUpdateManyMutationInput>;
    @Field(() => TicketWhereInput, {nullable:true})
    @Type(() => TicketWhereInput)
    where?: InstanceType<typeof TicketWhereInput>;
    @Field(() => Int, {nullable:true})
    limit?: number;
}

@ArgsType()
export class UpdateOneTicketArgs {
    @Field(() => TicketUpdateInput, {nullable:false})
    @Type(() => TicketUpdateInput)
    data!: InstanceType<typeof TicketUpdateInput>;
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
}

@ArgsType()
export class UpsertOneTicketArgs {
    @Field(() => TicketWhereUniqueInput, {nullable:false})
    @Type(() => TicketWhereUniqueInput)
    where!: Prisma.AtLeast<TicketWhereUniqueInput, 'id'>;
    @Field(() => TicketCreateInput, {nullable:false})
    @Type(() => TicketCreateInput)
    create!: InstanceType<typeof TicketCreateInput>;
    @Field(() => TicketUpdateInput, {nullable:false})
    @Type(() => TicketUpdateInput)
    update!: InstanceType<typeof TicketUpdateInput>;
}
