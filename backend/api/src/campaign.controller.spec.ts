import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

describe('CampaignController', () => {
  let campaignController: CampaignController;
  let campaignService: CampaignService;

  const mockCampaignService = {
    createCampaign: jest.fn((dto: CreateCampaignDto) => ({ id: '1', ...dto })),
    getCampaignById: jest.fn((id: string) => ({ id, name: 'Test Campaign', status: 'active' })),
    updateCampaign: jest.fn((id: string, dto: UpdateCampaignDto) => ({ id, ...dto })),
    deleteCampaign: jest.fn((id: string) => {}),
    listCampaigns: jest.fn(() => [{ id: '1', name: 'Test Campaign', status: 'active' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [{ provide: CampaignService, useValue: mockCampaignService }],
    }).compile();

    campaignController = module.get<CampaignController>(CampaignController);
    campaignService = module.get<CampaignService>(CampaignService);
  });

  it('should create a campaign', async () => {
    const dto: CreateCampaignDto = { name: 'Test Campaign', status: 'active' };
    expect(await campaignController.createCampaign(dto)).toEqual({
      message: 'Campaign created successfully',
      campaign: { id: '1', ...dto },
    });
  });

  it('should get a campaign by ID', async () => {
    expect(await campaignController.getCampaignById('1')).toEqual({
      campaign: { id: '1', name: 'Test Campaign', status: 'active' },
    });
  });

  it('should update a campaign', async () => {
    const dto: UpdateCampaignDto = { name: 'Updated Campaign' };
    expect(await campaignController.updateCampaign('1', dto)).toEqual({
      message: 'Campaign updated successfully',
      campaign: { id: '1', ...dto },
    });
  });

  it('should delete a campaign', async () => {
    expect(await campaignController.deleteCampaign('1')).toEqual({
      message: 'Campaign deleted successfully',
    });
  });

  it('should list all campaigns', async () => {
    expect(await campaignController.listCampaigns()).toEqual({
      campaigns: [{ id: '1', name: 'Test Campaign', status: 'active' }],
    });
  });
});
