import React from "react";

interface CameraVideoProps {
    title?: string;
    embeds?: boolean;
    aspectOne?: boolean;
    aspectFour?: boolean;
    aspectTwentyOne?: boolean;
    src?: string;
}

const CameraVideo: React.FC<CameraVideoProps> = ({
    title,
    embeds,
    aspectOne,
    aspectFour,
    aspectTwentyOne,
    src,
}) => {
    return (
        <iframe
            className={`w-full 
            ${embeds && "aspect-video"} 
            ${aspectOne && "aspect-square"} 
            ${aspectFour && "aspect-4/3"} 
            ${aspectTwentyOne && "aspect-21/9"}
        `}

            src={src || "https://www.youtube.com/embed/yeL6N7DHbdE?rel=0"}
            allowFullScreen
        ></iframe>
    );
};

export default CameraVideo;
