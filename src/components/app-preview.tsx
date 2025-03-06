import Preview from "@/public/images/mock-interview.png";
import Image from "next/image";
import { HeroSection } from "./hero";
import { ContainerScroll } from "./ui/control-scroll-animation";

export function AppPreview() {
  return (
    <ContainerScroll titleComponent={<HeroSection />}>
      <Image
        src={Preview}
        alt="hero"
        height={720}
        width={1400}
        className="mx-auto rounded-2xl object-cover h-full object-left-top"
        draggable={false}
      />
    </ContainerScroll>
  );
}
