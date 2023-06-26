import { useEffect, useState } from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const SideInfo = (props) => {
  const { videoInfo } = props;
  const [plot, setPlot] = useState("");
  const [vidInfo, setVidInfo] = useState(videoInfo ? videoInfo : null);

  useEffect(() => {
    if (vidInfo && vidInfo.video_info) {
      const fullStars = Math.floor(vidInfo.video_info.averageRating / 2);
      const halfStars = Math.ceil(vidInfo.video_info.averageRating % 2);

      fetch(`https://localhost:3005/plot?movieName=${vidInfo.video_info.primaryTitle}`)
        .then((response) => response.text())
        .then((data) => setPlot(data));
    }
  }, [vidInfo]);

  return (
    <div className="fixed h-full w-1/3 sm:w-72 right-0 top-0 bg-slate-800 shadow-lg p-4 z-10 overflow-auto text-white space-y-2">
      {vidInfo && vidInfo.video_info && (
        <>
          <h2 className="text-2xl font-bold">{vidInfo.video_info.primaryTitle}</h2>
          <p>{vidInfo.video_info.year}</p>
          <div className="flex items-center">
            {[...Array(Math.floor(vidInfo.video_info.averageRating / 2))].map((_, i) => (
              <BsStarFill key={i} className="text-yellow-500" />
            ))}
            {[...Array(Math.ceil(vidInfo.video_info.averageRating % 2))].map((_, i) => (
              <BsStarHalf key={i} className="text-yellow-500" />
            ))}
            {[
              ...Array(
                5 - Math.floor(vidInfo.video_info.averageRating / 2) - Math.ceil(vidInfo.video_info.averageRating % 2)
              ),
            ].map((_, i) => (
              <BsStar key={i} className="text-yellow-500" />
            ))}
          </div>
          <p>{vidInfo.video_info.numVotes} votes</p>
        </>
      )}
      <p>{plot}</p>
    </div>
  );
};

export default SideInfo;
