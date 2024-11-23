/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseQueryParams(searchParams: URLSearchParams) {
  const pageIndex = parseInt(searchParams.get("pagination[pageIndex]") || "1");
  const pageSize = parseInt(searchParams.get("pagination[pageSize]") || "10");

  const sortBy = searchParams.get("sorting[sortBy]") || undefined;
  const sortDesc = searchParams.get("sorting[sortDesc]") === "true";
  const orderBy = sortBy ? { [sortBy]: sortDesc ? "desc" : "asc" } : undefined;

  const filters: Record<string, any> = {};
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("filter[")) {
      const filterKey = key.slice(7, -1);
      filters[filterKey] = value;
    }
  }

  return {
    pagination: {
      pageIndex,
      pageSize,
    },
    sorting: {
      sortBy,
      sortDesc,
      orderBy,
    },
    filters,
  };
}
