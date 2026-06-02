import Craftsman from "../Components/Craftsman";

const HERO_BG = "#181f2a";

function Hero() {
  return (
    <section className="relative isolate min-h-svh w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: HERO_BG }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-bottom bg-no-repeat"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-svh w-full flex-col items-center justify-center px-7 pt-[3em] pb-10 select-none">
        <h3>
          I am{" "}
          <span className="font-emerland text-3xl text-yellow-200">
            Johny Joji
          </span>{" "}
          a{" "}
        </h3>
        <h1 className="m-0 -mt-9 w-full max-w-[min(96vw,72rem)] p-0">
          <Craftsman
            text="Digital Craftsman"
            subtitle="Computer Science Engineer"
            className="aspect-4/1 w-full"
          />
        </h1>
      </div>
    </section>
  );
}

export default Hero;
