"use client";

import Link from "next/link";

interface BackButtonProps {
  to: string;
}

export function BackButton({ to }: BackButtonProps) {
  return (
    <Link
      href={to}
      className="flex items-center justify-center w-[41px] h-[41px] bg-white border border-[#e8ecf4] rounded-[12px] hover:bg-gray-50 transition-colors"
      aria-label="Go back"
    >
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
        <path
          d="M13.1575 2.36709C13.0656 2.27493 12.9564 2.20181 12.8362 2.15193C12.7159 2.10204 12.5871 2.07636 12.4569 2.07636C12.3267 2.07636 12.1978 2.10204 12.0776 2.15193C11.9574 2.20181 11.8482 2.27493 11.7563 2.36709L5.17752 8.94584C5.10413 9.01908 5.0459 9.10607 5.00618 9.20184C4.96645 9.29761 4.946 9.40028 4.946 9.50396C4.946 9.60764 4.96645 9.71031 5.00618 9.80608C5.0459 9.90185 5.10413 9.98885 5.17752 10.0621L11.7563 16.6408C12.1442 17.0288 12.7696 17.0288 13.1575 16.6408C13.5454 16.2529 13.5454 15.6275 13.1575 15.2396L7.42585 9.5L13.1654 3.76042C13.5454 3.38042 13.5454 2.74709 13.1575 2.36709Z"
          fill="#1E232C"
          stroke="#1E232C"
          strokeWidth="0.2"
        />
      </svg>
    </Link>
  );
}
