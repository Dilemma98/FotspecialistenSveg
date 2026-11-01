import "./treatments.css";
import "../../components/admin/editButton.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useLocation } from "react-router-dom";
import EditButton from "../../components/admin/editButton";

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

  useEffect(() => {
    async function fetchTreatmentContent() {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) {
        console.error("Error fetching treatment content:", error);
      } else {
        setContent(data);
      }
    }

    fetchTreatmentContent();
  }, []);

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
       {isEditMode && (
       <EditButton onClick={() => console.log("Redigera Behandlingar")} />
      )}
      <div className="treatmentsInner">
        {info && content.length > 0 && (
          <>
            <div className="treatmentsHeader">
              <div className="treatmentsIntro">
                <span className="sectionEyebrow">{info.eyebrow}</span>

                <h2>
                  {info.headingStart} <br />
                  <span>{info.headingEnd}</span>
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
    </section>
  );
}
