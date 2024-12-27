export interface LiveRoomData {
    LiveRoom: {
        liveRoomUserInfo?: {
            user?: {
                roomId?: number;
            };
        };
    };
}

export interface CheckAliveResponse {
    data: Array<{ alive: boolean }>;
}

export interface StreamURLResponse {
    data: {
        stream_url: {
            flv_pull_url: Record<string, string>;
        };
    },
    status_code: number;
}