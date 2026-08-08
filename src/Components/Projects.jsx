import { cn } from "../lib/utils";

const DEFAULT_PROJECTS = [
  {
    number: "01",
    title: "Aether Design System",
    description: "A minimalist, token-driven UI framework designed for high-performance creative agency websites and interactive portfolios.",
    tags: ["React", "Tailwind CSS", "Vite", "Framer Motion"],
    images: [
      {
        src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        alt: "Aether wireframes and grid layout",
      },
      {
        src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
        alt: "Aether UI dashboard interface",
      },
    ],
  },
  {
    number: "02",
    title: "Chronos Virtual Gallery",
    description: "An immersive 3D online museum featuring responsive custom shaders, fluid simulations, and dynamic audio synchronization.",
    tags: ["Three.js", "WebGL", "GLSL Shaders", "GSAP"],
    images: [
      {
        src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
        alt: "Chronos 3D abstract sculpture",
      },
      {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        alt: "Chronos fluid simulation waves",
      },
    ],
  },
  {
    number: "03",
    title: "Komorebi Minimal Store",
    description: "A headless, lightning-fast shopping platform optimized for boutique organic brands, featuring a seamless custom checkout flow.",
    tags: ["Next.js", "GraphQL", "Stripe API", "Node.js"],
    images: [
      {
        src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
        alt: "Komorebi store interior aesthetic",
      },
      {
        src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80",
        alt: "Komorebi minimalist apparel line",
      },
    ],
  },
];

function ProjectItem({ number, title, description, tags, images }) {
  // Absolute hover stacked preview images container
  const container = "absolute right-12 top-1/2 -translate-y-1/2 z-40 h-56 w-40 lg:h-64 lg:w-48 pointer-events-none hidden md:block";
  const effect =
    "relative duration-500 ease-out shadow-2xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 w-full h-full overflow-hidden transition-all rounded-2xl border border-white/10";

  return (
    <div className="group relative border-b border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer select-none">
      {/* Text & Tags Content */}
      <div className="flex items-start gap-6 z-10 w-full md:max-w-[60%]">
        <span className="text-white/30 font-quicklime text-lg mt-1 md:mt-2">
          {number}
        </span>
        <div className="flex flex-col">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-racleys text-white transition-all duration-300 group-hover:text-yellow-200 group-hover:translate-x-2">
            {title}
          </h2>
          <p className="text-white/60 font-quicklime text-lg md:text-xl mt-3 max-w-xl transition-all duration-300 group-hover:text-white/80 group-hover:translate-x-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4 transition-all duration-300 group-hover:translate-x-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-quicklime bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/50 group-hover:text-white/80 group-hover:border-white/20 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Image Preview (shown below text on mobile screens) */}
      <div className="block md:hidden w-full h-56 rounded-2xl overflow-hidden border border-white/10 mt-2">
        <img
          alt={images[0].alt}
          src={images[0].src}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Desktop Image Hover Reveal - Stacked & Tilted cards */}
      <div className={container}>
        {/* Back Card */}
        <div
          className={cn(
            effect,
            "absolute inset-0 origin-center -rotate-6 transition-all duration-500 group-hover:-translate-x-6 group-hover:-translate-y-4 group-hover:-rotate-12",
          )}
        >
          <img
            alt={images[1].alt}
            src={images[1].src}
            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        {/* Front Card */}
        <div
          className={cn(
            effect,
            "absolute inset-0 origin-center rotate-6 transition-all duration-500 delay-75 group-hover:translate-x-6 group-hover:translate-y-4 group-hover:rotate-12",
          )}
        >
          <img
            alt={images[0].alt}
            src={images[0].src}
            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="w-full mt-24 py-16 scroll-mt-18" id="work">
      {/* Header section to match the general theme */}
      <div className="mb-12">
        <h3 className="text-white/50 text-2xl font-racleys uppercase tracking-wider">Selected</h3>
        <h1 className="text-white text-5xl md:text-6xl font-racleys mt-1">Creative Works</h1>
      </div>

      {/* Project list container */}
      <div className="flex flex-col border-t border-white/10">
        {DEFAULT_PROJECTS.map((project, index) => (
          <ProjectItem
            key={index}
            number={project.number}
            title={project.title}
            description={project.description}
            tags={project.tags}
            images={project.images}
          />
        ))}
      </div>
    </section>
  );
}
