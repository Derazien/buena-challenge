import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioResolver } from './portfolio.resolver';
import { PrismaService } from '../prisma.service';
import { HttpModule } from '@nestjs/axios';
import { AiModule } from '../ai/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, AiModule, ConfigModule],
  providers: [PortfolioService, PortfolioResolver, PrismaService],
  exports: [PortfolioService],
})
export class PortfolioModule {} 