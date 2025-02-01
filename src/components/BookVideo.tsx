interface BookVideoProps {
    videoUrl: string;
}

export default function BookVideo({ videoUrl }: BookVideoProps) {
    return (
        <div className="w-full">
            <video src={videoUrl} controls></video>
        </div>
    );
}
