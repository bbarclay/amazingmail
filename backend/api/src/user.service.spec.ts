import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from './entities/api-key.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockConfigService = {
  get: jest.fn(),
};

const mockS3 = {
  upload: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => mockS3),
  };
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockRepository },
        { provide: getRepositoryToken(ApiKey), useFactory: mockRepository },
        { provide: getRepositoryToken(ConnectedAccount), useFactory: mockRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadProfileImage', () => {
    it('should upload image to S3 and update user profile', async () => {
      const userId = 'test-user-id';
      const imageBuffer = Buffer.from('test-image');
      const filename = 'test-image.jpg';
      const mockUser = { id: userId, imageUrl: '' };
      const mockS3Response = { Location: 'https://test-bucket.s3.amazonaws.com/test-image.jpg' };

      const userRepositoryFindOne = jest.spyOn(service['userRepository'], 'findOne').mockResolvedValue(mockUser);
      const userRepositorySave = jest.spyOn(service['userRepository'], 'save').mockResolvedValue({ ...mockUser, imageUrl: mockS3Response.Location });
      mockConfigService.get.mockReturnValue('test-bucket');
      mockS3.promise.mockResolvedValue(mockS3Response);

      const result = await service.uploadProfileImage(userId, imageBuffer, filename);

      expect(userRepositoryFindOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockS3.upload).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: `profile-images/${userId}/${filename}`,
        Body: imageBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      });
      expect(userRepositorySave).toHaveBeenCalledWith({ ...mockUser, imageUrl: mockS3Response.Location });
      expect(result.imageUrl).toBe(mockS3Response.Location);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'non-existent-user-id';
      const imageBuffer = Buffer.from('test-image');
      const filename = 'test-image.jpg';

      jest.spyOn(service['userRepository'], 'findOne').mockResolvedValue(null);

      await expect(service.uploadProfileImage(userId, imageBuffer, filename)).rejects.toThrow('User not found');
    });

    it('should throw an error if S3 upload fails', async () => {
      const userId = 'test-user-id';
      const imageBuffer = Buffer.from('test-image');
      const filename = 'test-image.jpg';
      const mockUser = { id: userId, imageUrl: '' };

      jest.spyOn(service['userRepository'], 'findOne').mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('test-bucket');
      mockS3.promise.mockRejectedValue(new Error('S3 upload failed'));

      await expect(service.uploadProfileImage(userId, imageBuffer, filename)).rejects.toThrow('Failed to upload image');
    });
  });
});

