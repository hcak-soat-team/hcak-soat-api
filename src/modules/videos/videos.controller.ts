import { Controller, Get, Post, Param, Body, Query, BadRequestException, Res } from "@nestjs/common";
import { Response } from "express";
import { VideosService } from "./videos.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import * as AWS from "aws-sdk";

@ApiTags("videos")
@Controller("videos")
export class VideosController {
  private s3Client: AWS.S3;

  constructor(private videosService: VideosService) {
    this.s3Client = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  @Post()
  @ApiOperation({ summary: "Create a new video upload" })
  @ApiResponse({ status: 201, description: "Video created" })
  async createVideo(@Body() createVideoDto: any) {
    if (!createVideoDto.userId || !createVideoDto.s3Key || !createVideoDto.fileName) {
      throw new BadRequestException("Missing required fields: userId, s3Key, fileName");
    }
    return this.videosService.createVideo(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: "List videos for user" })
  async getUserVideos(@Query("userId") userId: string, @Query("limit") limit = 10) {
    if (!userId) {
      throw new BadRequestException("userId query parameter required");
    }
    return this.videosService.getVideosByUser(userId);
  }

  @Get("all")
  @ApiOperation({ summary: "List all videos (admin)" })
  async getAllVideos(
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ) {
    const [videos, total] = await this.videosService.getAllVideos(limit, offset);
    return { videos, total, limit, offset };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get video by ID" })
  async getVideo(@Param("id") id: string) {
    const video = await this.videosService.getVideoById(id);
    if (!video) {
      throw new BadRequestException("Video not found");
    }
    return video;
  }

  @Get(":id/download")
  @ApiOperation({ summary: "Get presigned S3 URL for download" })
  async getDownloadUrl(@Param("id") id: string, @Res() res: Response) {
    const video = await this.videosService.getVideoById(id);
    if (!video) {
      throw new BadRequestException("Video not found");
    }

    const signedUrl = this.s3Client.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET || "hcak-soat-videos",
      Key: video.s3Key,
      Expires: 3600, // 1 hour
    });

    return res.json({ downloadUrl: signedUrl, videoId: id });
  }

  @Post(":id/presigned-upload")
  @ApiOperation({ summary: "Get presigned URL for upload to S3" })
  async getPresignedUploadUrl(@Param("id") id: string) {
    const video = await this.videosService.getVideoById(id);
    if (!video) {
      throw new BadRequestException("Video not found");
    }

    const presignedUrl = this.s3Client.getSignedUrl("putObject", {
      Bucket: process.env.S3_BUCKET || "hcak-soat-videos",
      Key: video.s3Key,
      ContentType: video.mimeType,
      Expires: 3600,
    });

    return { presignedUrl, videoId: id };
  }
}
