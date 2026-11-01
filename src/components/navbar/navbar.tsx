import "./navbar.css";

export default function Navbar() {
    return (
        <header className="siteHeader">
            <div className="brand">
                <span className="brandLocation">SVEG · EST. 2007</span>

                <a href="#home" className="brandLogo">
                    <img
                        src="/imgs/logo4.png"
                        alt="Fotspecialisten"
                    />
                </a>

                <span className="brandSubtitle">
                    MEDICINSK FOTVÅRD
                </span>
            </div>

            <nav className="navbar">
                <ul>
                    <li><a href="#home">Hem</a></li>
                    <li><a href="#treatments">Behandlingar</a></li>
                    <li><a href="#about">Om mig</a></li>
                    <li><a href="#contact">Kontakt</a></li>
                </ul>
            </nav>
        </header>
    );
}