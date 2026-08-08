import Hero from "./pages/Hero";
import Navbar from "./Components/Navbar";
import Story from "./pages/Story";
import Philosophy from "./pages/Philosophy";
import Projects from "./Components/Projects";

function App() {
  return (
    <div className="w-full min-h-full bg-[#181f2a] text-white">
      <Navbar />
      <Hero />
      <div className="px-7">
        <Story />
        <Philosophy />
        <Projects />
      </div>
    </div>
  );
}

export default App;
