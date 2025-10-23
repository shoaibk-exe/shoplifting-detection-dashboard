export interface Camera {
  id: number;
  cameraModel: string;
  cameraIp: string;
  cameraUsername: string;
  cameraPassword: string;
  cameraLocation: string;
  cameraStatus: string;
  autoFlash?: boolean;
  cameraVoice?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}