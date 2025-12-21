"use client"

import { usePassageStore } from "@/stores/passageStore";

export default function Home() {

  const text = usePassageStore((state) => state.passage)

  return (
    <div>{text}</div>
  );
}
