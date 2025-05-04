import { Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [PropertyResolver, PrismaService],
})
export class PropertyModule { }