import NavBar from "./components/navbar/navbar";
import Hero from "./components/hero/hero";
import Treatments from "./components/treatments/treatments";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import Footer from "./components/footer/footer";

import "./App.css";
export default function App(){
  return(
    <>
    <NavBar />
    <Hero />
    <Treatments />
    <About />
    <Contact />
    <Footer />
    </>
  );
}