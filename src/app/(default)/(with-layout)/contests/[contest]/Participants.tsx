/** @format */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTimeTaken } from "@/hooks/useTimeTaken";
import { useTranslations } from "@/providers/TranslationProviders";
import {
  ContestType,
  ParticipantPaginationType,
  ParticipantType,
} from "@/types/contest";
import dynamic from "next/dynamic";
import React from "react";

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

const ImageLoader = dynamic(() => import("@/components/ui/ImageLoader"), {
  ssr: false,
});

type Params = {
  contest: ContestType;
};
const Participants: React.FC<Params> = ({
  contest: {
    translation: { slug },
  },
}) => {
  const { tran } = useTranslations();
  const { data: participants, isLoading } =
    useGetQuery<ParticipantPaginationType>({
      url: `/contest-participants/${slug} `,
    });
  return (
    <div className="pt-8">
      <div className="">
        <h5 className="heading-5">{tran("Participants")}</h5>
        <Table className="mt-6 overflow-hidden rounded-xl font-medium">
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead>{tran("Rank")}</TableHead>
              <TableHead>{tran("Player")}</TableHead>
              <TableHead>{tran("Score")}</TableHead>
              <TableHead>{tran("Time")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <Loader />
            ) : (
              <ParticipantTable participants={participants?.data} />
            )}
          </TableBody>
        </Table>
        {participants?.data?.length ? null : (
          <DataNotFound
            title="No Participants Found"
            message="The participants you are looking for does not exist."
            imageSize="sm"
          />
        )}
      </div>
    </div>
  );
};

export default Participants;

export const ParticipantTable = ({
  participants,
}: {
  participants: ParticipantType[] | undefined;
}) => {
  const { tran } = useTranslations();
  const timeTaken = useTimeTaken();
  return participants?.map((item) => (
    <TableRow key={item.id}>
      <TableCell>1</TableCell>
      <TableCell className="flex items-center justify-start gap-2">
        <ImageLoader
          src={item?.user?.avatar}
          alt=""
          width={24}
          height={24}
          className="size-6 rounded-full"
        />{" "}
        {item?.user?.full_name}
      </TableCell>
      <TableCell>{item?.score}</TableCell>
      <TableCell>
        {timeTaken(item?.time_taken || 0)} {tran("min")}
      </TableCell>
    </TableRow>
  ));
};
