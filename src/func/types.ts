export type ThumbnailData = {
    position: [number, number, number];  // 位置 (x, y, z)
    rotation: [number, number];          // 角度 (azimuth, polar)
};

export type ExtendedThumbnailData = {
    src: string;
    id: number;
} & ThumbnailData;