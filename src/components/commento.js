import React, { useEffect } from "react"; // Helper to add scripts to our page
import {useLocation} from "@reach/router";
const insertScript = (src, id, parentElement) => {
  const script = window.document.createElement("script");
  script.async = true;
  script.src = src;
  script.id = id;
  parentElement.appendChild(script);
  return script;
}; // Helper to remove scripts from our page
const removeScript = (id, parentElement) => {
  const script = window.document.getElementById(id);
  if (script) {
    parentElement.removeChild(script);
  }
}; // The actual component
const Commento = () => {
  const location= useLocation();
  
  useEffect(() => {
    // If there's no window there's nothing to do for us
    if (!window) {
      return;
    }
    const document = window.document;
    // In case our #commento container exists we can add our commento script
    if (document.getElementById("commento")) {
      insertScript(`https://comments-nk7.herokuapp.com/js/commento.js`, `commento-script`, document.body);
    } // Cleanup; remove the script from the page
    return () => removeScript(`commento-script`, document.body);
  }, [location]);
  return <div id={`commento`} />;
};
export default Commento;
