import "./about.css";
import "../../components/admin/editButton.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EditButton from "../../components/admin/editButton";
import EditModal from "../../components/admin/editModal";

interface AboutContent {
  lead: string;
  image: string;
  eyebrow: string;
  headingStart: string;
  headingAccent: string;
  headingEnd: string;
  imageAlt: string;
  paragraphs: string[];
  imageCaption: string;
  imageSubtitle: string;
}

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const location = useLocation();
  const isEditMode = location.pathname === "/admin/edit";
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftContent, setDraftContent] = useState<AboutContent | null>(null);

  const openEditor = () => {
    if (!content) return;

    setDraftContent({
      ...content,
      paragraphs: [...content.paragraphs],
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
        section_key: "about",
        content: draftContent,
      }),
    });

    if (!response.ok) {
      throw new Error("Kunde inte spara Om oss-innehållet.");
    }

    setContent(draftContent);
    closeEditor();
  } catch (error) {
    console.error("Kunde inte spara About:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Ett fel uppstod när innehållet skulle sparas.",
    );
  }
};


  useEffect(() => {
    async function fetchAboutContent() {
      try {
        const response = await fetch("/api/site-content");

        if (!response.ok) {
          throw new Error("Kunde inte hämta innehållet.");
        }

        const data = await response.json();

        const aboutData = data.find(
          (item: { section_key: string }) => item.section_key === "about",
        );

        if (!aboutData) {
          throw new Error("About-innehållet hittades inte.");
        }

        setContent(
          typeof aboutData.content === "string"
            ? JSON.parse(aboutData.content)
            : aboutData.content,
        );
      } catch (error) {
        console.error("Kunde inte hämta About:", error);
      }
    }

    fetchAboutContent();
  }, []);

  useEffect(() => {
    if (content) {
      console.log("About content:", content);
    }
  }, [content]);

  return (
    <>
      <section className="about" id="about">
        {isEditMode && <EditButton onClick={openEditor} />}
        <div className="aboutInner">
          {content && (
            <>
              <div className="aboutImageWrapper">
                <img
                  src={content.image}
                  alt={content.imageAlt}
                  className="aboutImage"
                />
                <div className="aboutImageCaption">
                  <span>{content.imageCaption}</span>
                  <span>{content.imageSubtitle}</span>
                </div>
              </div>

              <div className="aboutContent">
                <span className="aboutEyebrow">{content.eyebrow}</span>
                <h2 className="aboutHeading">
                  {content.headingStart}
                  <br />
                  <span className="aboutHeadingAccent">
                    {content.headingAccent}
                  </span>
                  <br />
                  {content.headingEnd}
                </h2>
                <div className="aboutDivider" />
                <p className="aboutLead">{content.lead}</p>
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index} className="aboutText">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {draftContent && (
        <EditModal
          isOpen={isEditorOpen}
          title="Redigera Om oss"
          onClose={closeEditor}
          onSave={handleSave}
        >
          <div className="editFormGroup">
            <label htmlFor="about-eyebrow">Liten text ovanför rubriken</label>
            <input
              id="about-eyebrow"
              value={draftContent.eyebrow}
              onChange={(e) =>
                setDraftContent({ ...draftContent, eyebrow: e.target.value })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="about-heading-start">Rubrikens första rad</label>
            <input
              id="about-heading-start"
              value={draftContent.headingStart}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  headingStart: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="about-heading-accent">Rubrikens färgade del</label>
            <input
              id="about-heading-accent"
              value={draftContent.headingAccent}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  headingAccent: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="about-heading-end">Rubrikens sista rad</label>
            <input
              id="about-heading-end"
              value={draftContent.headingEnd}
              onChange={(e) =>
                setDraftContent({ ...draftContent, headingEnd: e.target.value })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="about-lead">Inledande text</label>
            <textarea
              id="about-lead"
              value={draftContent.lead}
              onChange={(e) =>
                setDraftContent({ ...draftContent, lead: e.target.value })
              }
            />
          </div>

          {draftContent.paragraphs.map((paragraph, index) => (
            <div className="editFormGroup" key={index}>
              <label htmlFor={`about-paragraph-${index}`}>
                Textstycke {index + 1}
              </label>
              <textarea
                id={`about-paragraph-${index}`}
                value={paragraph}
                onChange={(e) =>
                  setDraftContent({
                    ...draftContent,
                    paragraphs: draftContent.paragraphs.map((item, i) =>
                      i === index ? e.target.value : item,
                    ),
                  })
                }
              />
            </div>
          ))}

          <div className="editFormGroup">
            <label htmlFor="about-image-caption">Bildtext</label>
            <input
              id="about-image-caption"
              value={draftContent.imageCaption}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  imageCaption: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="about-image-subtitle">
              Underrubrik under bilden
            </label>
            <input
              id="about-image-subtitle"
              value={draftContent.imageSubtitle}
              onChange={(e) =>
                setDraftContent({
                  ...draftContent,
                  imageSubtitle: e.target.value,
                })
              }
            />
          </div>

          <div className="editFormGroup">
            <label htmlFor="about-image-alt">
              Bildens beskrivning (alt-text)
            </label>
            <input
              id="about-image-alt"
              value={draftContent.imageAlt}
              onChange={(e) =>
                setDraftContent({ ...draftContent, imageAlt: e.target.value })
              }
            />
          </div>
        </EditModal>
      )}
    </>
  );
}
