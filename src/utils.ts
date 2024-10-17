import CryptoJS from "crypto-js";
import { wordlists, generateMnemonic } from "bip39";
const wordlist = wordlists.english;

export function generateSeedPhrase(size = 12) {
  console.log({ size });
  const entropyBits = size === 24 ? 256 : 128; // Use 256 bits for 24 words, otherwise 128 bits
  const mnemonic = generateMnemonic(entropyBits);
  console.log({ mnemonic });
  return mnemonic;
}

function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

function generatePRNGSeed(hash: string): number {
  let seed = 0;
  for (let i = 0; i < hash.length; i++) {
    seed = (seed * 10 + hash.charCodeAt(i)) % 2147483647;
  }
  return seed;
}

function pseudoRandomNumber(seed: number): [number, number] {
  const a = 16807;
  const m = 2147483647;
  seed = (a * seed) % m;
  return [seed, seed];
}

export function scrambleOrUnscramble(
  seedPhrase: string[],
  password: string,
  operation: "scramble" | "unscramble"
): string[] {
  const hash = hashPassword(password);
  let seed = generatePRNGSeed(hash);
  const resultPhrase: string[] = [];
  console.log(seedPhrase);
  (operation === "scramble" ? seedPhrase : [...seedPhrase].reverse()).forEach(
    (word, index) => {
      const wordIndex = wordlist.indexOf(word);
      if (wordIndex === -1) {
        console.error(`Word "${word}" not found in the BIP39 list.`);
        return;
      }

      // Scale the pseudo-random number to the range of 0 to 2047 (the size of the BIP39 word list)
      let adjustment = seed % wordlist.length;
      const [nseed, _] = pseudoRandomNumber(seed); // Generate the next seed value
      seed = nseed;
      if (operation === "scramble") {
        // Apply the scaled adjustment
        index = (wordIndex + adjustment + wordlist.length) % wordlist.length;
      } else {
        // Reverse the scaled adjustment
        index = (wordIndex - adjustment + wordlist.length) % wordlist.length;
        // console.log({ index });
      }

      resultPhrase.push(wordlist[index]);
    }
  );

  return operation === "scramble" ? resultPhrase.reverse() : resultPhrase;
}
