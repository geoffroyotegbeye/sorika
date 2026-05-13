import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';

@Controller('companies/:companyId/ecommerce')
@UseGuards(PermissionGuard)
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  // ==================== CARTS ====================

  @Get('cart')
  @RequirePermission('ECOMMERCE', 'READ')
  async getCart(@Req() req: any, @Param('companyId') companyId: string) {
    const userId = req.user.id;
    return this.ecommerceService.getOrCreateCart(companyId, userId);
  }

  @Post('cart')
  @RequirePermission('ECOMMERCE', 'CREATE')
  async addToCart(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Body() dto: { productId: string; quantity: number },
  ) {
    const userId = req.user.id;
    return this.ecommerceService.addToCart(companyId, dto.productId, dto.quantity, userId);
  }

  @Put('cart/:itemId')
  @RequirePermission('ECOMMERCE', 'UPDATE')
  async updateCartItem(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Param('itemId') itemId: string,
    @Body() dto: { quantity: number },
  ) {
    const userId = req.user.id;
    return this.ecommerceService.updateCartItemQuantity(itemId, dto.quantity, userId);
  }

  @Delete('cart/:itemId')
  @RequirePermission('ECOMMERCE', 'DELETE')
  async removeFromCart(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Param('itemId') itemId: string,
  ) {
    const userId = req.user.id;
    return this.ecommerceService.removeFromCart(itemId, userId);
  }

  @Delete('cart')
  @RequirePermission('ECOMMERCE', 'DELETE')
  async clearCart(@Req() req: any, @Param('companyId') companyId: string) {
    const userId = req.user.id;
    return this.ecommerceService.clearCart(companyId, userId);
  }

  // ==================== ORDERS ====================

  @Post('orders')
  @RequirePermission('ECOMMERCE', 'CREATE')
  async createOrder(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Body() dto: any,
  ) {
    const userId = req.user.id;
    return this.ecommerceService.createOrder(companyId, {
      ...dto,
      userId,
    });
  }

  @Get('orders')
  @RequirePermission('ECOMMERCE', 'READ')
  async getOrders(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Query() filters: any,
  ) {
    return this.ecommerceService.getOrders(companyId, filters);
  }

  @Get('orders/:id')
  @RequirePermission('ECOMMERCE', 'READ')
  async getOrder(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    const order = await this.ecommerceService.getOrders(companyId, {});
    const found = order.find(o => o.id === id);
    if (!found) {
      throw new Error('Commande non trouvée');
    }
    return found;
  }

  @Put('orders/:id/status')
  @RequirePermission('ECOMMERCE', 'UPDATE')
  async updateOrderStatus(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: { status: string },
  ) {
    return this.ecommerceService.updateOrderStatus(id, dto.status, companyId);
  }

  // ==================== COUPONS ====================

  @Post('coupons/validate')
  @RequirePermission('ECOMMERCE', 'READ')
  async validateCoupon(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Body() dto: { code: string; subtotal: number },
  ) {
    return this.ecommerceService.validateCoupon(companyId, dto.code, dto.subtotal);
  }

  // ==================== REVIEWS ====================

  @Post('reviews')
  @RequirePermission('ECOMMERCE', 'CREATE')
  async createReview(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Body() dto: any,
  ) {
    const userId = req.user.id;
    return this.ecommerceService.createReview(companyId, dto.productId, {
      ...dto,
      userId,
    });
  }

  @Get('products/:productId/reviews')
  @RequirePermission('ECOMMERCE', 'READ')
  async getProductReviews(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
  ) {
    return this.ecommerceService.getProductReviews(productId, companyId);
  }

  // ==================== STATS ====================

  @Get('stats/dashboard')
  @RequirePermission('ECOMMERCE', 'READ')
  async getDashboardStats(@Param('companyId') companyId: string) {
    return this.ecommerceService.getDashboardStats(companyId);
  }
}