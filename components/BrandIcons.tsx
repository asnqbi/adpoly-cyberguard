import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { size?: number };
export function Github({ size = 20, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4 1-4-2-5-2m10 5v-4c0-1 .1-1.5-.5-2 3-.4 6-1.5 6-6a5 5 0 0 0-1.4-3.5c.1-.4.6-2-.1-3.5 0 0-1.1-.4-3.6 1.3a12 12 0 0 0-6.8 0C5.1 2.6 4 3 4 3c-.7 1.5-.2 3.1-.1 3.5A5 5 0 0 0 2.5 10c0 4.5 3 5.6 6 6-.4.4-.6 1-.5 2v4" />
    </svg>
  );
}
export function Linkedin({ size = 20, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 10v7m4-7v7m0-4a3 3 0 0 1 6 0v4" />
      <circle cx="7" cy="7" r=".5" fill="currentColor" />
    </svg>
  );
}
