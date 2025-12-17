export interface Cameras {
    id?: string;
    cameraModel: string;
    actions?: any;
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
