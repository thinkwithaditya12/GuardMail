"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";

const MESSAGES: string[] = [
  "WELCOME TO GUARD MAIL",
  "AI-POWERED EMAIL THREAT DETECTION",
  "DETECT THE SIGNAL",
  "EXPLAIN THE UNCERTAINTY",
  "YOUR EMAIL. OUR FORENSICS.",
];

export default function TextFlippingBoardDemo() {
  const [msgIdx, setMsgIdx] = useState(0);

  const next = useCallback(
    () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <TextFlippingBoard
      text={MESSAGES[msgIdx]}
      duration={1.35}
      className="w-full max-w-5xl"
    />
  );
}
