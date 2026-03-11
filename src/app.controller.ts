import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { HealthCheck } from '@nestjs/terminus';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
    constructor(
        private readonly healthService: HealthService,
    ){}
    
    @HealthCheck()
    @Get()
    healthCheck() {
        return this.healthService.check();
    }
}
