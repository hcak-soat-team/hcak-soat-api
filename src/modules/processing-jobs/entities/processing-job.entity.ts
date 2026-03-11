import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum JobStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity("processing_jobs")
export class ProcessingJob {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid")
  videoId: string;

  @Column("enum", { enum: JobStatus, default: JobStatus.PENDING })
  status: JobStatus;

  @Column("integer", { nullable: true })
  totalFrames: number;

  @Column("integer", { default: 0 })
  processedFrames: number;

  @Column("varchar", { nullable: true })
  s3OutputKey: string;

  @Column("varchar", { nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
