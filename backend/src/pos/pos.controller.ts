import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PosService } from './pos.service';
import { PermissionGuard } from '../common/guards/permission.guard';
import { CreateRegisterDto } from './dto/create-register.dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('companies/:companyId/pos')
@UseGuards(PermissionGuard)
export class PosController {
  constructor(private readonly posService: PosService) {}

  // ============================================
  // CAISSES (Cash Registers)
  // ============================================

  @Post('registers')
  createRegister(
    @Param('companyId') companyId: string,
    @Body() dto: CreateRegisterDto,
  ) {
    return this.posService.createRegister(companyId, dto);
  }

  @Get('registers')
  getRegisters(@Param('companyId') companyId: string) {
    return this.posService.getRegisters(companyId);
  }

  @Get('registers/:id')
  getRegister(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.posService.getRegister(companyId, id);
  }

  @Patch('registers/:id')
  updateRegister(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateRegisterDto>,
  ) {
    return this.posService.updateRegister(companyId, id, dto);
  }

  @Delete('registers/:id')
  deleteRegister(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.posService.deleteRegister(companyId, id);
  }

  // ============================================
  // SESSIONS DE CAISSE
  // ============================================

  @Post('sessions/open')
  openSession(
    @Param('companyId') companyId: string,
    @Body() dto: OpenSessionDto,
  ) {
    return this.posService.openSession(companyId, dto);
  }

  @Post('sessions/:id/close')
  closeSession(
    @Param('companyId') companyId: string,
    @Param('id') sessionId: string,
    @Body() dto: CloseSessionDto,
  ) {
    return this.posService.closeSession(companyId, sessionId, dto);
  }

  @Get('sessions')
  getSessions(@Param('companyId') companyId: string) {
    return this.posService.getSessions(companyId);
  }

  @Get('sessions/current')
  async getCurrentSession(
    @Param('companyId') companyId: string,
    @Query('registerId') registerId: string,
  ) {
    const session = await this.posService.getCurrentSession(companyId, registerId);
    // Retourner explicitement null si aucune session
    return session || null;
  }

  @Get('sessions/:id')
  getSession(
    @Param('companyId') companyId: string,
    @Param('id') sessionId: string,
  ) {
    return this.posService.getSession(companyId, sessionId);
  }

  // ============================================
  // VENTES
  // ============================================

  @Post('sales')
  createSale(
    @Param('companyId') companyId: string,
    @Body() dto: CreateSaleDto,
  ) {
    return this.posService.createSale(companyId, dto);
  }

  @Get('sales')
  getSales(
    @Param('companyId') companyId: string,
    @Query('registerId') registerId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('cashierId') cashierId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (registerId) filters.registerId = registerId;
    if (sessionId) filters.sessionId = sessionId;
    if (cashierId) filters.cashierId = cashierId;
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.posService.getSales(companyId, filters);
  }

  @Get('sales/:id')
  getSale(
    @Param('companyId') companyId: string,
    @Param('id') saleId: string,
  ) {
    return this.posService.getSale(companyId, saleId);
  }

  // ============================================
  // RAPPORTS
  // ============================================

  @Get('reports/dashboard')
  getDashboard(@Param('companyId') companyId: string) {
    return this.posService.getDashboard(companyId);
  }
}
