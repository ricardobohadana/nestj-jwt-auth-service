import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Service health check', () => {
    it('should return status 200 with no data', () => {
      const response = appController.getHealthCheckStatus();
      const expectedResponse = { status: 200, data: [] };
      expect(response).toEqual(expectedResponse);
    });
  });
});
