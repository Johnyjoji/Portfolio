import Craftsman from "../Components/Craftsman";

function Hero() {
  return (
    <>
      <div
        className="flex h-screen w-full flex-col items-center justify-center select-none" id=""
      >
        <h3>
          I am{" "}
          <span className="font-emerland text-3xl text-yellow-200">
            Johny Joji
          </span>{" "}
          a{" "}
        </h3>
        <h1 className="m-0 -mt-9 w-full max-w-[96vw] p-0">
          <Craftsman
            text="Digital Craftsman"
            subtitle="Computer Science Engineer"
            className="aspect-4/1 w-full"
          />
        </h1>
      </div>
    </>
  );
}

export default Hero