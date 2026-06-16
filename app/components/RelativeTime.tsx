"use client";

import { useEffect, useMemo, useState } from "react";

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSeconds < 45) {
    return "just now";
  }

  const minutes = Math.floor(diffSeconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

type RelativeTimeProps = {
  value: string;
  prefix?: string;
};

export function RelativeTime({ value, prefix }: RelativeTimeProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((tick) => tick + 1), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const label = useMemo(() => formatRelativeTime(value), [value]);

  return (
    <time dateTime={value} title={new Date(value).toLocaleString()}>
      {prefix}
      {label}
    </time>
  );
}
