import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

export enum NotificationType {
  UPLOAD_COMPLETED = "UPLOAD_COMPLETED",
  PROCESSING_STARTED = "PROCESSING_STARTED",
  PROCESSING_COMPLETED = "PROCESSING_COMPLETED",
  PROCESSING_FAILED = "PROCESSING_FAILED",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

@Entity("notifications")
export class Notification {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid")
  videoId: string;

  @Column("uuid")
  userId: string;

  @Column("varchar")
  recipientEmail: string;

  @Column("enum", { enum: NotificationType })
  type: NotificationType;

  @Column("enum", { enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column("text", { nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  sentAt: Date;
}
