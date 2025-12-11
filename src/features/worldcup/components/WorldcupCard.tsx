'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { IWorldcupSummary } from '../types';

interface WorldcupCardProps {
  worldcup: IWorldcupSummary;
}

export function WorldcupCard({ worldcup }: WorldcupCardProps) {
  const { slug, title, description, roundCount, thumbnailImage } = worldcup;

  return (
    <Link href={`/worldcup/${slug}?autostart=true`} className="group block">
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all group-hover:border-cozy-primary group-hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">
              🏆
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-cozy-primary">
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-cozy-primary/10 px-3 py-1 text-xs font-medium text-cozy-primary">
              {roundCount}강
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
