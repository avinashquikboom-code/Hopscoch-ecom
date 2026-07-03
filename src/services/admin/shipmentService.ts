import { Shipment, ShipmentFilters, ShipmentStatus, CourierPartner } from '@/types/admin';
import { mockShipments, mockCourierPartners } from './mockData';

class ShipmentService {
  private shipments: Shipment[] = [...mockShipments];
  private courierPartners: CourierPartner[] = [...mockCourierPartners];

  getAllShipments(filters?: ShipmentFilters): Shipment[] {
    let filteredShipments = [...this.shipments];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredShipments = filteredShipments.filter(shipment => 
          filters.status!.includes(shipment.status)
        );
      }

      if (filters.courierPartner && filters.courierPartner.length > 0) {
        filteredShipments = filteredShipments.filter(shipment => 
          filters.courierPartner!.includes(shipment.courierPartner)
        );
      }

      if (filters.dateRange) {
        filteredShipments = filteredShipments.filter(shipment => 
          shipment.createdAt >= filters.dateRange!.from && 
          shipment.createdAt <= filters.dateRange!.to
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredShipments = filteredShipments.filter(shipment =>
          shipment.id.toLowerCase().includes(searchLower) ||
          shipment.orderId.toLowerCase().includes(searchLower) ||
          shipment.trackingNumber.toLowerCase().includes(searchLower) ||
          shipment.awbNumber.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredShipments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getShipmentById(shipmentId: string): Shipment | null {
    return this.shipments.find(shipment => shipment.id === shipmentId) || null;
  }

  getShipmentsByStatus(status: ShipmentStatus): Shipment[] {
    return this.shipments.filter(shipment => shipment.status === status);
  }

  getShipmentsByCourier(courierPartner: string): Shipment[] {
    return this.shipments.filter(shipment => shipment.courierPartner === courierPartner);
  }

  updateShipmentStatus(shipmentId: string, status: ShipmentStatus, location: string, remarks?: string): Shipment {
    const shipmentIndex = this.shipments.findIndex(shipment => shipment.id === shipmentId);
    if (shipmentIndex === -1) {
      throw new Error('Shipment not found');
    }

    const shipment = this.shipments[shipmentIndex];
    shipment.status = status;
    shipment.currentLocation = location;
    shipment.updatedAt = new Date();

    if (status === 'delivered') {
      shipment.actualDelivery = new Date();
    }

    const timelineItem = {
      id: `STL-${Date.now()}`,
      status,
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location,
      remarks
    };

    shipment.timeline.push(timelineItem);
    this.shipments[shipmentIndex] = shipment;

    return shipment;
  }

  getAllCourierPartners(): CourierPartner[] {
    return this.courierPartners.filter(partner => partner.isActive);
  }

  getCourierPartnerById(partnerId: string): CourierPartner | null {
    return this.courierPartners.find(partner => partner.id === partnerId) || null;
  }

  getShipmentStats() {
    const totalShipments = this.shipments.length;
    const packed = this.shipments.filter(s => s.status === 'packed').length;
    const readyToShip = this.shipments.filter(s => s.status === 'ready_to_ship').length;
    const pickedUp = this.shipments.filter(s => s.status === 'picked_up').length;
    const shipped = this.shipments.filter(s => s.status === 'shipped').length;
    const inTransit = this.shipments.filter(s => s.status === 'transit').length;
    const outForDelivery = this.shipments.filter(s => s.status === 'out_for_delivery').length;
    const delivered = this.shipments.filter(s => s.status === 'delivered').length;

    const courierBreakdown = this.shipments.reduce((acc, shipment) => {
      acc[shipment.courierPartner] = (acc[shipment.courierPartner] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalShipments,
      packed,
      readyToShip,
      pickedUp,
      shipped,
      inTransit,
      outForDelivery,
      delivered,
      courierBreakdown
    };
  }
}

export const shipmentService = new ShipmentService();
