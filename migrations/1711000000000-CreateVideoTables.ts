import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVideoTables1711000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Videos table
    await queryRunner.createTable(
      new Table({
        name: "videos",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "s3Key",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "fileName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "fileSizeBytes",
            type: "bigint",
            isNullable: true,
          },
          {
            name: "mimeType",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
            default: "'PENDING'",
          },
          {
            name: "userEmail",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "uploadedAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
            onUpdate: "now()",
          },
          {
            name: "processingStartedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "processingCompletedAt",
            type: "timestamp",
            isNullable: true,
          },
        ],
        indices: [
          {
            columnNames: ["userId"],
          },
          {
            columnNames: ["status"],
          },
        ],
      }),
      true
    );

    // ProcessingJobs table
    await queryRunner.createTable(
      new Table({
        name: "processing_jobs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "videoId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"],
            default: "'PENDING'",
          },
          {
            name: "totalFrames",
            type: "integer",
            isNullable: true,
          },
          {
            name: "processedFrames",
            type: "integer",
            default: 0,
          },
          {
            name: "s3OutputKey",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "errorMessage",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
            onUpdate: "now()",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["videoId"],
            referencedTableName: "videos",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
        indices: [
          {
            columnNames: ["videoId"],
          },
          {
            columnNames: ["status"],
          },
        ],
      }),
      true
    );

    // Notifications table
    await queryRunner.createTable(
      new Table({
        name: "notifications",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "videoId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "recipientEmail",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "type",
            type: "enum",
            enum: ["UPLOAD_COMPLETED", "PROCESSING_STARTED", "PROCESSING_COMPLETED", "PROCESSING_FAILED"],
          },
          {
            name: "status",
            type: "enum",
            enum: ["PENDING", "SENT", "FAILED"],
            default: "'PENDING'",
          },
          {
            name: "message",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "sentAt",
            type: "timestamp",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["videoId"],
            referencedTableName: "videos",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
        indices: [
          {
            columnNames: ["videoId"],
          },
          {
            columnNames: ["userId"],
          },
          {
            columnNames: ["status"],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("notifications", true);
    await queryRunner.dropTable("processing_jobs", true);
    await queryRunner.dropTable("videos", true);
  }
}
