import { PaymentTransaction, PaymentFilters, PaymentStatus, PaymentMethod } from '@/types/admin';
import { mockPaymentTransactions } from './mockData';

class PaymentService {
  private transactions: PaymentTransaction[] = [...mockPaymentTransactions];

  getAllTransactions(filters?: PaymentFilters): PaymentTransaction[] {
    let filteredTransactions = [...this.transactions];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredTransactions = filteredTransactions.filter(txn => 
          filters.status!.includes(txn.status)
        );
      }

      if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        filteredTransactions = filteredTransactions.filter(txn => 
          filters.paymentMethod!.includes(txn.paymentMethod)
        );
      }

      if (filters.dateRange) {
        filteredTransactions = filteredTransactions.filter(txn => 
          txn.date >= filters.dateRange!.from && 
          txn.date <= filters.dateRange!.to
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTransactions = filteredTransactions.filter(txn =>
          txn.id.toLowerCase().includes(searchLower) ||
          txn.orderId.toLowerCase().includes(searchLower) ||
          txn.gatewayTransactionId.toLowerCase().includes(searchLower) ||
          txn.customerName.toLowerCase().includes(searchLower) ||
          txn.customerEmail.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getTransactionById(transactionId: string): PaymentTransaction | null {
    return this.transactions.find(txn => txn.id === transactionId) || null;
  }

  getTransactionsByStatus(status: PaymentStatus): PaymentTransaction[] {
    return this.transactions.filter(txn => txn.status === status);
  }

  getTransactionsByMethod(method: PaymentMethod): PaymentTransaction[] {
    return this.transactions.filter(txn => txn.paymentMethod === method);
  }

  getPaymentStats() {
    const totalTransactions = this.transactions.length;
    const successful = this.transactions.filter(t => t.status === 'successful').length;
    const failed = this.transactions.filter(t => t.status === 'failed').length;
    const pending = this.transactions.filter(t => t.status === 'pending').length;
    const refundInitiated = this.transactions.filter(t => t.status === 'refund_initiated').length;
    const refundCompleted = this.transactions.filter(t => t.status === 'refund_completed').length;

    const totalAmount = this.transactions
      .filter(t => t.status === 'successful')
      .reduce((sum, txn) => sum + txn.total, 0);

    const totalRefunded = this.transactions
      .filter(t => t.status === 'refund_completed')
      .reduce((sum, txn) => sum + txn.total, 0);

    const netRevenue = totalAmount - totalRefunded;

    const methodBreakdown = this.transactions.reduce((acc, txn) => {
      acc[txn.paymentMethod] = (acc[txn.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<PaymentMethod, number>);

    return {
      totalTransactions,
      successful,
      failed,
      pending,
      refundInitiated,
      refundCompleted,
      totalAmount,
      totalRefunded,
      netRevenue,
      methodBreakdown
    };
  }

  getDailyStats(days: number = 30) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTransactions = this.transactions.filter(
        txn => txn.date >= date && txn.date < nextDate
      );

      const successfulAmount = dayTransactions
        .filter(t => t.status === 'successful')
        .reduce((sum, t) => sum + t.total, 0);

      const refundedAmount = dayTransactions
        .filter(t => t.status === 'refund_completed')
        .reduce((sum, t) => sum + t.total, 0);

      stats.push({
        date: date.toISOString().split('T')[0],
        transactions: dayTransactions.length,
        successfulAmount,
        refundedAmount,
        netAmount: successfulAmount - refundedAmount
      });
    }

    return stats;
  }
}

export const paymentService = new PaymentService();
