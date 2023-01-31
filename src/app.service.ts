import { Injectable } from '@nestjs/common';
import { IResponse } from './core/interfaces/responses/iresponse';

@Injectable()
export class AppService {
  getHealthCheckStatus(): IResponse<string> {
    return { status: 200, data: [] };
  }
}
