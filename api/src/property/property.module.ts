import { Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [PropertyResolver, PrismaService],
})
export class PropertyModule { }