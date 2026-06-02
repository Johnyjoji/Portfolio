import Storyani from "../Components/storyani";

const STORY_LINES = [
  "Every project starts the same.",
  "",
  "A blank screen,",
  "An idea,",
  "A problem, worth solving.",
  "",
  "Then comes the work.",
  "",
  "The mistakes,",
  "The late nights,",
  "The countless revisions.",
  "",
  "Until Complexity becomes Simplicity.",
  "",
  "That's the part I enjoy most.",
];

function Story() {
  return (
    <>
      <Storyani
        lines={STORY_LINES}
        className="w-full font-quicklime text-4xl text-white "
      />
      <div className="flex w-full h-fit justify-center">
        <h1 className="text-white text-6xl font-signature">johnyjoji</h1>
      </div>
    </>
    
  );
}

export default Story;
