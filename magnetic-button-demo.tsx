import React from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <MagneticButton>
      <button className="cursor-pointer rounded-lg bg-cyan-300 px-5 py-2.5 font-medium text-[#06101a]">Analyze email</button>
    </MagneticButton>
  );
}
