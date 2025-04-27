import { Module } from '@nestjs/common';
import { DashboardResolver } from './dashboard.resolver';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [DashboardResolver, PrismaService],
})
export class DashboardModule { }