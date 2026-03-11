import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Video, VideoStatus } from "./entities/video.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async createVideo(createVideoDto: any): Promise<any> {
    const video = this.videoRepository.create({
      id: uuidv4(),
      ...createVideoDto,
      status: "PENDING" as VideoStatus,
    });
    return this.videoRepository.save(video);
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    return this.videoRepository.find({
      where: { userId },
      order: { uploadedAt: "DESC" },
    });
  }

  async getVideoById(id: string): Promise<Video | null> {
    return this.videoRepository.findOne({ where: { id } });
  }

  async updateVideoStatus(id: string, status: VideoStatus): Promise<Video | null> {
    const video = await this.getVideoById(id);
    if (!video) return null;
    video.status = status;
    return this.videoRepository.save(video);
  }

  async getAllVideos(limit: number = 10, offset: number = 0): Promise<[Video[], number]> {
    return this.videoRepository.findAndCount({
      order: { uploadedAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }
}
