import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const TITLES = /^(mr|mrs|ms|miss|dr)\.?$/i;

/** "Mrs. Dennis Schulist" -> "DS" */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word && !TITLES.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

/** Spreads hues around the color wheel so neighbouring ids look different. */
function hueFor(id: number) {
  return (id * 67) % 360;
}

export function UserAvatar({
  id,
  name,
  className,
  size,
}: {
  id: number;
  name: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const hue = hueFor(id);

  return (
    <Avatar size={size} className={className}>
      <AvatarFallback
        className="font-heading text-xs font-semibold text-white"
        style={{
          backgroundImage: `linear-gradient(140deg, oklch(0.78 0.13 ${hue}), oklch(0.55 0.19 ${hue + 40}))`,
        }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-[oklch(0.62_0.2_277)] to-[oklch(0.5_0.22_305)] text-white shadow-sm shadow-primary/30",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none">
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 4v-4h0.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 8.5h6M9 11.5h3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
