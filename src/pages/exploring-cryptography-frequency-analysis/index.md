---
title: Exploring Cryptography - Frequency Analysis pt.2
date: '2023-03-19T15:25:41.977Z'
---

In [my previous post](https://lucianbuzzo.com/exploring-cryptography-frequency-analysis/), I explored frequency analysis and how it can be used to break simple substitution ciphers, specifically the Caesar cipher. I also highlighted how the Caesar cipher can be cracked using brute force and a word list. Using a word list didn't feel particularly satisfying to me though, so in this post I'll look at breaking the Caesar cipher using frequency analysis alone.

To begin with, I need a baseline letter frequency table to compare against. As before, I'm going to use the [frequency table from Cornell's website](https://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html), adjusted to provide values between 0 and 1.

```js
const STANDARD_FREQUENCIES = {
  a: 0.0812,
  b: 0.0149,
  c: 0.0271,
  d: 0.0432,
  e: 0.1202,
  f: 0.023,
  g: 0.0203,
  h: 0.0592,
  i: 0.0731,
  j: 0.001,
  k: 0.0069,
  l: 0.0398,
  m: 0.0261,
  n: 0.0695,
  o: 0.0768,
  p: 0.0182,
  q: 0.0011,
  r: 0.0602,
  s: 0.0628,
  t: 0.091,
  u: 0.0288,
  v: 0.0111,
  w: 0.0209,
  x: 0.0017,
  y: 0.0211,
  z: 0.0007,
}
```

This gives us a baseline to compare against, but we need to normalize the frequencies of the ciphertext to match the standard frequencies. To do this, we need to count the number of occurrences of each letter in the ciphertext, and then divide each count by the total number of letters in the ciphertext (this is the same function used previously, copied here for clarity).

```js
function frequencyAnalysis(text) {
  const processedText = text.replace(/[^a-zA-Z]/g, '').toLowerCase()
  const charFrequency = {}
  for (let char of processedText) {
    if (charFrequency[char]) {
      charFrequency[char]++
    } else {
      charFrequency[char] = 1
    }
  }
  const totalChars = processedText.length
  for (let char in charFrequency) {
    charFrequency[char] = charFrequency[char] / totalChars
  }
  return charFrequency
}
```

We can now take a ciphertext, and generate a set of letter frequencies for it. We can then compare these frequencies to the standard frequencies and see if the results are similar. An intuitive way to understand this is to visualize the sets of frequencies as a bar chart. If the high points and low points on the bar chart correspond to the same letters, then the two sets of frequencies are similar and it's likely that we have the correct [key](<https://en.wikipedia.org/wiki/Key_(cryptography)>). Just for fun, lets make a simple aasci bar chart generator:

```js
const aasciBarChart = data => {
  const max = Math.max(...Object.values(data))
  const entries = Object.entries(data).sort(([a], [b]) => (a < b ? -1 : 1))

  entries.forEach(([key, value]) => {
    const length = Math.round((value / max) * 50)
    const bar = '▒'.repeat(length)
    console.log(`${key}: ${bar}`)
  })
}
```

If we plug in the standard frequencies, we get the following chart:

```
a: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
b: ▒▒▒▒▒▒
c: ▒▒▒▒▒▒▒▒▒▒▒
d: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
e: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
f: ▒▒▒▒▒▒▒▒▒▒
g: ▒▒▒▒▒▒▒▒
h: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
i: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
j:
k: ▒▒▒
l: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
m: ▒▒▒▒▒▒▒▒▒▒▒
n: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
o: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
p: ▒▒▒▒▒▒▒▒
q:
r: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
s: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
t: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
u: ▒▒▒▒▒▒▒▒▒▒▒▒
v: ▒▒▒▒▒
w: ▒▒▒▒▒▒▒▒▒
x: ▒
y: ▒▒▒▒▒▒▒▒▒
z:
```

In the chart you can see a big spike on the letters `e`, `t`, `a` and `o`, as they are the most commonly occurring letters. Conversely we can also see dips on the least common letters: `x`, `q`, `j` and `z`.

Now lets plug in a ciphertext encoded with a Caesar cipher using a key of 3:

```
a: ▒
b: ▒▒▒▒▒▒
c:
d: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
e: ▒▒▒▒▒▒▒▒▒▒
f: ▒▒▒▒▒▒▒▒▒▒▒▒
g: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
h: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
i: ▒▒▒▒▒▒▒▒▒▒
j: ▒▒▒▒▒▒▒▒
k: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
l: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
m: ▒
n: ▒▒▒▒▒▒▒
o: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
p: ▒▒▒▒▒▒▒▒
q: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
r: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
s: ▒▒▒▒▒▒
t:
u: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
v: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
w: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
x: ▒▒▒▒▒▒▒▒▒▒▒
y: ▒▒▒
z: ▒▒▒▒▒▒▒▒
```

As you can see our peaks have shifted (as expected), instead of seeing a peak on `e` we now see a peak on `h`. This is because the Caesar cipher shifts the alphabet by 3, so `e` becomes `h`, `t` becomes `w`, `a` becomes `d` and `o` becomes `r`.

We can now right an algorithm that iterates through all of the 26 possible keys for a Caesar cipher and finds the best match based on how close the letter frequency of deciphered text matches the letter frequency of the English language. For each letter in the frequency set generated for the deciphered text, we calculate the difference between the letter frequency of the deciphered text and the letter frequency of the English language. We then sum all of these differences to get a total difference for the deciphered text. The key that produces the lowest total difference is the most likely key for the Caesar cipher. We can utilize `Math.abs` here to make sure we always get a positive number when checking the difference.

```js
function crackWithFrequencyAnalysis(cipherText) {
  let bestShift = 0
  let bestScore = 100

  for (let shift = 0; shift < alphabet.length; shift++) {
    const decipheredText = caesarDecipher(shift, cipherText)
    const letterFrequency = frequencyAnalysis(decipheredText)
    const score = Object.keys(letterFrequency).reduce((acc, letter) => {
      const frequency = letterFrequency[letter]
      const standardFrequency = STANDARD_FREQUENCIES[letter]
      return acc + Math.abs(frequency - standardFrequency)
    }, 0)

    if (score < bestScore) {
      bestScore = score
      bestShift = shift
    }
  }

  return caesarDecipher(bestShift, cipherText)
}
```

Let's see how this works using our example ciphertext and Caesar algorithm from the previous article:

```js
const cipherText = caesarCipher(`
    The primary thing when you take a sword in your hands is your intention to cut the enemy, 
    whatever the means. Whenever you parry, hit, spring, strike or touch the enemy's cutting 
    sword, you must cut the enemy in the same movement. It is essential to attain this. 
    If you think only of hitting, springing, striking or touching the enemy, you will not be 
    able actually to cut him.
`)
const result = crackWithFrequencyAnalysis(cipherText)
console.log(result)
// -> theprimarythingwhenyoutakeaswordinyourhandsisyourintentiontocuttheenemywhateverthemeanswheneveryouparryhitspringstrikeortouchtheenemyscuttingswordyoumustcuttheenemyinthesamemovementitisessentialtoattainthisifyouthinkonlyofhittingspringingstrikingortouchingtheenemyyouwillnotbeableactuallytocuthim
```

Nice! We've successfully cracked the Caesar cipher using frequency analysis, without having to rely on word lists. This method works best with big blocks of text, so it's not ideal for cracking short messages. I'd like to create an experiment to see, on average, what length of text is required for the cracking algorithm to have 100% success rate. To do this, I'll use random blocks of text generated from https://randomtextgenerator.com/, iteratively increasing the length of the text being used. I can then run the cracking algorithm and see if it successfully cracks the cipher (I'll refactor the cracking algorithm to return the key instead of the deciphered text). If I get 100% of the samples cracked for a given length of text, I exit the loop and return the length of text that was used.

```js
const KEY = 3
const SAMPLE_SIZE = 100
const ITERATIONS = 100

const lengthForAccuracy = []

while (lengthForAccuracy.length < ITERATIONS) {
  for (let i = 10; i < 10000; i += 10) {
    let matches = 0
    let samples = 0
    // Run SAMPLE_SIZE random samples of `i` length
    while (samples < SAMPLE_SIZE) {
      // Random number between 0 and the length of the text minus i
      const j = Math.floor(Math.random() * (text.length - i))
      samples++
      // Get a random sample of `i` length
      const sample = caesarCipher(KEY, text.slice(j, j + i))
      // Check to see if the crack was correct
      const crack = crackWithFrequencyAnalysis(sample)
      if (crack === KEY) {
        matches++
      }
    }
    // If we have 100% success, exit the loop
    if (matches === samples) {
      lengthForAccuracy.push(i)
      break
    }
  }
}

const average =
  lengthForAccuracy.reduce((acc, val) => acc + val, 0) /
  lengthForAccuracy.length
console.log(average)
```

This takes a while to run, but I get an average length of text required for 100% success of 82.6 characters with my test data, which I've [posted in a gist here](https://gist.github.com/LucianBuzzo/626a08a14ed48169e6263522d8722bbf). This is a somewhat naive approach, and it depends heavily on the text being analysed, but it's a good starting point and I think it shows that frequency analysis can work on even short messages (82 characters is not a lot!). As a follow up to this exercise I'd like to see how this approach can be generalized to other substitution ciphers, where the key, and even method is unknown.

I hope you've enjoyed this article, and learned something along the way. If you have any questions or comments, please let me know in the comments below, or hit me up on Twitter [@LucianBuzzo](https://twitter.com/LucianBuzzo).

## Further reading

- [Wikipedia: Cipher](https://en.wikipedia.org/wiki/Cipher)
- [Wikipedia: Substitution cipher](https://en.wikipedia.org/wiki/Substitution_cipher)
- [Wikipedia: Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher)
- [Wikipedia: Frequency analysis](https://en.wikipedia.org/wiki/Frequency_analysis)
- [Wikipedia: Cryptanalysis](https://en.wikipedia.org/wiki/Cryptanalysis)
- [Wikipedia: Brute force attack](https://en.wikipedia.org/wiki/Brute-force_attack)
- [Wikipedia: Dictionary attack](https://en.wikipedia.org/wiki/Dictionary_attack)
- [In Code: A Mathematical Journey](https://books.google.co.uk/books/about/In_Code.html)
- [The Code Book](https://simonsingh.net/books/the-code-book/)
