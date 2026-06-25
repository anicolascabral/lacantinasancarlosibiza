import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Oven from "@/components/Oven";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Events from "@/components/Events";
import Reservation from "@/components/Reservation";
import Footer from "@/components/Footer";
import ImageFocus from "@/components/ImageFocus";
import MobileReserveBar from "@/components/MobileReserveBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Oven />
        <Menu />
        <Gallery />
        <Events />
        <Reservation />
      </main>
      <Footer />
      <MobileReserveBar />
      <ImageFocus />
    </>
  );
}
