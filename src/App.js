import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";

////////////////////////////
const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const aPIKey = "855cb24f";

export default function App() {
  const [query, setQuery] = useState("inception");
  const [watched, setWatched] = useState([]);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoding, setIsLoding] = useState(false);
  const [selectedID, setSelectedId] = useState(null);
  const controller = new AbortController();
  const signal = controller.signal;

  function handleMovieSelection(id) {
    setSelectedId((selected) => (selected === id ? null : id));
  }

  function handleMovieBackDetail() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoding(true);
          setErrorMessage("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${aPIKey}&s=${query}`,
            { signal }
          );

          if (!res.ok) throw new Error("Somthing was wrong!! ");

          const data = await res.json();

          if (data.Response === "False") throw new Error("🚫 Movie not Find");

          // console.log(data.Search);

          handleMovieBackDetail();
          setMovies(data.Search);
          setErrorMessage("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err);
            // console.log("😀");
            setErrorMessage(err.message);
          }
        } finally {
          setIsLoding(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setErrorMessage("");
        return;
      }
      fetchMovies();

      return function () {
        // This line cause cancel fetching that when fetching is during the re-render of component
        // because Clean Up function is excuted when component unmounted and re-rendered
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <MovieNumbers movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {!errorMessage && !isLoding && (
            <MovieList movies={movies} onClick={handleMovieSelection} />
          )}
          {isLoding && <Loading />}
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetail
              selectedID={selectedID}
              onClick={handleMovieBackDetail}
              addBthHnadler={setWatched}
              watchedList={watched}
            />
          ) : (
            <>
              <WhatchedSummary watched={watched} />
              <WathcedMovieList watched={watched} setWatched={setWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Loading() {
  return <div className="loader">Loading...</div>;
}

function ErrorMessage({ message }) {
  return <div className="error">{message}</div>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const InputElement = useRef(null);

  useEffect(() => {
    function callBack(e) {
      if (e.code === "Enter") {
        console.log('hello')
        if (document.activeElement === InputElement.current) return;
        InputElement.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", callBack);

    return () => document.removeEventListener('keydown', callBack)
  }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={InputElement}
    />
  );
}

function MovieNumbers({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function CloseOpenButton({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <CloseOpenButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onClick={onClick} movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onClick }) {
  return (
    <li onClick={() => onClick(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>
        <a
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: "#fff", textDecoration: "none" }}
          href={`https://www.imdb.com/title/${movie.imdbID}`}
        >
          {movie.Title}
        </a>
      </h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchedBox() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <CloseOpenButton isOpen={isOpen} setIsOpen={setIsOpen} />

//       {isOpen && (
//         <>
//           <WhatchedSummary watched={watched} />
//           <WathcedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function WhatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WathcedMovieList({ watched, setWatched }) {
  function handleBtnRemove(id) {
    setWatched((watched) => watched.filter((watch) => watch.imdbID !== id));
  }
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} handleBtnRemove={handleBtnRemove} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleBtnRemove }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleBtnRemove(movie.imdbID)}
        >
          &times;
        </button>
      </div>
    </li>
  );
}

function MovieDetail({ selectedID, onClick, addBthHnadler, watchedList }) {
  const [movieDetail, setMoiveDetail] = useState("");
  const [isLoding, setIsLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRating, setUserRating] = useState("");
  const countRating = useRef(0)

  const isInWatchedLIst = watchedList
    .map((watch) => watch.imdbID)
    .includes(selectedID);

  const wathcedUserRating = watchedList.find(
    (watch) => watch.imdbID === selectedID
  )?.userRating;
  console.log(isInWatchedLIst, wathcedUserRating);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Country: country,
    Language: language,
  } = movieDetail;


  useEffect(function(){
    if (userRating) countRating.current++

  }, [userRating])

  function handlAddBtn() {
    const watchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating: Number(userRating),
      countRating: countRating.current
    };

    addBthHnadler((watched) => [...watched, watchedMovie]);
    onClick();
  }
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoding(true);
          setErrorMessage("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${aPIKey}&i=${selectedID}`
          );

          if (!res.ok) throw new Error("🚭 Connection Error");
          const data = await res.json();
          if (data.Response === "False") throw new Error("⛔ Movie not found ");

          console.log(data);
          setMoiveDetail(data);
          setIsLoding(false);
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setIsLoding(false);
        }
      }
      getMovieDetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
        console.log(`Cleanup movie is ${title}`);
      };
    },
    [title]
  );

  useEffect(function () {
    function callBack(e) {
      console.log(e);
      if (e.code !== "Escape") return;
      onClick();
      console.log("close");
    }

    document.addEventListener("keydown", callBack);

    return function () {
      document.removeEventListener("keydown", callBack);
    };
  });
  return (
    <div className="details">
      {!isLoding && !errorMessage && (
        <>
          <header>
            <button className="btn-back" onClick={onClick}>
              &larr;
            </button>
            <img src={poster} alt={`Poster fo ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isInWatchedLIst ? (
                <p>You rated this movie {wathcedUserRating} 🌟</p>
              ) : (
                <>
                  <StarRating
                    key={selectedID}
                    maxRate={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handlAddBtn}>
                      + Add list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>

            <p>Country {country}</p>
            <p>Language {language}</p>
            <p>Starting {actors}</p>
            <p>Director by {director}</p>
          </section>
        </>
      )}
      {isLoding && <Loading />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
}
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
// export default function App() {
//   const [amount, setAmount] = useState(10);
//   const [fromCurr, setFromCurr] = useState("USD");
//   const [toCurr, setToCurr] = useState("EUR");
//   const [convertedCurr, setConvertedCurr] = useState("");
//   const [IsLoading, setIsLoading] = useState(false);

//   const controller = new AbortController();

//   fetch(`https://93.118.151.146:8090/product_images/`)
//     .then((res) =>{
//       console.log(res)
//       return  res.json()})
//     .then((data) => console.log(data))
//     .catch((err) => console.log(`😀 ${err}`));
//   // const data = res.json()
//   // console.log
//   // useEffect(
//   //   function () {
//   //     async function getConvertedCurr() {
//   //       setIsLoading(true);
//   //       const res = await fetch(
//   //         `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurr}&to=${toCurr}`,
//   //         { signal: controller.signal }
//   //       );
//   //       const data = await res.json();
//   //       console.log(data);
//   //       console.log(data.rates[toCurr]);
//   //       setConvertedCurr(data.rates[toCurr]);
//   //       setIsLoading(false);
//   //     }

//   //     if (fromCurr === toCurr) return setConvertedCurr(amount);

//   //     getConvertedCurr();

//   //     // return function () {
//   //     //   controller.abort();
//   //     // };
//   //   },
//   //   [amount, fromCurr, toCurr]
//   // );

//   return (
//     <div>
//       <Currencies currency={fromCurr} setCurrency={setFromCurr} />
//       <input
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         type="text"
//         disabled={IsLoading}
//       />
//       <Currencies currency={toCurr} setCurrency={setToCurr} />
//       <p>
//         {convertedCurr} {toCurr}
//       </p>
//     </div>
//   );
// }

// function Currencies({ currency, setCurrency }) {
//   // const [currency, setCurrency] = useState(defaultCurrency);
//   return (
//     <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
//       <option value="USD">USD</option>
//       <option value="EUR">EUR</option>
//       <option value="CAD">CAD</option>
//       <option value="INR">INR</option>
//     </select>
//   );
// }
