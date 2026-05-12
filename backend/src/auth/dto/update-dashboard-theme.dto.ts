import { IsIn } from 'class-validator';

export class UpdateDashboardThemeDto {
  @IsIn(['LIGHT', 'DARK'])
  dashboardTheme!: 'LIGHT' | 'DARK';
}
