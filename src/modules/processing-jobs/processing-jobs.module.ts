import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessingJob } from "./entities/processing-job.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingJob])],
  providers: [],
  exports: [],
})
export class ProcessingJobsModule {}
