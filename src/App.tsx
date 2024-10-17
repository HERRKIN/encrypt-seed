import React, { useEffect } from "react";
import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigation,
  useResolvedPath,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { generateSeedPhrase, scrambleOrUnscramble } from "./utils";
const routes = ["/", "/scramble", "/unscramble"];
function App() {
  const location = useLocation();

  const pathname = location.pathname;
  console.log({ pathname });
  return (
    <div className="App">
      <nav
        style={{
          width: "100%",
          background: "black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {routes.map((r) => (
            <li key={r} className={r === pathname ? "selected-link" : ""}>
              <Link
                to={r}
                style={{
                  textTransform: "capitalize",
                  ...(pathname === r ? { color: "lightblue" } : {}),
                }}
              >
                {r === "/" ? "Generate" : r.replace("/", "")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/scramble" Component={Scramble} />
        <Route path="/unscramble" Component={UnScramble} />
      </Routes>
    </div>
  );
}

const Home = () => {
  // in the home we generate a Seed, we can select if we want it 12 or 24 words
  // we can add a button to generate the seed
  //we can add a button to copy the seed
  const [amount, setAmount] = React.useState(12); // 12 or 24
  const [seed, setSeed] = React.useState(generateSeedPhrase(amount));
  useEffect(() => {
    setSeed(generateSeedPhrase(amount));
  }, [amount]);

  return (
    <div>
      <div>
        <h1>Seed generation</h1>
        <label className={amount === 12 ? "selected" : ""}>
          <input
            type="radio"
            name="amount"
            value="12"
            checked={amount === 12}
            onChange={(e) => setAmount(12)}
          />
          12 words
        </label>
        <label className={amount === 24 ? "selected" : ""}>
          <input
            type="radio"
            name="amount"
            value="24"
            checked={amount === 24}
            onChange={(e) => setAmount(24)}
          />
          24 words
        </label>
      </div>
      {seed ? (
        <>
          <div
            className="seed"
            onClick={() => {
              navigator.clipboard.writeText(seed);
              alert("Seed copied to clipboard");
            }}
          >
            {seed}
            <p>CLICK TO COPY</p>
          </div>
          <button onClick={() => setSeed(generateSeedPhrase(amount))}>
            Generate
          </button>
        </>
      ) : null}
    </div>
  );
};
const Scramble = () => {
  const [seed, setSeed] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [scrambledSeed, setScrambledSeed] = React.useState("");

  const paste = async () => {
    const text = await navigator.clipboard.readText();
    setSeed(text);
    console.log({ text });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Scramble</h1>
      <button onClick={paste}>paste</button>
      <textarea placeholder="Enter your seed phrase" value={seed} />
      {seed && (
        <span
          style={{
            margin: 10,
          }}
        >
          {seed.split(" ").length} words
        </span>
      )}
      {seed && (
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 10,
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              marginLeft: 10,
              padding: 10,
            }}
          />

          <button
            onClick={() => {
              if (!seed) {
                alert("Please enter a seed phrase");
                return;
              }
              if (password !== confirmPassword) {
                alert("Passwords do not match");
                setScrambledSeed("");
                return;
              }
              if ([password, confirmPassword].includes("")) {
                alert("Please enter a password");
                return;
              }

              const newSeed = scrambleOrUnscramble(
                seed.split(" "),
                password,
                "scramble"
              );
              setScrambledSeed(newSeed.join(" "));
            }}
          >
            Scramble
          </button>
        </div>
      )}

      {scrambledSeed && (
        <div
          className="seed"
          onClick={() => {
            navigator.clipboard.writeText(scrambledSeed);
            alert("Seed copied to clipboard");
          }}
        >
          <h1>Scrambled Seed</h1>
          {scrambledSeed}
          <p>CLICK TO COPY</p>
        </div>
      )}
    </div>
  );
};
const UnScramble = () => {
  const [seed, setSeed] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [unscrambledSeed, setUnscrambledSeed] = React.useState("");

  const paste = async () => {
    const text = await navigator.clipboard.readText();
    setSeed(text);
    console.log({ text });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Unscramble</h1>
      <button onClick={paste}>paste</button>
      <textarea placeholder="Enter your seed phrase" value={seed} />
      {seed && (
        <span
          style={{
            margin: 10,
          }}
        >
          {seed.split(" ").length} words
        </span>
      )}
      {seed && (
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 10,
            }}
          />

          <button
            onClick={() => {
              if (!seed) {
                alert("Please enter a seed phrase");
                return;
              }
              if (!password) {
                alert("Please enter a password");
                return;
              }

              const newSeed = scrambleOrUnscramble(
                seed.split(" "),
                password,
                "unscramble"
              );
              setUnscrambledSeed(newSeed.join(" "));
            }}
          >
            Unscramble
          </button>
        </div>
      )}

      {unscrambledSeed && (
        <div
          className="seed"
          onClick={() => {
            navigator.clipboard.writeText(unscrambledSeed);
            alert("Seed copied to clipboard");
          }}
        >
          <h1>Uncrambled Seed</h1>
          {unscrambledSeed}
          <p>CLICK TO COPY</p>
        </div>
      )}
    </div>
  );
};

export default App;
