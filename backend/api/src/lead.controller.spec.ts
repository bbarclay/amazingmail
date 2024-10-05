import { Test, TestingModule } from '@nestjs/testing';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

describe('LeadController', () => {
  let leadController: LeadController;
  let leadService: LeadService;

  const mockLeadService = {
    createLead: jest.fn((dto: CreateLeadDto) => ({ id: '1', ...dto })),
    getLeadById: jest.fn((id: string) => ({ id, name: 'Test Lead', email: 'test@example.com' })),
    updateLead: jest.fn((id: string, dto: UpdateLeadDto) => ({ id, ...dto })),
    deleteLead: jest.fn((id: string) => {}),
    listLeads: jest.fn(() => [{ id: '1', name: 'Test Lead', email: 'test@example.com' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadController],
      providers: [{ provide: LeadService, useValue: mockLeadService }],
    }).compile();

    leadController = module.get<LeadController>(LeadController);
    leadService = module.get<LeadService>(LeadService);
  });

  it('should create a lead', async () => {
    const dto: CreateLeadDto = { name: 'Test Lead', email: 'test@example.com' };
    expect(await leadController.createLead(dto)).toEqual({
      message: 'Lead created successfully',
      lead: { id: '1', ...dto },
    });
  });

  it('should get a lead by ID', async () => {
    expect(await leadController.getLeadById('1')).toEqual({
      lead: { id: '1', name: 'Test Lead', email: 'test@example.com' },
    });
  });

  it('should update a lead', async () => {
    const dto: UpdateLeadDto = { name: 'Updated Lead' };
    expect(await leadController.updateLead('1', dto)).toEqual({
      message: 'Lead updated successfully',
      lead: { id: '1', ...dto },
    });
  });

  it('should delete a lead', async () => {
    expect(await leadController.deleteLead('1')).toEqual({
      message: 'Lead deleted successfully',
    });
  });

  it('should list all leads', async () => {
    expect(await leadController.listLeads()).toEqual({
      leads: [{ id: '1', name: 'Test Lead', email: 'test@example.com' }],
    });
  });
});
