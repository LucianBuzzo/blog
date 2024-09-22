---
title: 'Tag33: An ID System for Humans'
date: '2024-09-22T06:00:00.000Z'
---

I've been thinking a lot lately about how clunky most identification systems are, especially when it comes to human readability and memorization. Take the Social Security Number (SSN) in the US or the National Insurance (NI) number in the UK—they're not exactly user-friendly. They're prone to transcription errors, lack built-in error detection, and are just a pain to work with.

This got me wondering: **Can we create an ID system that's both high-capacity and genuinely user-friendly?** One that you could scribble on a napkin without worrying about mixing up an 'O' and a '0' or an 'I' and a '1'? That's how **Tag33** came into existence.

## Goals of Tag33

The goal was to design an ID system tailored for human use—easy to read, write, and even memorize. To achieve this, I focused on a few key principles:

- **Avoid confusing characters**: Exclude characters that are easily mistaken for one another.
- **Include a checksum**: Provide a built-in way to detect errors in the ID.
- **Ensure high capacity**: Support a vast number of unique IDs for scalability.

## Picking an alhpabet

First off, I needed a character set that's larger than just digits but still easy to distinguish. I settled on a 33 alphanumeric characters:

```
123456789ABCDEFGHJKLMNPQRSTUVWXYZ
```

Notice that I've deliberately left out characters like '0' (zero), 'O' (the letter), 'I', and 'S' to minimize confusion. This set strikes a balance between capacity and readability.

## How Tag33 Works

Each Tag33 ID consists of a 12-character string that makes up the core of the ID, followed by a 2-character checksum that is calculated from the initial 12 characters.
This makes for a 14-character ID in total. With 33 options for each of the 12 positions, we get **33¹²** (about **1.67 × 10²³**) unique combinations, plenty for just about any application.

Here's what some Tag33 IDs look like:

```
9WCLWL7X2HQH7N
A3YPS9T1EQN872
KKERRF16E42D5S
KPQGGDQWZLUJ91
```

For better readability, you can break them into chunks:

```
1MEB 1CK2 QP4G 59
```

That's three blocks of four characters, followed by a two-character checksum.

## Verifying the ID with a Checksum

The checksum is there to catch errors if someone mistypes or miswrites the ID. Here's how it's calculated:

1. **Sum the numerical values** of the 12 initial characters in base-33.
2. **Represent the sum** in base-33.
3. **Append the checksum** to the end of the ID.

This way, if there's a mistake in any of the first 12 characters, the checksum likely won't match, and the error can be flagged immediately.
Base 33 is used so we can represent every character in the character set as a number from 0 to 32, allowing us to perform arithmetic operations on the characters. Conveniently, the sum of the 12 characters will always be less than 33², so it fits within two characters.

## The Napkin Test

One of my benchmarks for Tag33 was the "napkin test"—could someone easily write down their ID on a napkin without messing it up? 
By limiting the number of characters, we reduce room for error. And by excluding easily confused characters, we make it easier to read and write. The short (relative) length makes it easier to memorize, too.
Due to these qualities I can see Tag33 being used in a variety of applications where human readability is important. Things like National ID systems, product serial numbers, or event tickets could all benefit from a system like Tag33.

## Wrapping Up

Designing Tag33 was an interesting exercise in balancing human usability with technical requirements. It's not perfect, but I believe it addresses some of the key shortcomings of existing ID systems. Plus, it's kind of neat to think that an ID system could be both highly scalable and something you could comfortably jot down on a napkin.

You can download Tag33 as an [npm package](https://www.npmjs.com/package/tag33) or check out the repo on [GitHub](https://github.com/LucianBuzzo/tag33).

If you have any thoughts or suggestions, I'd love to hear them!

---