export class UpdateAdvanceDto {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  paidAt?: Date;
  paidBy?: string;
}
