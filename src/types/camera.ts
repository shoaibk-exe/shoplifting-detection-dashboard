export interface Camera {
  id?: string;
  cameraModel: string;
  cameraIp: string;
  cameraUsername: string;
  cameraPassword: string;
  cameraLocation: string;
  cameraStatus: string;
  autoFlash?: boolean;
  cameraVoice?: boolean;
  createdAt?: string;
  updatedAt?: string;
  videoRecording?: string[];
  anomaly_logs?: string[];
}
