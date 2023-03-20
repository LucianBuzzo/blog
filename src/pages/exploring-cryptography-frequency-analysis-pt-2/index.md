---
title: Exploring Cryptography - Frequency Analysis
date: '2023-03-20T10:25:06.251Z'
---

In this article we will be looking at a simple technique for breaking a simple substitution cipher. This technique is called frequency analysis, and is one of the simplest techniques for breaking a simple substitution cipher. It is also one of the most effective, and is often used as a first step in breaking a cipher.

A simple substitution cipher is one where each letter in the plaintext is replaced with a different letter in the ciphertext. A classic example of a simple substitution cipher is the Caesar cipher, where each letter in the plaintext is replaced with the letter 3 places to the right in the alphabet. For example, the letter `a` would be replaced with the letter `d`, the letter `b` would be replaced with the letter `e`, and so on.

Unfortunately, this approach to encryption, where we substitute each letter in the plaintext with a different letter in the ciphertext, is not very secure. This is because it is very easy to break. All we need to do is look at the frequency of letters in the ciphertext, and then compare that to the frequency of letters in the English language. We can then use this information to work out which letters in the ciphertext correspond to which letters in the plaintext. This applies to any simple substitution cipher, not just the Caesar cipher, so even if we don't know which cipher was used, we can still break it. This applies to ciphers that use a different shift distance or a different alphabet (even made up symbols), as long as we know the language that the plaintext was written in.

## Frequency Analysis

