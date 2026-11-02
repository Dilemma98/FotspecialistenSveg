import "./treatments.css";
import "../../components/admin/editButton.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useLocation } from "react-router-dom";
import EditButton from "../../components/admin/editButton";
import EditModal from "../../components/admin/editModal";

interface TreatmentContent {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  label: string | null;
  details: string[];
  is_active: boolean;
}
interface TreatmentInfo {
  note: string;
  eyebrow: string;
  headingStart: string;
  headingEnd: string;
  description: string;
  cancellationPolicy: string;
}

export default function Treatments() {
  const [content, setContent] = useState<TreatmentContent[]>([]);
  const [info, setInfo] = useState<TreatmentInfo | null>(null);
  const location = useLocation();
  const isEditMode = location.pathname === "/admin/edit";
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftTreatment, setDraftTreatment] = useState<TreatmentContent | null>(
    null,
  );
  const [updatingTreatmentId, setUpdatingTreatmentId] = useState<string | null>(
    null,
  );
  const [draftInfo, setDraftInfo] = useState<TreatmentInfo | null>(null);

  const openEditor = () => {
    setIsEditorOpen(true);
  };
  const openInfoEditor = () => {
    if (!info) return;

    setDraftInfo({ ...info });
  };

  const openTreatmentEditor = (treatment: TreatmentContent) => {
    setDraftTreatment({
      ...treatment,
      details: [...treatment.details],
    });
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setDraftTreatment(null);
    setDraftInfo(null);
  };
  const handleSave = async () => {
    // Spara informationstexten ovanför behandlingarna
    if (draftInfo) {
      const { error } = await supabase
        .from("site_content")
        .update({
          content: draftInfo,
          updated_at: new Date().toISOString(),
        })
        .eq("section_key", "treatments");

      if (error) {
        console.error("Kunde inte spara behandlingstexten:", error);
        return;
      }

      setInfo(draftInfo);
      setDraftInfo(null);
      closeEditor();
      return;
    }

    // Spara en enskild behandling
    if (!draftTreatment) return;

    const { error } = await supabase
      .from("treatments")
      .update({
        title: draftTreatment.title,
        description: draftTreatment.description,
        label: draftTreatment.label,
        details: draftTreatment.details,
      })
      .eq("id", draftTreatment.id);

    if (error) {
      console.error("Kunde inte spara behandlingen:", error);
      return;
    }

    setContent((previousContent) =>
      previousContent.map((item) =>
        item.id === draftTreatment.id ? draftTreatment : item,
      ),
    );

    closeEditor();
  };

  const toggleTreatmentStatus = async (treatment: TreatmentContent) => {
    const newStatus = !treatment.is_active;

    setUpdatingTreatmentId(treatment.id);

    const { error } = await supabase
      .from("treatments")
      .update({ is_active: newStatus })
      .eq("id", treatment.id);

    if (error) {
      console.error("Kunde inte uppdatera behandlingsstatus:", error);
      setUpdatingTreatmentId(null);
      return;
    }

    setContent((previousContent) =>
      previousContent.map((item) =>
        item.id === treatment.id ? { ...item, is_active: newStatus } : item,
      ),
    );

    setUpdatingTreatmentId(null);
  };

  useEffect(() => {
    async function fetchTreatmentContent() {
      let query = supabase
        .from("treatments")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!isEditMode) {
        query.eq("is_active", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching treatment content:", error);
      } else {
        setContent(data);
      }
    }

    fetchTreatmentContent();
  }, [isEditMode]);

  useEffect(() => {
    async function fetchTreatmentInfo() {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "treatments")
        .single();

      if (error) {
        console.error("Error fetching treatment info:", error);
      } else {
        setInfo(data.content);
      }
    }

    fetchTreatmentInfo();
  }, []);
  useEffect(() => {
    console.log("Treatment content:", info);
  }, [info]);

  return (
    <section className="treatments" id="treatments">
      {isEditMode && <EditButton onClick={openEditor} />}
      <div className="treatmentsInner">
        {info && content.length > 0 && (
          <>
            <div className="treatmentsHeader">
              <div className="treatmentsIntro">
                <span className="sectionEyebrow">{info.eyebrow}</span>

                <h2>
                  {info.headingStart} <br />
                  <span>{info.headingEnd}.</span>
                </h2>
              </div>

              <div className="treatmentsLead">
                <p>{info.description}</p>
                <p className="treatmentsPolicy">
                  <b>{info.cancellationPolicy}</b>
                </p>
              </div>
            </div>
            <div className="treatmentsNote">
              <span className="noteLine" />
              <p>{info.note}</p>
              <a href="tel:+4668010733">
                Ring och boka <span>→</span>
              </a>
            </div>
            <div className="treatmentList">
              {content.map((treatment) => (
                <article className="treatmentCard" key={treatment.id}>
                  <div className="treatmentTop">
                    <span className="treatmentNumber">
                      {String(treatment.sort_order).padStart(2, "0")}
                    </span>

                    <span className="treatmentLabel">{treatment.label}</span>
                  </div>

                  <div className="treatmentContent">
                    <h3>{treatment.title}</h3>

                    <p className="treatmentDescription">
                      {treatment.description}
                    </p>

                    <ul>
                      {treatment.details.map((detail) => (
                        <li key={detail}>
                          <span className="detailDot" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
      {isEditMode && (
        <EditModal
          isOpen={isEditorOpen}
          title={
            draftInfo
              ? "Redigera behandlingstext"
              : draftTreatment
                ? "Redigera behandling"
                : "Hantera behandlingar"
          }
          onClose={closeEditor}
          onSave={handleSave}
        >
          {draftInfo ? (
            <>
              <button
                type="button"
                className="treatmentAdminBackButton"
                onClick={() => setDraftInfo(null)}
              >
                ← Tillbaka till behandlingarna
              </button>

              <div className="editFormGroup">
                <label>Introduktion</label>
                <input
                  type="text"
                  value={draftInfo.eyebrow}
                  onChange={(e) =>
                    setDraftInfo({ ...draftInfo, eyebrow: e.target.value })
                  }
                />

                <label>Rubrik – första delen</label>
                <input
                  type="text"
                  value={draftInfo.headingStart}
                  onChange={(e) =>
                    setDraftInfo({ ...draftInfo, headingStart: e.target.value })
                  }
                />

                <label>Rubrik – andra delen</label>
                <input
                  type="text"
                  value={draftInfo.headingEnd}
                  onChange={(e) =>
                    setDraftInfo({ ...draftInfo, headingEnd: e.target.value })
                  }
                />

                <label>Beskrivning</label>
                <textarea
                  value={draftInfo.description}
                  onChange={(e) =>
                    setDraftInfo({ ...draftInfo, description: e.target.value })
                  }
                />

                <label>Avbokningspolicy</label>
                <textarea
                  value={draftInfo.cancellationPolicy}
                  onChange={(e) =>
                    setDraftInfo({
                      ...draftInfo,
                      cancellationPolicy: e.target.value,
                    })
                  }
                />

                <label>Notis ovanför behandlingarna</label>
                <textarea
                  value={draftInfo.note}
                  onChange={(e) =>
                    setDraftInfo({ ...draftInfo, note: e.target.value })
                  }
                />
              </div>
            </>
          ) : draftTreatment ? (
            <>
              <button
                type="button"
                className="treatmentAdminBackButton"
                onClick={() => {
                  setDraftTreatment(null);
                }}
              >
                ← Tillbaka till behandlingarna
              </button>
              <div className="editFormGroup">
                <label>Titel</label>
                <input
                  type="text"
                  value={draftTreatment.title}
                  onChange={(e) =>
                    setDraftTreatment({
                      ...draftTreatment,
                      title: e.target.value,
                    })
                  }
                />

                <label>Beskrivning</label>
                <textarea
                  value={draftTreatment.description}
                  onChange={(e) =>
                    setDraftTreatment({
                      ...draftTreatment,
                      description: e.target.value,
                    })
                  }
                />

                <label>Etikett</label>
                <input
                  type="text"
                  value={draftTreatment.label ?? ""}
                  onChange={(e) =>
                    setDraftTreatment({
                      ...draftTreatment,
                      label: e.target.value || null,
                    })
                  }
                />
                <label>Detaljer</label>

                <div className="treatmentDetailEditor">
                  {draftTreatment.details.map((detail, index) => (
                    <div className="treatmentDetailInput" key={index}>
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          const updatedDetails = [...draftTreatment.details];
                          updatedDetails[index] = e.target.value;

                          setDraftTreatment({
                            ...draftTreatment,
                            details: updatedDetails,
                          });
                        }}
                      />

                      <button
                        type="button"
                        className="treatmentDetailRemove"
                        onClick={() => {
                          setDraftTreatment({
                            ...draftTreatment,
                            details: draftTreatment.details.filter(
                              (_, i) => i !== index,
                            ),
                          });
                        }}
                        aria-label="Ta bort detalj"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="treatmentDetailAdd"
                  onClick={() => {
                    setDraftTreatment({
                      ...draftTreatment,
                      details: [...draftTreatment.details, ""],
                    });
                  }}
                >
                  + Lägg till detalj
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="treatmentAdminEditButton"
                onClick={openInfoEditor}
              >
                Redigera texten ovanför behandlingarna →
              </button>

              <div className="treatmentAdminList">
                {content.map((treatment) => (
                  <div key={treatment.id} className="treatmentAdminItem">
                    <div>
                      <h3>{treatment.title}</h3>

                      <button
                        type="button"
                        className={`treatmentAdminStatus ${
                          treatment.is_active ? "active" : "inactive"
                        }`}
                        onClick={() => toggleTreatmentStatus(treatment)}
                        disabled={updatingTreatmentId === treatment.id}
                      >
                        <span className="treatmentAdminStatusDot" />
                        {updatingTreatmentId === treatment.id
                          ? "Sparar..."
                          : treatment.is_active
                            ? "Aktiv"
                            : "Dold"}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="treatmentAdminEditButton"
                      onClick={() => openTreatmentEditor(treatment)}
                    >
                      Redigera <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </EditModal>
      )}
    </section>
  );
}
