import "./about.css";

export default function About() {
    return (
        <section className="about" id="about">
            <div className="aboutInner">
                <div className="aboutImageWrapper">
                    <img
                        src="/imgs/nadine1.jpeg"
                        alt="Nadine, medicinsk fotvårdsspecialist"
                        className="aboutImage"
                    />

                    <div className="aboutImageCaption">
                        <span>NADINE</span>
                        <span>FOTVÅRDSSPECIALIST</span>
                    </div>
                </div>

                <div className="aboutContent">
                    <span className="aboutEyebrow">
                        PERSONEN BAKOM FOTVÅRDEN
                    </span>

                    <h2>
                        Ett personligt
                        <br />
                        <span>bemötande.</span>
                        <br />
                        Varje gång.
                    </h2>

                    <div className="aboutDivider" />

                    <p className="aboutLead">
                        Hej, jag heter Nadine!
                    </p>

                    <p className="aboutText">
                        Jag är diplomerad fotvårdsspecialist och har
                        arbetat med fotvård sedan 2007. För mig är det
                        viktigt att varje kund känner sig välkommen,
                        trygg och väl omhändertagen.
                    </p>

                    <p className="aboutText">
                        Alla fötter och människor har olika behov.
                        Därför strävar jag efter att ge en personlig
                        behandling där omsorg, noggrannhet och ett
                        gott bemötande alltid står i centrum.
                    </p>

                    <p className="aboutText">
                        Har du diabetes eller reumatism? Jag tar emot
                        remisser och utför behandlingar på uppdrag av
                        Region Jämtland Härjedalen. Prata med din läkare
                        eller diabetessköterska.
                    </p>

                    <p className="aboutText">
                        Min huvudsakliga verksamhet finns på Fjällvägen 4,
                        i Swedbank-huset. Jag gör även hembesök efter
                        överenskommelse.
                    </p>

                    <div className="aboutSignature">
                        <span className="signatureLine" />
                        <span>Nadine</span>
                    </div>

                    {/* <a href="#contact" className="aboutButton">
                        Välkommen att boka
                        <span>↗</span>
                    </a> */}
                </div>
            </div>

            <div className="aboutBottom">
                <span>FOTVÅRD MED KUNSKAP</span>
                <span className="aboutBottomLine" />
                <span>FOTVÅRD MED OMTANKE</span>
            </div>
        </section>
    );
}