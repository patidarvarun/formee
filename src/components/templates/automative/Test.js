import React, { useState } from "react";

// import "./crousal.less";

import Carousel from "../../common/caraousal";

const Test = () => {
  const [slides] = useState([
    "https://placehold.it/400x240?text=Slide-1",
    "https://placehold.it/400x240?text=Slide-2",
    "https://placehold.it/400x240?text=Slide-3",
    "https://placehold.it/400x240?text=Slide-4",
    "https://placehold.it/400x240?text=Slide-5",
    // "https://placehold.it/400x240?text=Slide-6",
    // "https://placehold.it/400x240?text=Slide-7",
    // "https://placehold.it/400x240?text=Slide-8",
    // "https://placehold.it/400x240?text=Slide-9"
  ]);

  return (
    <div className="container mt-5">
      <Carousel className="mb-4" slides={slides} />     
    </div>
  );
};

export default Test;
