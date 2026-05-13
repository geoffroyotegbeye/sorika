import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';

@Controller('companies/:companyId/projects')
@UseGuards(PermissionGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ============================================
  // PROJETS
  // ============================================

  @Get()
  @RequirePermission('PROJECTS', 'READ')
  getAllProjects(@Param('companyId') companyId: string) {
    return this.projectsService.getAllProjects(companyId);
  }

  @Get('stats')
  @RequirePermission('PROJECTS', 'READ')
  getProjectStats(@Param('companyId') companyId: string) {
    return this.projectsService.getProjectStats(companyId);
  }

  @Get('all-tasks')
  @RequirePermission('PROJECTS', 'READ')
  getAllCompanyTasks(@Param('companyId') companyId: string) {
    return this.projectsService.getAllCompanyTasks(companyId);
  }

  @Get(':projectId')
  @RequirePermission('PROJECTS', 'READ')
  getProjectById(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getProjectById(companyId, projectId);
  }

  @Post()
  @RequirePermission('PROJECTS', 'CREATE')
  createProject(@Param('companyId') companyId: string, @Body() data: any) {
    return this.projectsService.createProject(companyId, data);
  }

  @Put(':projectId')
  @RequirePermission('PROJECTS', 'UPDATE')
  updateProject(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
  ) {
    return this.projectsService.updateProject(companyId, projectId, data);
  }

  @Delete(':projectId')
  @RequirePermission('PROJECTS', 'DELETE')
  deleteProject(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.deleteProject(companyId, projectId);
  }

  // ============================================
  // MEMBRES DU PROJET
  // ============================================

  @Post(':projectId/members')
  @RequirePermission('PROJECTS', 'UPDATE')
  addProjectMember(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Body() data: { employeeId: string; role?: string },
  ) {
    return this.projectsService.addProjectMember(companyId, projectId, data);
  }

  @Delete(':projectId/members/:memberId')
  @RequirePermission('PROJECTS', 'UPDATE')
  removeProjectMember(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.projectsService.removeProjectMember(
      companyId,
      projectId,
      memberId,
    );
  }

  // ============================================
  // TÂCHES
  // ============================================

  @Get(':projectId/tasks')
  @RequirePermission('PROJECTS', 'READ')
  getAllTasks(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getAllTasks(companyId, projectId);
  }

  @Post(':projectId/tasks')
  @RequirePermission('PROJECTS', 'CREATE')
  createTask(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
  ) {
    return this.projectsService.createTask(companyId, projectId, data);
  }

  @Put(':projectId/tasks/:taskId')
  @RequirePermission('PROJECTS', 'UPDATE')
  updateTask(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() data: any,
  ) {
    return this.projectsService.updateTask(companyId, projectId, taskId, data);
  }

  @Delete(':projectId/tasks/:taskId')
  @RequirePermission('PROJECTS', 'DELETE')
  deleteTask(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.projectsService.deleteTask(companyId, projectId, taskId);
  }

  // ============================================
  // SUIVI DU TEMPS
  // ============================================

  @Get(':projectId/time-entries')
  @RequirePermission('PROJECTS', 'READ')
  getAllTimeEntries(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getAllTimeEntries(companyId, projectId);
  }

  @Post(':projectId/time-entries')
  @RequirePermission('PROJECTS', 'CREATE')
  createTimeEntry(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
  ) {
    return this.projectsService.createTimeEntry(companyId, projectId, data);
  }
}
