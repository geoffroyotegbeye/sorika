import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { CreateStockMovementDto } from './dto/stock-movement.dto';

@Controller('companies/:companyId/inventory')
@UseGuards(PermissionGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ─── Stats ────────────────────────────────────────────────────────────────────

  @Get('stats')
  @RequirePermission('INVENTORY', 'READ')
  getStats(@Param('companyId') companyId: string) {
    return this.inventoryService.getStats(companyId);
  }

  // ─── Catégories ───────────────────────────────────────────────────────────────

  @Get('categories')
  @RequirePermission('INVENTORY', 'READ')
  listCategories(@Param('companyId') companyId: string) {
    return this.inventoryService.listCategories(companyId);
  }

  @Post('categories')
  @RequirePermission('INVENTORY', 'CREATE')
  createCategory(@Param('companyId') companyId: string, @Body() dto: CreateCategoryDto) {
    return this.inventoryService.createCategory(companyId, dto);
  }

  @Patch('categories/:id')
  @RequirePermission('INVENTORY', 'UPDATE')
  updateCategory(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.inventoryService.updateCategory(companyId, id, dto);
  }

  @Delete('categories/:id')
  @RequirePermission('INVENTORY', 'DELETE')
  deleteCategory(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.inventoryService.deleteCategory(companyId, id);
  }

  // ─── Produits ─────────────────────────────────────────────────────────────────

  @Get('products')
  @RequirePermission('INVENTORY', 'READ')
  listProducts(
    @Param('companyId') companyId: string,
    @Query('categoryId') categoryId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.inventoryService.listProducts(companyId, {
      categoryId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
      lowStock: lowStock === 'true',
    });
  }

  @Get('products/:id')
  @RequirePermission('INVENTORY', 'READ')
  getProduct(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.inventoryService.getProduct(companyId, id);
  }

  @Post('products')
  @RequirePermission('INVENTORY', 'CREATE')
  createProduct(@Param('companyId') companyId: string, @Body() dto: CreateProductDto) {
    return this.inventoryService.createProduct(companyId, dto);
  }

  @Patch('products/:id')
  @RequirePermission('INVENTORY', 'UPDATE')
  updateProduct(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.inventoryService.updateProduct(companyId, id, dto);
  }

  @Delete('products/:id')
  @RequirePermission('INVENTORY', 'DELETE')
  deleteProduct(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.inventoryService.deleteProduct(companyId, id);
  }

  // ─── Mouvements de stock ──────────────────────────────────────────────────────

  @Get('movements')
  @RequirePermission('INVENTORY', 'READ')
  listMovements(
    @Param('companyId') companyId: string,
    @Query('productId') productId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.inventoryService.listMovements(companyId, {
      productId,
      type,
      startDate,
      endDate,
    });
  }

  @Post('products/:productId/movements')
  @RequirePermission('INVENTORY', 'CREATE')
  createMovement(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateStockMovementDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.inventoryService.createMovement(companyId, productId, dto, userId);
  }

  // ─── Alertes ──────────────────────────────────────────────────────────────────

  @Get('alerts')
  @RequirePermission('INVENTORY', 'READ')
  listAlerts(
    @Param('companyId') companyId: string,
    @Query('isResolved') isResolved?: string,
  ) {
    return this.inventoryService.listAlerts(companyId, {
      isResolved: isResolved === 'true' ? true : isResolved === 'false' ? false : undefined,
    });
  }

  @Patch('alerts/:id/resolve')
  @RequirePermission('INVENTORY', 'UPDATE')
  resolveAlert(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.inventoryService.resolveAlert(companyId, id);
  }
}