It's important to note t the most common letter is typically considered to be `e`, followed by `t`, `a`, `o`, `i`, `n`, `s`, `h`, `r`, and `d`. The least common letter is typically considered to be `q`, followed by `z`, `x`, `j`, `k`, `v`, `b`, `p`, `y`, and `w`. It's important to note that letter frequency will vary depending on the text sampled, but this is a good approximation for the English language.
For this article, I'm going to be using the [frequency data from Cornell's cryptography course](https://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html), which is based on a sample of 40,000 words from the English language.
By comparing the frequency of letters in the ciphertext to the frequency of letters in the English language, we can work out which letters in the ciphertext correspond to which letters in the plaintext. For example, if we look at the frequency of letters in the ciphertext, and we see that the letter `b` is the most common, we can begin to crack the cipher by assuming that the letter `b` in the ciphertext corresponds to the letter `e` in the plaintext (`e` being the most common letter in plain English). We can then repeat this process for the rest of the letters in the ciphertext, and we should be able to work out which letters in the ciphertext correspond to which letters in the plaintext.

If we know that a Caesar cipher was used, we can use the frequency analysis technique to work out the shift distance. For example, if we know that the letter `b` in the ciphertext corresponds to the letter `e` in the plaintext, we can work out that the shift distance is 3. This is because the letter `b` is 3 letters to the right of the letter `e` in the alphabet. We can then use this information to decrypt the ciphertext.

## Breaking the Caesar Cipher

Let's start with a simple Caesar cipher implementation in JavaScript:

```js
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

function caesarCipher(text, shift = 3) {
  let result = []
  const input = text.toLowerCase()

  for (let i = 0; i < input.length; i++) {
    const letter = input[i]
    if (alphabet.includes(letter)) {
      const index = alphabet.indexOf(letter)
      const newIndex = (index + shift) % alphabet.length
      result.push(newIndex)
    }
  }

  return result.map(index => alphabet[index]).join('')
}
```

Using this function, we can encrypt a text using the Caesar cipher:

```js
const cipherText = caesarCipher(`
    The primary thing when you take a sword in your hands is your intention to cut the enemy, 
    whatever the means. Whenever you parry, hit, spring, strike or touch the enemy's cutting 
    sword, you must cut the enemy in the same movement. It is essential to attain this. 
    If you think only of hitting, springing, striking or touching the enemy, you will not be 
    able actually to cut him.
`)
```

To produce the following ciphertext:

```
wkhsulpdubwklqjzkhqbrxwdnhdvzruglqbrxukdqgvlvbrxulqwhqwlrqwrfxwwkhhqhpbzkdwhyhuwkhphdqvzkhqhyhubrxsduubklwvsulqjvwulnhruwrxfkwkhhqhpbvfxwwlqjvzrugbrxpxvwfxwwkhhqhpblqwkhvdphpryhphqwlwlvhvvhqwldowrdwwdlqwklvlibrxwklqnrqobriklwwlqjvsulqjlqjvwulnlqjruwrxfklqjwkhhqhpbbrxzlooqrwehdeohdfwxdoobwrfxwklp
```

The next thing we want to do is write a function that can perform frequency analysis on a given ciphertext:

```js
function frequencyAnalysis(text) {
  // Process the text: remove special characters, convert to lowercase
  const processedText = text.replace(/[^a-zA-Z]/g, '').toLowerCase()

  // Initialize an empty object to store the character frequencies
  const charFrequency = {}

  // Iterate through each character in the processed text
  for (let char of processedText) {
    // If the character is already in the object, increment its count
    if (charFrequency[char]) {
      charFrequency[char]++
    } else {
      // If the character is not in the object, add it with a count of 1
      charFrequency[char] = 1
    }
  }

  // Calculate the total number of characters
  const totalChars = processedText.length

  // Iterate through each character in the object and calculate the frequency
  for (let char in charFrequency) {
    charFrequency[char] = charFrequency[char] / totalChars
  }

  return charFrequency
}
```

This function returns a map of each character in the ciphertext to its frequency. For example, if we pass the ciphertext from the previous section into this function, we get the following output:

```js
{
  w: 0.125,
  k: 0.06418918918918919,
  h: 0.10810810810810811,
  s: 0.013513513513513514,
  u: 0.05405405405405406,
  l: 0.09121621621621621,
  p: 0.037162162162162164,
  d: 0.0472972972972973,
  b: 0.05067567567567568,
  q: 0.09121621621621621,
  j: 0.02702702702702703,
  z: 0.02027027027027027,
  r: 0.07094594594594594,
  x: 0.05067567567567568,
  n: 0.013513513513513514,
  v: 0.05405405405405406,
  g: 0.010135135135135136,
  f: 0.02364864864864865,
  y: 0.010135135135135136,
  o: 0.02364864864864865,
  i: 0.006756756756756757,
  e: 0.006756756756756757
}
```

From this analysis, we can see that the most common letter in the ciphertext is `w`, followed by `h`, `q` and `l`. Assuming that we don't have prior knowledge of the shift distance used in the Caesar cipher, we can start by assuming that one of these 4 letters corresponds to the letter `e` in the plaintext. We can then use this information to work out the shift distance. For example, if we assume that the letter `w` in the ciphertext corresponds to the letter `e` in the plaintext, we can work out that the shift distance is 18. This is because the letter `w` is 18 letters to the right of the letter `e` in the alphabet. We can then use this information to decrypt the ciphertext.

Let's write a function that will decipher a Caesar cipher for us:

```js
const caesarDecipher = (shift, text) => {
  // Invert the original shift distance to get the plaintext
  return caesarCipher(alphabet.length - shift, text)
}
```

We can now use this function to try and decipher the ciphertext from the previous section by calculating the shift distance for each of the 4 most common letters in the ciphertext. If any of these shift distances produce readable text, we can assume that we have found the correct shift distance.

```js
// Utility function for finding shift distance for `e` from a given letter
const findShiftDistance = letter => {
  const index = alphabet.indexOf(letter)
  return (index - alphabet.indexOf('e') + alphabet.length) % alphabet.length
}
// Find the shift distance for each of the 4 most common letters
const shiftDistances = Object.keys(frequencyAnalysis(cipherText))
  .sort(
    (a, b) =>
      frequencyAnalysis(cipherText)[b] - frequencyAnalysis(cipherText)[a]
  )
  .slice(0, 4)
  .map(findShiftDistance)

// Try each shift distance and print the result
shiftDistances.forEach(shift => {
  console.log('checking shift distance', shift)
  console.log(caesarDecipher(shift, cipherText))
})
```

This will print the following output:

```
checking shift distance 18
espactxlcjestyrhspyjzfelvpldhzcotyjzfcslyodtdjzfctyepyetzyeznfeesppypxjhslepgpcespxplydhspypgpcjzfalccjstedactyrdectvpzcezfnsesppypxjdnfeetyrdhzcojzfxfdenfeesppypxjtyespdlxpxzgpxpyetetdpddpyetlwezleeltyestdtqjzfestyvzywjzqsteetyrdactyrtyrdectvtyrzcezfnstyresppypxjjzfhtwwyzemplmwplneflwwjeznfestx
checking shift distance 3
theprimarythingwhenyoutakeaswordinyourhandsisyourintentiontocuttheenemywhateverthemeanswheneveryouparryhitspringstrikeortouchtheenemyscuttingswordyoumustcuttheenemyinthesamemovementitisessentialtoattainthisifyouthinkonlyofhittingspringingstrikingortouchingtheenemyyouwillnotbeableactuallytocuthim
checking shift distance 7
pdalneiwnupdejcsdajukqpwgawosknzejukqndwjzoeoukqnejpajpekjpkyqppdaajaiusdwparanpdaiawjosdajaranukqlwnnudepolnejcopnegaknpkqydpdaajaiuoyqppejcosknzukqiqopyqppdaajaiuejpdaowiaikraiajpepeoaooajpewhpkwppwejpdeoebukqpdejgkjhukbdeppejcolnejcejcopnegejcknpkqydejcpdaajaiuukqsehhjkpxawxhawypqwhhupkyqpdei
checking shift distance 12
kyvgizdripkyzexnyvepflkrbvrjnfiuzepfliyreujzjpflizekvekzfekftlkkyvvevdpnyrkvmvikyvdvrejnyvevmvipflgriipyzkjgizexjkizbvfikfltykyvvevdpjtlkkzexjnfiupfldljktlkkyvvevdpzekyvjrdvdfmvdvekzkzjvjjvekzrckfrkkrzekyzjzwpflkyzebfecpfwyzkkzexjgizexzexjkizbzexfikfltyzexkyvvevdppflnzccefksvrscvrtklrccpkftlkyzd
```

We can see that when the shift distance of 3 is used, the plaintext is readable. This means that the shift distance is 3, result!

## Removing the Human Element

But surely we can do better than this? Currently we need to use some human intuition to detect the shift distance, by looking at the deciphered output. What if we could do this automatically?
A simple approach that would cover many cases would be to use a word list, and check if the deciphered output contains any words from the word list. If it does, we can assume that we have found the correct shift distance. We can even try each of the shift distances that we calculated in the previous section, and see if any of them produce readable output, and then score the output based on how many readable words we find.
I'll use ["Ogden's basic english word list"](http://ogden.basic-english.org/words.html) for this code. This is a list of 850 words that are commonly used in the English language. We can use this list to check if the deciphered output contains any words from the list.

```js
function crackCaesarCipher(cipherText) {
  // Try each shift distance and print the result
  let bestScore = 0
  let bestShift = 0

  for (let i = 1; i < alphabet.length; i++) {
    const shift = i
    const decipheredText = caesarDecipher(shift, cipherText)
    const readableWords = words.filter(word => decipheredText.includes(word))
    const score = readableWords.length / words.length
    if (score > bestScore) {
      bestScore = score
      bestShift = shift
    }
  }

  return bestShift
}
```

This brute force approach will reliably find the correct shift distance for most cases, including cases where the plaintext [doesn't contain the letter `e`](<https://en.wikipedia.org/wiki/Gadsby_(novel)>). However, it is not perfect. For example, if the ciphertext contains a word that is not in the word list, it will not be detected. Using "1337speak" and replacing letters for numbers in your plaintext could defeat this decryption method. Additionally, intentionally leaving spelling mistakes in your plaintext could also defeat this method. It's also worth noting that this method is not very efficient, as it will try every possible shift distance, even if the ciphertext doesn't contain any words from the word list.

What's next? I'd love to generalize this word list solution so that it can handle partial word matches and spelling mistakes. I'd also like to try and find a way to detect the shift distance without using a word list (possibly by going back to a frequency analysis of the plaintext) and expand it to cover other single substitution ciphers. If you have any ideas, please let me know!
