import { useCallback, useEffect, useState } from "react";
import "./hero.css";
import "./heroSlideshow.css";

const slides = [
  {
    src: "/imgs/treatment.jpeg",
    alt: "Nadine arbetar med medicinsk fotvård i en lugn och välkomnande miljö",
  },
  {
    src: "/imgs/vantrum.jpeg",
    alt: "Väntrummet hos Fotspecialisten",
  },
  {
    src: "/imgs/strumpor.jpeg",
    alt: "Strumpor hos Fotspecialisten",
  },
  {
    src: "/imgs/blomdahls.jpeg",
    alt: "Blomdahls system för öronhåltagning",
  },
    {
    src: "/imgs/huset.jpeg",
    alt: "Huset på Fjällvägen 4 i Sveg där Fotspecialisten finns",
  },
];

const AUTOPLAY_MS = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((i) => (i + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (paused || reduceMotion) return;

    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, current, next]);

  return (
    <section className="hero" id="home">
      <div className="heroContent">
        <span className="heroEyebrow">MEDICINSK FOTVÅRD · SVEG</span>
      {/* <div className="heroDecoration">
          <img
            src="/imgs/nadine1.jpeg"
            alt="Nadine, specialist i medicinsk fotvård"
          />
        </div> */}
        <h1>
          Ge dina fötter
          <br />
          <span>omsorgen</span> de förtjänar.
        </h1>

        <p className="heroDescription">
          Professionell fotvård med omtanke, kunskap och ett personligt
          bemötande. För fötter som förtjänar lite extra omsorg.
        </p>

        <div className="heroActions">
          <a href="tel:+4668010733" className="heroPrimaryButton">
            Ring och boka
            <span>↗</span>
          </a>

          <a href="#treatments" className="heroSecondaryButton">
            Upptäck behandlingar
            <span>→</span>
          </a>
        </div>

        <div className="heroNote">
          <span className="heroNoteLine"></span>
          <span>Personlig fotvård med omtanke</span>
        </div>
      </div>

      <div className="heroVisual">
        <div
          className="heroImage"
          role="group"
          aria-roledescription="bildspel"
          aria-label="Bilder från Fotspecialisten"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`heroSlide${i === current ? " isActive" : ""}`}
              aria-hidden={i !== current}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}

          <div className="heroSlideControls">
            <button type="button" onClick={prev} aria-label="Föregående bild">
              ←
            </button>
            <button type="button" onClick={next} aria-label="Nästa bild">
              →
            </button>
          </div>
        </div>

        <div className="heroImageLabel">
          <span>
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <span>FOTVÅRD MED OMTANKE</span>
        </div>

      </div>
    </section>
  );
}