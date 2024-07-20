import { getAnimeResponse } from "@/app/libs/api-libs";
import VideoPlayer from "@/app/components/Utilities/Navbar/VideoPlayer";
import Image from "next/image";
import CollectionButton from "@/app/components/AnimeList/CollectionButton";
import { authUserSession } from "@/app/libs/auth-libs";
import prisma from "@/app/libs/prisma";
import CommentInput from "@/app/components/AnimeList/CommentInput";
import CommentBox from "@/app/components/AnimeList/CommentBox";

const Page = async ({ params: { id } }) => {
  const anime = await getAnimeResponse(`anime/${id}`);
  const user = await authUserSession();
  const collection = await prisma.collection.findFirst({
    where: { user_email: user?.email, anime_mal_id: id },
  });

  return (
    <div className="container mx-auto">
      <div className="flex gap-8 items-center px-4 py-8">
        <div className="w-1/3">
          <Image
            src={anime.data.images.webp.image_url}
            alt={anime.data.images.jpg.image_url}
            width={500}
            height={500}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="w-2/3">
          <h1 className="text-3xl font-bold mb-4 text-color-primary">
            {anime.data.title} - {anime.data.year}
          </h1>
          <div className="flex flex-wrap gap-4">
            <div className="w-1/2 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold text-color-primary mb-2 text-center">
                Peringkat
              </h3>
              <p className="text-center text-color-accent">{anime.data.rank}</p>
            </div>
            <div className="w-1/2 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl text-color-primary font-bold mb-2 text-center">
                Skor
              </h3>
              <p className="text-center text-color-accent">
                {anime.data.score}
              </p>
            </div>
            <div className="w-1/2 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl text-color-primary font-bold mb-2 text-center">
                Anggota
              </h3>
              <p className="text-center text-color-accent">
                {anime.data.members}
              </p>
            </div>
            <div className="w-1/2 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl text-color-primary font-bold mb-2 text-center">
                Episode
              </h3>
              <p className="text-center text-color-accent">
                {anime.data.episodes}
              </p>
            </div>
          </div>
          {!collection && user && (
            <CollectionButton
              anime_mal_id={id}
              user_email={user?.email}
              anime_image={anime.data.images.webp.image_url}
              anime_title={anime.data.title}
            />
          )}
        </div>
      </div>
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-color-accent">Sinopsis</h2>
        <p className="text-justify text-color-primary">{anime.data.synopsis}</p>
      </div>
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-color-primary">
          Komentar Penonton
        </h2>
        <CommentBox anime_mal_id={id} />
        {user && (
          <CommentInput
            anime_mal_id={id}
            user_email={user?.email}
            username={user?.name}
            anime_title={anime.data.title}
          />
        )}
      </div>
      <div className="px-4 py-8">
        <VideoPlayer youtubeId={anime.data.trailer.youtube_id} />
      </div>
    </div>
  );
};

export default Page;
