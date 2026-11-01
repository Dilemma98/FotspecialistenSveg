import "./treatments.css";

const treatments = [
    {
        number: "01",
        title: "Medicinsk fotvård",
        description:
            "Ge dina fötter den omsorg de behöver. Behandlingen anpassas efter dina fötters behov och hjälper till att förebygga och behandla vanliga fotbesvär.",
        details: [
            "Fotbad och nagelvård",
            "Behandling av förhårdnader",
            "Vård av liktornar, vårtor och nagelbesvär",
            "Avslutande fotvård och rådgivning",
        ],
        label: "PERSONLIG FOTVÅRD",
    },
    {
        number: "02",
        title: "Fotvård på remiss",
        description:
            "För dig med diabetes, reumatoid artrit, psoriasis eller cirkulationsrubbning i ben och fötter. Behandlingen utförs på uppdrag av Region Jämtland Härjedalen.",
        details: [
            "Remiss utfärdas av läkare eller diabetessköterska",
            "Upp till 4 behandlingar per år",
            "Frikort gäller vid giltig remiss",
            "Individuellt anpassad fotvård",
        ],
        label: "FOTVÅRD PÅ REMISS",
    },
    {
        number: "03",
        title: "Öronhåltagning",
        description:
            "Vill du ta hål i öronen? Här får du ett personligt bemötande och hjälp genom hela behandlingen.",
        details: [
            "Håltagning i ytteröra eller näsvinge",
            "Blomdahls system",
            "Personlig vägledning och information om eftervård",
        ],
        label: "ÖRONHÅLTAGNING",
    },
];

export default function Treatments() {
    return (
        <section className="treatments" id="treatments">
            <div className="treatmentsInner">
                <div className="treatmentsHeader">
                    <div className="treatmentsIntro">
                        <span className="sectionEyebrow">
                            OMSORG FRÅN GRUNDEN
                        </span>

                        <h2>
                            Behandlingar med
                            <br />
                            <span>omtanke i varje steg.</span>
                        </h2>
                    </div>

                    <div className="treatmentsLead">
                          <p>
        Alla fötter är olika. Därför utgår varje
        behandling från dig, dina behov och vad just dina
        fötter behöver. Regelbunden fotvård hjälper dig att
        förebygga fotproblem på sikt och är samtidigt en
        kontroll av fotens status.
    </p>
                        <p className="treatmentsPolicy">
                            <b>
                                Avbokning: Minst 4 timmar före bokad tid.
                                Uteblivet besök debiteras med 300:-
                            </b>
                        </p>
                    </div>
                </div>

                <div className="treatmentList">
                    {treatments.map((treatment) => (
                        <article
                            className="treatmentCard"
                            key={treatment.number}
                        >
                            <div className="treatmentTop">
                                <span className="treatmentNumber">
                                    {treatment.number}
                                </span>

                                <span className="treatmentLabel">
                                    {treatment.label}
                                </span>
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

                <div className="treatmentsNote">
                    <span className="noteLine" />
                    <p>
                        Osäker på vilken behandling som passar dig, eller på
                        om du har rätt till remiss? Prata med din läkare eller
                        diabetessköterska, eller hör av dig så hjälper jag dig
                        vidare.
                    </p>
                    <a href="tel:+4668010733">
                        Ring och boka <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}