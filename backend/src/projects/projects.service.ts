import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Helper pour récupérer l'ID de l'organisation
  private async getOrganizationId(slugOrId: string): Promise<string> {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slugOrId)) {
      const organization = await this.prisma.company.findUnique({
        where: { id: slugOrId },
        select: { id: true },
      });
      if (!organization) {
        throw new NotFoundException('Organisation non trouvée');
      }
      return slugOrId;
    }

    const organization = await this.prisma.company.findUnique({
      where: { slug: slugOrId },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundException('Organisation non trouvée');
    }

    return organization.id;
  }

  // ============================================
  // PROJETS
  // ============================================

  async getAllProjects(companyId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    return this.prisma.project.findMany({
      where: { companyId: organizationId },
      include: {
        client: true,
        members: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(companyId: string, projectId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
      include: {
        client: true,
        members: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            tasks: true,
            timeEntries: true,
            documents: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return project;
  }

  async createProject(companyId: string, data: any) {
    const organizationId = await this.getOrganizationId(companyId);

    // Générer un code projet si non fourni
    if (!data.code) {
      const count = await this.prisma.project.count({
        where: { companyId: organizationId },
      });
      data.code = `PROJ-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    }

    return this.prisma.project.create({
      data: {
        ...data,
        companyId: organizationId,
      },
      include: {
        client: true,
        members: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async updateProject(companyId: string, projectId: string, data: any) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        client: true,
        members: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteProject(companyId: string, projectId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }

  // ============================================
  // MEMBRES DU PROJET
  // ============================================

  async addProjectMember(
    companyId: string,
    projectId: string,
    data: { employeeId: string; role?: string },
  ) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        employeeId: data.employeeId,
        role: data.role || 'MEMBER',
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
    });
  }

  async removeProjectMember(
    companyId: string,
    projectId: string,
    memberId: string,
  ) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.projectMember.delete({
      where: { id: memberId },
    });
  }

  // ============================================
  // TÂCHES
  // ============================================

  async getAllTasks(companyId: string, projectId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            subtasks: true,
            comments: true,
            attachments: true,
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async createTask(companyId: string, projectId: string, data: any) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
        companyId: organizationId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateTask(
    companyId: string,
    projectId: string,
    taskId: string,
    data: any,
  ) {
    const organizationId = await this.getOrganizationId(companyId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
        companyId: organizationId,
      },
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteTask(companyId: string, projectId: string, taskId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
        companyId: organizationId,
      },
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  // ============================================
  // SUIVI DU TEMPS
  // ============================================

  async getAllTimeEntries(companyId: string, projectId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return this.prisma.timeEntry.findMany({
      where: { projectId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async createTimeEntry(companyId: string, projectId: string, data: any) {
    const organizationId = await this.getOrganizationId(companyId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    // Calculer la durée si endTime est fourni
    if (data.endTime && data.startTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      data.duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // en heures
    }

    return this.prisma.timeEntry.create({
      data: {
        ...data,
        projectId,
        companyId: organizationId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  // ============================================
  // STATISTIQUES
  // ============================================

  async getProjectStats(companyId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const totalProjects = await this.prisma.project.count({
      where: { companyId: organizationId },
    });

    const activeProjects = await this.prisma.project.count({
      where: {
        companyId: organizationId,
        status: 'IN_PROGRESS',
      },
    });

    const completedProjects = await this.prisma.project.count({
      where: {
        companyId: organizationId,
        status: 'COMPLETED',
      },
    });

    const totalTasks = await this.prisma.task.count({
      where: { companyId: organizationId },
    });

    const completedTasks = await this.prisma.task.count({
      where: {
        companyId: organizationId,
        status: 'DONE',
      },
    });

    const totalTimeLogged = await this.prisma.timeEntry.aggregate({
      where: { companyId: organizationId },
      _sum: { duration: true },
    });

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      totalTimeLogged: totalTimeLogged._sum.duration || 0,
    };
  }
}
