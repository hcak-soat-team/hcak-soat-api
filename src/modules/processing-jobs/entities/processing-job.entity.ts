import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

@Entity("processing_jobs")
export class ProcessingJob {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid")
  videoId: string;

  @Column("enum", { enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"], default: "PENDING" })
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
