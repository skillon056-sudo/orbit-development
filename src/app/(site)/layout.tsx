import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SceneCanvas from "@/components/three/SceneCanvas";

// Public site shell (admin has its own layout, no navbar/footer/3D).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      {/* Fixed 3D journey behind all content; self-disables on mobile / reduced-motion */}
      <SceneCanvas />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
