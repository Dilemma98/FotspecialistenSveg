import { useCallback, useEffect, useState } from "react";
import "./hero.css";
import "./heroSlideshow.css";
import "../../components/admin/editButton.css";
import { useLocation } from "react-router-dom";
import EditButton from "../../components/admin/editButton";
import EditModal from "../../components/admin/editModal";

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
  const location = useLocation();
  const isEditMode = location.pathname === "/admin/edit";
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftContent, setDraftContent] = useState<HeroContent | null>(null);

  const openEditor = () => {
    if (!content) return;

    setDraftContent({
      ...content,
      slides: content.slides.map((slide) => ({ ...slide })),
    });

    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setDraftContent(null);
  };

  const handleSave = async () => {
    if (!draftContent) return;

    try {
      const response = await fetch("/api/site-content", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section_key: "hero",
          content: draftContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte spara startsidans innehåll.");
      }

      setContent(draftContent);
      closeEditor();
    } catch (error) {
      console.error("Kunde inte spara Hero:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Ett fel uppstod när innehållet skulle sparas.",
      );
    }
  };

  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const response = await fetch("/api/site-content");

        if (!response.ok) {
          throw new Error("Kunde inte hämta innehållet.");
        }

        const data = await response.json();

        const heroData = data.find(
          (item: { section_key: string }) => item.section_key === "hero",
        );

        if (!heroData) {
          throw new Error("Hero-innehållet hittades inte.");
        }

        setContent(
          typeof heroData.content === "string"
            ? JSON.parse(heroData.content)
            : heroData.content,
        );
      } catch (error) {
        console.error("Kunde inte hämta Hero:", error);
      }
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
    <>
      <section className="hero" id="home">
        {isEditMode && <EditButton onClick={openEditor} />}
        {content && (
          <>
            <div className="heroContent">
              <span className="heroEyebrow">{content.eyebrow}</span>

              <h1>
                {content.title}{" "}
                <span>
                  {content.titleAccent}
                  {""}
                </span>
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
      {draftContent && (
        <EditModal
          isOpen={isEditorOpen}
          title="Redigera startsidan"
          onClose={closeEditor}
          onSave={handleSave}
        >
          <div className="editFormGroup">
            <label htmlFor="hero-eyebrow">Liten text ovanför rubriken</label>
            <input
              id="hero-eyebrow"
              type="text"
              value={draftContent.eyebrow}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  eyebrow: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="hero-title">Rubrik</label>
            <input
              id="hero-title"
              type="text"
              value={draftContent.title}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="hero-title-accent">Rubrikens färgade del</label>
            <input
              id="hero-title-accent"
              type="text"
              value={draftContent.titleAccent}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  titleAccent: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="hero-title-ending">Text efter rubriken</label>
            <input
              id="hero-title-ending"
              type="text"
              value={draftContent.titleEnding}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  titleEnding: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="hero-description">Beskrivning</label>
            <textarea
              id="hero-description"
              value={draftContent.description}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  description: e.target.value,
                })
              }
            />
          </div>
        </EditModal>
      )}
    </>
  );
}
