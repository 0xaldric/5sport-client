import { HeroSection } from "@/components/home/hero-section";
import { TournamentsSection } from "@/components/home/tournaments-section";
import { WhyJoinSection } from "@/components/home/why-join-section";
import { TopAthletesSection } from "@/components/home/top-athletes-section";
import { GroupsSection } from "@/components/home/groups-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TournamentsSection />
      <WhyJoinSection />
      <TopAthletesSection />
      <GroupsSection />
    </>
  );
}
