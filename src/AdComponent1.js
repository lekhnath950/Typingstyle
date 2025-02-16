import React, { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      window.adsbygoogle = window.adsbygoogle || [];
      if (document.querySelectorAll(".adsbygoogle").length === 1) {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.error("AdSense error:", e);
        }
      }
    }
  }, []);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-8017840986434846"
        data-ad-slot="7955465925"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
