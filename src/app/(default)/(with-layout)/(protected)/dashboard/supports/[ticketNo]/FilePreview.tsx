/** @format */

import ImageLoader from "@/components/ui/ImageLoader";
import { isImage } from "@/utils/helper";
import React from "react";

const FilePreview = ({ item, index }: { item: string; index: number }) => {
  return isImage(item) ? (
    <a
      key={index}
      href={item}
      target="_blank"
      rel="noopener noreferrer"
      className="border-primary/10 block overflow-hidden rounded-md border shadow-sm transition hover:shadow-md"
    >
      <ImageLoader
        src={item}
        alt={`attachment-${index}`}
        width={100}
        height={100}
        className="size-24 object-cover"
      />
    </a>
  ) : (
    <a
      key={index}
      href={item}
      target="_blank"
      rel="noopener noreferrer"
      className="border-primary/10 flex w-full max-w-md items-center gap-3 rounded-md border bg-slate-50 p-3 transition hover:bg-slate-100"
    >
      <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-sm font-semibold uppercase">
        {item.split(".").pop()?.slice(0, 3)}
      </div>
      <p className="truncate text-sm text-slate-700">{item.split("/").pop()}</p>
    </a>
  );
};

export default FilePreview;
