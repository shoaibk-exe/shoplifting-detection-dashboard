export interface Alert {
  id: number;
  alert_number: string;
  date: Date;
  time: string;
  alert_link?: string;
  camera_num: number;
  createdAt?: Date;
  updatedAt?: Date;
}