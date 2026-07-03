import { Refund, RefundFilters, RefundStatus, RefundTimeline } from '@/types/admin';
import { mockRefunds } from './mockData';

class RefundService {
  private refunds: Refund[] = [...mockRefunds];

  getAllRefunds(filters?: RefundFilters): Refund[] {
    let filteredRefunds = [...this.refunds];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredRefunds = filteredRefunds.filter(refund => 
          filters.status!.includes(refund.status)
        );
      }

      if (filters.dateRange) {
        filteredRefunds = filteredRefunds.filter(refund => 
          refund.createdAt >= filters.dateRange!.from && 
          refund.createdAt <= filters.dateRange!.to
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRefunds = filteredRefunds.filter(refund =>
          refund.id.toLowerCase().includes(searchLower) ||
          refund.orderId.toLowerCase().includes(searchLower) ||
          refund.customerName.toLowerCase().includes(searchLower) ||
          refund.customerEmail.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredRefunds.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getRefundsByStatus(status: RefundStatus): Refund[] {
    return this.refunds.filter(refund => refund.status === status);
  }

  getRefundById(refundId: string): Refund | null {
    return this.refunds.find(refund => refund.id === refundId) || null;
  }

  updateRefundStatus(refundId: string, status: RefundStatus, updatedBy: string, remarks?: string): Refund {
    const refundIndex = this.refunds.findIndex(refund => refund.id === refundId);
    if (refundIndex === -1) {
      throw new Error('Refund not found');
    }

    const refund = this.refunds[refundIndex];
    refund.status = status;
    refund.updatedAt = new Date();

    if (status === 'completed') {
      refund.completedAt = new Date();
    }

    const timelineItem: RefundTimeline = {
      id: `RFTL-${Date.now()}`,
      status,
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks
    };

    refund.timeline.push(timelineItem);
    this.refunds[refundIndex] = refund;

    return refund;
  }

  addRefundNote(refundId: string, note: string, updatedBy: string): Refund {
    const refundIndex = this.refunds.findIndex(refund => refund.id === refundId);
    if (refundIndex === -1) {
      throw new Error('Refund not found');
    }

    const refund = this.refunds[refundIndex];
    refund.adminNotes = note;
    refund.updatedAt = new Date();
    this.refunds[refundIndex] = refund;

    return refund;
  }

  processPartialRefund(refundId: string, amount: number, updatedBy: string, remarks?: string): Refund {
    const refundIndex = this.refunds.findIndex(refund => refund.id === refundId);
    if (refundIndex === -1) {
      throw new Error('Refund not found');
    }

    const refund = this.refunds[refundIndex];
    refund.refundAmount = amount;
    refund.refundType = 'partial';
    refund.status = 'processing';
    refund.updatedAt = new Date();

    const timelineItem: RefundTimeline = {
      id: `RFTL-${Date.now()}`,
      status: 'processing',
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks: remarks || `Partial refund of $${amount} initiated`
    };

    refund.timeline.push(timelineItem);
    this.refunds[refundIndex] = refund;

    return refund;
  }

  getRefundStats() {
    const totalRefunds = this.refunds.length;
    const pending = this.refunds.filter(r => r.status === 'pending').length;
    const approved = this.refunds.filter(r => r.status === 'approved').length;
    const processing = this.refunds.filter(r => r.status === 'processing').length;
    const completed = this.refunds.filter(r => r.status === 'completed').length;
    const rejected = this.refunds.filter(r => r.status === 'rejected').length;

    const totalRefundAmount = this.refunds
      .filter(r => r.status === 'completed')
      .reduce((sum, refund) => sum + refund.refundAmount, 0);

    const pendingRefundAmount = this.refunds
      .filter(r => r.status === 'pending' || r.status === 'approved' || r.status === 'processing')
      .reduce((sum, refund) => sum + refund.refundAmount, 0);

    return {
      totalRefunds,
      pending,
      approved,
      processing,
      completed,
      rejected,
      totalRefundAmount,
      pendingRefundAmount
    };
  }
}

export const refundService = new RefundService();
