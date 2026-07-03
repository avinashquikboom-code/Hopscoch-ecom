import { ReturnRequest, ReturnFilters, ReturnStatus, ReturnTimeline } from '@/types/admin';
import { mockReturnRequests } from './mockData';

class ReturnService {
  private returns: ReturnRequest[] = [...mockReturnRequests];

  getAllReturns(filters?: ReturnFilters): ReturnRequest[] {
    let filteredReturns = [...this.returns];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredReturns = filteredReturns.filter(ret => 
          filters.status!.includes(ret.status)
        );
      }

      if (filters.dateRange) {
        filteredReturns = filteredReturns.filter(ret => 
          ret.createdAt >= filters.dateRange!.from && 
          ret.createdAt <= filters.dateRange!.to
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredReturns = filteredReturns.filter(ret =>
          ret.id.toLowerCase().includes(searchLower) ||
          ret.orderId.toLowerCase().includes(searchLower) ||
          ret.customerName.toLowerCase().includes(searchLower) ||
          ret.customerEmail.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredReturns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getReturnsByStatus(status: ReturnStatus): ReturnRequest[] {
    return this.returns.filter(ret => ret.status === status);
  }

  getReturnById(returnId: string): ReturnRequest | null {
    return this.returns.find(ret => ret.id === returnId) || null;
  }

  updateReturnStatus(returnId: string, status: ReturnStatus, updatedBy: string, remarks?: string): ReturnRequest {
    const returnIndex = this.returns.findIndex(ret => ret.id === returnId);
    if (returnIndex === -1) {
      throw new Error('Return request not found');
    }

    const returnRequest = this.returns[returnIndex];
    returnRequest.status = status;
    returnRequest.updatedAt = new Date();

    const timelineItem: ReturnTimeline = {
      id: `RTL-${Date.now()}`,
      status,
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks
    };

    returnRequest.timeline.push(timelineItem);
    this.returns[returnIndex] = returnRequest;

    return returnRequest;
  }

  addReturnNote(returnId: string, note: string, updatedBy: string): ReturnRequest {
    const returnIndex = this.returns.findIndex(ret => ret.id === returnId);
    if (returnIndex === -1) {
      throw new Error('Return request not found');
    }

    const returnRequest = this.returns[returnIndex];
    returnRequest.adminNotes = note;
    returnRequest.updatedAt = new Date();
    this.returns[returnIndex] = returnRequest;

    return returnRequest;
  }

  schedulePickup(returnId: string, courierPartner: string, pickupDate: Date, updatedBy: string): ReturnRequest {
    const returnIndex = this.returns.findIndex(ret => ret.id === returnId);
    if (returnIndex === -1) {
      throw new Error('Return request not found');
    }

    const returnRequest = this.returns[returnIndex];
    returnRequest.pickupStatus = 'scheduled';
    returnRequest.updatedAt = new Date();

    const timelineItem: ReturnTimeline = {
      id: `RTL-${Date.now()}`,
      status: 'pickup_scheduled',
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks: `Pickup scheduled with ${courierPartner} for ${pickupDate.toLocaleDateString()}`
    };

    returnRequest.timeline.push(timelineItem);
    this.returns[returnIndex] = returnRequest;

    return returnRequest;
  }

  completeQualityInspection(returnId: string, passed: boolean, notes: string, updatedBy: string): ReturnRequest {
    const returnIndex = this.returns.findIndex(ret => ret.id === returnId);
    if (returnIndex === -1) {
      throw new Error('Return request not found');
    }

    const returnRequest = this.returns[returnIndex];
    returnRequest.inspectionStatus = 'completed';
    returnRequest.updatedAt = new Date();

    const timelineItem: ReturnTimeline = {
      id: `RTL-${Date.now()}`,
      status: passed ? 'refund_approved' : 'rejected',
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks: notes
    };

    returnRequest.timeline.push(timelineItem);
    this.returns[returnIndex] = returnRequest;

    return returnRequest;
  }

  getReturnStats() {
    const totalReturns = this.returns.length;
    const pendingReview = this.returns.filter(r => r.status === 'pending_review').length;
    const approved = this.returns.filter(r => r.status === 'approved').length;
    const rejected = this.returns.filter(r => r.status === 'rejected').length;
    const completed = this.returns.filter(r => r.status === 'completed').length;

    const totalRefundAmount = this.returns
      .filter(r => r.status === 'completed')
      .reduce((sum, ret) => sum + ret.refundAmount, 0);

    return {
      totalReturns,
      pendingReview,
      approved,
      rejected,
      completed,
      totalRefundAmount
    };
  }
}

export const returnService = new ReturnService();
