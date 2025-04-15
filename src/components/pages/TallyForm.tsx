import { useEffect } from "react";

const TallyForm = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.onload = () => {
      // @ts-ignore
      if (window.Tally) window.Tally.loadEmbeds();
    };
    document.body.appendChild(script);
  }, []);

  return (
      

    <div className="min-h-screen bg-white flex items-center justify-center p-4">


      <iframe
        data-tally-src="https://tally.so/embed/m6Vr8B?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="902"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Tripuva"
        className="w-full max-w-4xl"
      />
    </div>
  );
};

export default TallyForm;
