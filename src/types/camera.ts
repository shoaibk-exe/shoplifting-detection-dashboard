export interface Camera {
<<<<<<< HEAD
    id?: string;
    cameraModel: string;
    cameraIp: string;
    cameraUsername: string;
    cameraPassword: string;
    cameraLocation: string;
    cameraStatus: string;
    autoFlash?: boolean;
    cameraVoice?: boolean;
    rtspUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    videoRecording?: string[];
    anomaly_logs?: string[];
}
=======
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
>>>>>>> 66cf8efdd7294a591b61b74bd1e5631b29b8139a
