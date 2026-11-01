import "./contact.css";
import "./contactMap.css";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contactInner">
        <div className="contactContent">
          <div className="contactHeading">
            <span className="contactEyebrow">KONTAKT & BOKNING</span>

            <h2>
              Dina fötter
              <br />
              är i <span>goda händer.</span>
            </h2>

            <p>
              Varmt välkommen att höra av dig för att boka en behandling eller
              om du har några frågor.
            </p>

            <a href="tel:+4668010733" className="contactMainButton">
              Ring och boka
              <span>↗</span>
            </a>
          </div>

          <div className="contactDetails" id="contactDetails">
           <div className="contactItem">
              <span className="contactItemLabel">TELEFON</span>
              <h3>Ring och boka</h3>
              <p>Kontakta Nadine för tidsbokning och frågor om behandlingar.</p>
              <a href="tel:+4668010733" className="contactTextLink">
                0680-107 33 <span>↗</span>
              </a>
            </div>
            <div className="contactItem">
              <span className="contactItemLabel">BESÖKSADRESS</span>
              <h3>Fotspecialisten</h3>
              <p>
                Fjällvägen 4 (Swedbank-huset)
                <br />
                842 32 Sveg
              </p>
            </div>
          </div>
        </div>

        <div className="contactMap">
          <iframe
            title="Karta över Fotspecialisten, Fjällvägen 4 i Sveg"
            src="https://www.google.com/maps?q=Fj%C3%A4llv%C3%A4gen+4,+Sveg&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="contactBottom">
        <span>MEDICINSK FOTVÅRD MED OMTANKE</span>
      </div>
    </section>
  );
}