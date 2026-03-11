import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

export type NotificationType = "UPLOAD_COMPLETED" | "PROCESSING_STARTED" | "PROCESSING_COMPLETED" | "PROCESSING_FAILED";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED";

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

  @Column("enum", { enum: ["UPLOAD_COMPLETED", "PROCESSING_STARTED", "PROCESSING_COMPLETED", "PROCESSING_FAILED"] })
  type: NotificationType;

  @Column("enum", { enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" })
  status: NotificationStatus;

  @Column("text", { nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  sentAt: Date;
}
