"use client";
import topPlayerIllus1 from "@/../public/illustration/top-player-illus-1.png";
import topPlayerIllus2 from "@/../public/illustration/top-player-illus-2.png";
import topPlayerIllus3 from "@/../public/illustration/top-player-illus-3.png";
import ImageLoader from "@/components/ui/ImageLoader";
import Image from "next/image";

interface Player {
  avatar: string;
  first_name: string;
  last_name: string;
  quizzes_count: number;
  quizzes_avg_score?: number;
  score: number;
}

interface PlayerCardProps {
  item: Player;
  index: number;
  tran: (key: string) => string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ item, index, tran }) => {
  return (
    <div
      key={index}
      className="relative col-span-12 overflow-hidden rounded-lg min-[500px]:col-span-6 lg:col-span-3"
    >
      {/* Background blur circles */}
      <div className="absolute bottom-0 left-0 size-[92px] rounded-full bg-[#00D94A] blur-[119px]"></div>
      <div className="absolute right-0 bottom-0 size-[92px] rounded-full bg-[#008EFB] blur-[119px]"></div>

      {/* Top section with illustrations */}
      <div className="bg-primary/50 relative h-[104px]">
        <ImageLoader
          src={topPlayerIllus1}
          alt=""
          className="absolute top-0 right-20"
          width={100}
          height={100}
        />
        <Image
          src={topPlayerIllus2}
          alt=""
          className="absolute bottom-0 left-0"
        />
        <Image
          src={topPlayerIllus3}
          alt=""
          className="absolute right-0 bottom-0"
        />

        {/* Badge background */}
        <div className="absolute top-0 left-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="51"
            viewBox="0 0 40 51"
            fill="none"
          >
            <path
              d="M0 0H40V36.649C40 38.8293 38.8173 40.838 36.9107 41.8957L23.3393 49.4248C21.5678 50.4076 19.42 50.4301 17.6283 49.4846L3.1997 41.8704C1.23162 40.8318 0 38.7892 0 36.5639V0Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Ranking number */}
        <div className="bg-primary absolute top-2 left-4 z-10 flex size-8 items-center justify-center rounded-full">
          <div className="flex size-6 items-center justify-center rounded-full bg-white">
            <h6 className="heading-6">{index + 1}</h6>
          </div>
        </div>

        <div className="absolute top-3 right-3"></div>
      </div>

      {/* Player Info */}
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center p-5 text-center">
          {/* Avatar */}
          <div className="bg-primary relative z-10 -mt-18 rounded-full p-0.5">
            <div className="rounded-full bg-white p-0.5">
              <ImageLoader
                src={item?.avatar}
                alt=""
                className="size-[100px] rounded-full"
                width={100}
                height={100}
              />
            </div>
          </div>

          {/* Name */}
          <h5 className="heading-5 pt-4">
            {item.first_name + " " + item.last_name}
          </h5>

          {/* Stats */}
          <div className="flex items-center justify-start gap-4 pt-1 text-slate-500">
            <p>
              {item?.quizzes_count} {tran("Quizzes")}
            </p>
            <p>
              {Number(item?.quizzes_avg_score ?? 0).toFixed(2)}% {tran("Avg")}
            </p>
          </div>

          {/* Score */}
          <div className="pt-6">
            <span className="bg-secondary group-hover:bg-primary m-1 block rounded-full px-5 py-1 font-medium text-white duration-300">
              {item.score} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
