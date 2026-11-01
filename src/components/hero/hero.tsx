
import { useCallback, useEffect, useState } from "react";
import "./hero.css";
import "./heroSlideshow.css";
import { supabase } from "../../lib/supabase";

interface HeroContent {
  note: string;
  title: string;
  slides: {
    src: string;
    alt: string;
  }[];
  eyebrow: string;
  description: string;
  titleAccent: string;
  titleEnding: string;
  primaryButton: string;
  secondaryButton: string;
}

const AUTOPLAY_MS = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [content, setContent] = useState<HeroContent | null>(null);
  const slides = content?.slides ?? [];

  useEffect(() => {
    async function fetchHeroContent() {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "hero")
        .single();

      if (error) {
        console.error("Kunde inte hämta Hero:", error);
        return;
      }

      setContent(data.content);
    }

    fetchHeroContent();
  }, []);

  const next = useCallback(() => {
    if (slides.length === 0) return;

    setCurrent((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;

    setCurrent((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (paused || reduceMotion || slides.length <= 1) return;

    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, current, next, slides.length]);

  return (
    <section className="hero" id="home">
      {content && (
        <>
          <div className="heroContent">
            <span className="heroEyebrow">{content.eyebrow}</span>

            <h1>
              {content.title} <span>{content.titleAccent}</span>
              {content.titleEnding}
            </h1>

            <p className="heroDescription">{content.description}</p>

            <div className="heroActions">
              <a href="tel:+4668010733" className="heroPrimaryButton">
                {content.primaryButton}
                <span>↗</span>
              </a>

              <a href="#treatments" className="heroSecondaryButton">
                {content.secondaryButton}
                <span>→</span>
              </a>
            </div>

            <div className="heroNote">
              <span className="heroNoteLine" />
              <span>{content.note}</span>
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
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Föregående bild"
                >
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

              <span className="heroEyebrow">{content.eyebrow}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
