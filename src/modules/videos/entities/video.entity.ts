import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

export enum VideoStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity("videos")
export class Video {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid")
  userId: string;

  @Column("varchar")
  s3Key: string;

  @Column("varchar")
  fileName: string;

  @Column("bigint", { nullable: true })
  fileSizeBytes: number;

  @Column("varchar", { nullable: true })
  mimeType: string;

  @Column("enum", { enum: VideoStatus, default: VideoStatus.PENDING })
  status: VideoStatus;

  @Column("varchar", { nullable: true })
  userEmail: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
