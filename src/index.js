import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./starRating";

// function Test() {
//   const [movieRate, setMovieRate] = useState(3);
//   return (
//     <div>
//       <StarRating
//         color="green"
//         size={30}
//         onSetRating={setMovieRate}
//         defaultRating={3}
//       />
//       <p>Movie Rate is {movieRate}</p>
//     </div>
//   );
// }
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <App />

    // {/* <StarRating maxRate={6} message={['terrible', 'bad', 'ok', 'good', 'great', 'amazing']}/>
    // <StarRating color="blue"/>
    // <StarRating color="red" size={28} maxRate={3} defaultRating={2}/>
    // <Test></Test> */}
);
