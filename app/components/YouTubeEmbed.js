'use client';

const YouTubeEmbed = ({ videoUrl }) => {
  return (
    <iframe
      src={videoUrl}
      title="Feel Mitra Introduction"
      className="absolute inset-0 w-full h-full"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YouTubeEmbed; 