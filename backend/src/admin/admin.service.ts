import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isSuperAdmin: true,
        createdAt: true,
        memberships: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllCompanies() {
    return this.prisma.company.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        pages: {
          select: {
            id: true,
            slug: true,
            title: true,
            elements: true,
            isHomePage: true,
            isPublished: true,
          },
        },
        _count: {
          select: {
            pages: true,
            products: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async deleteCompany(companyId: string) {
    return this.prisma.company.delete({
      where: { id: companyId },
    });
  }

  async toggleSuperAdmin(userId: string, isSuperAdmin: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuperAdmin },
    });
  }
}
