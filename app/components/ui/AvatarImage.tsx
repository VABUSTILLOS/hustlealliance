import Image from 'next/image';

export function AvatarImage({
  src,
  alt,
  size = 40,
  className = '',
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full border border-white/10 object-cover shrink-0 ${className}`}
      sizes={`${size}px`}
    />
  );
}
