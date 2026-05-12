import { Controller, Post, Patch, Body, Headers, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDashboardThemeDto } from './dto/update-dashboard-theme.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** Préférence clair / sombre du tableau de bord (par utilisateur, tout rôle). */
  @Patch('me/dashboard-theme')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateDashboardTheme(
    @Headers('x-user-id') userId: string | undefined,
    @Body() dto: UpdateDashboardThemeDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Authentification requise');
    }
    return this.authService.updateDashboardTheme(userId, dto.dashboardTheme);
  }
}
