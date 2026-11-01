import "./about.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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

  useEffect(() => {
    async function fetchAboutContent() {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "about")
        .single();

      if (error) {
        console.error("Kunde inte hämta About:", error);
        return;
      }

      setContent(data.content);
    }

    fetchAboutContent();
  }, []);

  useEffect(() => {
    if (content) {
      console.log("About content:", content);
    }
  }, [content]);

  return (
    <section className="about" id="about">
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
                <br/>
                <span className="aboutHeadingAccent">{content.headingAccent}</span>
                <br/>
                {content.headingEnd}
              </h2>
               <div className="aboutDivider"/>
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

      {/* <div className="aboutBottom">
        <span>FOTVÅRD MED KUNSKAP</span>
        <span className="aboutBottomLine" />
        <span>FOTVÅRD MED OMTANKE</span>
      </div> */}
    </section>
  );
}
