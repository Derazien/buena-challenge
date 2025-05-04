import { Module } from '@nestjs/common';
import { DashboardResolver } from './dashboard.resolver';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [DashboardResolver, PrismaService],
})
export class DashboardModule { }