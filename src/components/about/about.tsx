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

type AboutField =
  | "image"
  | "imageCaption"
  | "eyebrow"
  | "heading"
  | "lead"
  | "paragraphs";

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [draftContent, setDraftContent] = useState<AboutContent | null>(null);

  const location = useLocation();
  const isEditMode = location.pathname === "/admin/edit";

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeField, setActiveField] = useState<AboutField | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const openEditor = (field: AboutField) => {
    if (!content) return;

    setDraftContent({
      ...content,
      paragraphs: [...content.paragraphs],
    });

    setActiveField(field);
    setErrorMessage("");
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setDraftContent(null);
    setActiveField(null);
    setErrorMessage("");
  };

  const handleSave = async () => {
    if (!draftContent) return;

    setErrorMessage("");

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

      setContent({ ...draftContent });
      closeEditor();
    } catch (error) {
      console.error("Kunde inte spara About:", error);

      setErrorMessage(
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

        const parsedContent =
          typeof aboutData.content === "string"
            ? JSON.parse(aboutData.content)
            : aboutData.content;

        setContent(parsedContent);
      } catch (error) {
        console.error("Kunde inte hämta About:", error);
      }
    }

    fetchAboutContent();
  }, []);

  const editorTitle = (() => {
    switch (activeField) {
      case "image":
        return "Redigera bilden";
      case "imageCaption":
        return "Redigera bildtext";
      case "eyebrow":
        return "Redigera introduktion";
      case "heading":
        return "Redigera rubrik";
      case "lead":
        return "Redigera inledande text";
      case "paragraphs":
        return "Redigera textstycke";
      default:
        return "Redigera Om oss";
    }
  })();

  return (
    <>
      <section className="about" id="about">
        <div className="aboutInner">
          {content && (
            <>
              {/* IMAGE */}
              <div className="aboutImageWrapper">
                <img
                  src={content.image}
                  alt={content.imageAlt}
                  className="aboutImage"
                />

                <div className="aboutImageCaption">
                  <div className="aboutEditable">
                    <div className="aboutCaptionText">
                      <span>{content.imageCaption}</span>
                      <span>{content.imageSubtitle}</span>
                    </div>

                    {isEditMode && (
                      <EditButton onClick={() => openEditor("imageCaption")} />
                    )}
                  </div>
                </div>
              </div>

              {/* TEXT CONTENT */}
              <div className="aboutContent">
                {/* EYEBROW */}
                <div className="aboutEditable">
                  <span className="aboutEyebrow">{content.eyebrow}</span>

                  {isEditMode && (
                    <EditButton onClick={() => openEditor("eyebrow")} />
                  )}
                </div>

                {/* HEADING */}
                <div className="aboutEditable">
                  <h2 className="aboutHeading">
                    {content.headingStart}
                    <br />
                    <span className="aboutHeadingAccent">
                      {content.headingAccent}
                    </span>
                    <br />
                    {content.headingEnd}
                  </h2>

                  {isEditMode && (
                    <EditButton onClick={() => openEditor("heading")} />
                  )}
                </div>

                <div className="aboutDivider" />

                {/* LEAD */}
                <div className="aboutEditable">
                  <p className="aboutLead">{content.lead}</p>

                  {isEditMode && (
                    <EditButton onClick={() => openEditor("lead")} />
                  )}
                </div>

                {/* PARAGRAPHS */}
                <div className="aboutEditable aboutParagraphsEditable">
                  <div>
                    {content.paragraphs.map((paragraph, index) => (
                      <p key={index} className="aboutText">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {isEditMode && (
                    <EditButton onClick={() => openEditor("paragraphs")} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* EDIT MODAL */}
      {isEditMode && (
        <EditModal
          isOpen={isEditorOpen}
          title={editorTitle}
          onClose={closeEditor}
          onSave={handleSave}
        >
          {errorMessage && <p role="alert">{errorMessage}</p>}

          {draftContent && (
            <div className="editFormGroup">
              {/* IMAGE */}
              {activeField === "image" && (
                <>
                  <label htmlFor="about-image">Bildadress (URL)</label>
                  <input
                    id="about-image"
                    type="text"
                    value={draftContent.image}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        image: e.target.value,
                      })
                    }
                  />

                  <label htmlFor="about-image-alt">
                    Bildens beskrivning (alt-text)
                  </label>
                  <input
                    id="about-image-alt"
                    type="text"
                    value={draftContent.imageAlt}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        imageAlt: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* IMAGE CAPTION */}
              {activeField === "imageCaption" && (
                <>
                  <label htmlFor="about-image-caption">Bildtext</label>
                  <input
                    id="about-image-caption"
                    type="text"
                    value={draftContent.imageCaption}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        imageCaption: e.target.value,
                      })
                    }
                  />

                  <label htmlFor="about-image-subtitle">
                    Underrubrik under bilden
                  </label>
                  <input
                    id="about-image-subtitle"
                    type="text"
                    value={draftContent.imageSubtitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        imageSubtitle: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* EYEBROW */}
              {activeField === "eyebrow" && (
                <>
                  <label htmlFor="about-eyebrow">
                    Liten text ovanför rubriken
                  </label>
                  <input
                    id="about-eyebrow"
                    type="text"
                    value={draftContent.eyebrow}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        eyebrow: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* HEADING */}
              {activeField === "heading" && (
                <>
                  <label htmlFor="about-heading-start">
                    Rubrikens första rad
                  </label>
                  <input
                    id="about-heading-start"
                    type="text"
                    value={draftContent.headingStart}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        headingStart: e.target.value,
                      })
                    }
                  />

                  <label htmlFor="about-heading-accent">
                    Rubrikens färgade del
                  </label>
                  <input
                    id="about-heading-accent"
                    type="text"
                    value={draftContent.headingAccent}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        headingAccent: e.target.value,
                      })
                    }
                  />

                  <label htmlFor="about-heading-end">Rubrikens sista rad</label>
                  <input
                    id="about-heading-end"
                    type="text"
                    value={draftContent.headingEnd}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        headingEnd: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* LEAD */}
              {activeField === "lead" && (
                <>
                  <label htmlFor="about-lead">Inledande text</label>
                  <textarea
                    id="about-lead"
                    value={draftContent.lead}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        lead: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* INDIVIDUAL PARAGRAPH */}
              {/* ALL PARAGRAPHS */}
              {activeField === "paragraphs" && (
                <>
                  <label>Brödtext</label>

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
                            paragraphs: draftContent.paragraphs.map(
                              (item, i) =>
                                i === index ? e.target.value : item,
                            ),
                          })
                        }
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </EditModal>
      )}
    </>
  );
}
