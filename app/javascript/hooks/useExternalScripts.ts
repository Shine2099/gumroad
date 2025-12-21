import { useEffect } from "react";

export const useExternalScripts = (scripts: string[]) => {
  useEffect(() => {
    const loadedScripts: HTMLScriptElement[] = [];

    scripts.forEach((src) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      loadedScripts.push(script);
    });

    return () => {
      loadedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [scripts]);
};
