import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AiModule } from './ai/ai.module';
import { PropertyModule } from './property/property.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TicketModule } from './ticket/ticket.module';
import { LeaseModule } from './lease/lease.module';
import { CashflowModule } from './cashflow/cashflow.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (connectionParams) => {
            return true;
          },
        },
      },
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    AiModule,
    PropertyModule,
    TicketModule,
    LeaseModule,
    CashflowModule,
    DashboardModule,
    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
  ],
})
export class AppModule { }
