import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateContactDto } from './dto/contacts/create-contact.dto';
import { UpdateContactDto } from './dto/contacts/update-contact.dto';
import { CreateCompanyDto } from './dto/companies/create-company.dto';
import { UpdateCompanyDto } from './dto/companies/update-company.dto';
import { CreateOpportunityDto } from './dto/opportunities/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/opportunities/update-opportunity.dto';
import { UpdateStageDto } from './dto/opportunities/update-stage.dto';
import { CreateActivityDto } from './dto/activities/create-activity.dto';
import { UpdateActivityDto } from './dto/activities/update-activity.dto';

// TEMPORAIRE : PermissionGuard désactivé jusqu'à la mise en place du système de paiement
// TODO: Réactiver quand le système de facturation sera en place
@Controller('companies/:companyId/crm')
// @UseGuards(PermissionGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // ============================================
  // CONTACTS
  // ============================================

  @Get('contacts')
  async listContacts(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('ownerId') ownerId?: string,
    @Query('search') search?: string,
  ) {
    return this.crmService.listContacts(companyId, {
      status,
      ownerId,
      search,
    });
  }

  @Get('contacts/:id')
  async getContact(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.getContact(id, companyId);
  }

  @Post('contacts')
  async createContact(
    @Param('companyId') companyId: string,
    @Body() dto: CreateContactDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.crmService.createContact(companyId, dto, userId);
  }

  @Patch('contacts/:id')
  async updateContact(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.crmService.updateContact(id, companyId, dto);
  }

  @Delete('contacts/:id')
  async deleteContact(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.deleteContact(id, companyId);
  }

  // ============================================
  // ENTREPRISES CLIENTES
  // ============================================

  @Get('client-companies')
  async listClientCompanies(
    @Param('companyId') companyId: string,
    @Query('ownerId') ownerId?: string,
    @Query('industry') industry?: string,
    @Query('size') size?: string,
    @Query('search') search?: string,
  ) {
    return this.crmService.listClientCompanies(companyId, {
      ownerId,
      industry,
      size,
      search,
    });
  }

  @Get('client-companies/:id')
  async getClientCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.getClientCompany(id, companyId);
  }

  @Post('client-companies')
  async createClientCompany(
    @Param('companyId') companyId: string,
    @Body() dto: CreateCompanyDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.crmService.createClientCompany(companyId, dto, userId);
  }

  @Patch('client-companies/:id')
  async updateClientCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.crmService.updateClientCompany(id, companyId, dto);
  }

  @Delete('client-companies/:id')
  async deleteClientCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.deleteClientCompany(id, companyId);
  }

  // ============================================
  // OPPORTUNITÉS
  // ============================================

  @Get('opportunities')
  async listOpportunities(
    @Param('companyId') companyId: string,
    @Query('stage') stage?: string,
    @Query('ownerId') ownerId?: string,
    @Query('contactId') contactId?: string,
    @Query('companyId') clientCompanyId?: string,
    @Query('search') search?: string,
  ) {
    return this.crmService.listOpportunities(companyId, {
      stage,
      ownerId,
      contactId,
      companyId: clientCompanyId,
      search,
    });
  }

  @Get('opportunities/:id')
  async getOpportunity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.getOpportunity(id, companyId);
  }

  @Post('opportunities')
  async createOpportunity(
    @Param('companyId') companyId: string,
    @Body() dto: CreateOpportunityDto,
    @Headers('x-user-id') userId: string,
  ) {
    try {
      console.log('=== CONTROLLER CREATE OPPORTUNITY ===');
      console.log('companyId:', companyId);
      console.log('userId:', userId);
      console.log('dto:', dto);
      
      if (!userId) {
        throw new Error('User ID is required (x-user-id header missing)');
      }
      
      return await this.crmService.createOpportunity(companyId, dto, userId);
    } catch (error) {
      console.error('=== CONTROLLER ERROR ===');
      console.error('Error:', error);
      throw error;
    }
  }

  @Patch('opportunities/:id')
  async updateOpportunity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.crmService.updateOpportunity(id, companyId, dto);
  }

  @Patch('opportunities/:id/stage')
  async updateStage(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStageDto,
  ) {
    return this.crmService.updateStage(id, companyId, dto);
  }

  @Delete('opportunities/:id')
  async deleteOpportunity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.deleteOpportunity(id, companyId);
  }

  // ============================================
  // ACTIVITÉS
  // ============================================

  @Get('activities')
  async listActivities(
    @Param('companyId') companyId: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('ownerId') ownerId?: string,
    @Query('contactId') contactId?: string,
    @Query('companyId') clientCompanyId?: string,
    @Query('opportunityId') opportunityId?: string,
    @Query('search') search?: string,
  ) {
    return this.crmService.listActivities(companyId, {
      type,
      status,
      ownerId,
      contactId,
      companyId: clientCompanyId,
      opportunityId,
      search,
    });
  }

  @Get('activities/:id')
  async getActivity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.getActivity(id, companyId);
  }

  @Post('activities')
  async createActivity(
    @Param('companyId') companyId: string,
    @Body() dto: CreateActivityDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.crmService.createActivity(companyId, dto, userId);
  }

  @Patch('activities/:id')
  async updateActivity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.crmService.updateActivity(id, companyId, dto);
  }

  @Patch('activities/:id/complete')
  async completeActivity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.completeActivity(id, companyId);
  }

  @Delete('activities/:id')
  async deleteActivity(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.deleteActivity(id, companyId);
  }

  // ============================================
  // DASHBOARD & STATS
  // ============================================

  @Get('stats')
  async getCRMStats(@Param('companyId') companyId: string) {
    return this.crmService.getCRMStats(companyId);
  }
}
