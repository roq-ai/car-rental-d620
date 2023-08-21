import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceInterface {
  id?: string;
  vehicle_id: string;
  average_speed: number;
  total_distance: number;
  total_time: number;
  total_reservations: number;
  usage_frequency: number;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  _count?: {};
}

export interface PerformanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
}
