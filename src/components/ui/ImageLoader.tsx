/** @format */

"use client";
import placeholderImage from "@/../public/placeholder-image.png";
import { cn } from "@/utils/cn";
import Image, { StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";

interface Props {
  src?: string | StaticImageData | null;
  alt?: string | null;
  width?: number;
  height?: number;
  is_private?: boolean;
  user?: any;
  className?: string;
  priority?: boolean;
  withSkeleton?: boolean;
}

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  is_private,
  user,
  className,
  priority = false,
  withSkeleton = true,
}: Readonly<Props>) {
  const [fallbackImage, setFallbackImage] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const setImage = useMemo(() => {
    let placeholder: any = placeholderImage;
    if (user?.full_name || user?.name) {
      placeholder = `https://ui-avatars.com/api/?name=${user?.name || user?.full_name}&background=random`;
    }
    if (is_private || fallbackImage) {
      return placeholder;
    } else {
      return src ?? placeholder;
    }
  }, [is_private, fallbackImage, src, user]);

  return (
    <>
      {mounted ? (
        <Image
          alt={alt ?? "image"}
          src={setImage}
          width={width}
          height={height}
          className={cn(className, "object-cover")}
          onError={() => setFallbackImage(true)}
          quality={100}
          priority={priority}
        />
      ) : (
        <Skeleton withSkeleton={withSkeleton} />
      )}
    </>
  );
}

const Skeleton = ({ withSkeleton }: { withSkeleton: boolean }) => {
  return withSkeleton ? (
    <div
      className={"image-skeleton relative"}
      style={{ width: "100%", height: "100%" }}
    />
  ) : null;
};
