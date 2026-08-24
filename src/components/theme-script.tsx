import Script from 'next/script';

/* runs first so that the theme is already set */
const script = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`;

export function ThemeScript() {
  return (
    <Script 
      id="theme-script" 
      strategy="beforeInteractive" 
      dangerouslySetInnerHTML={{ __html: script }} 
    />
  );
}
