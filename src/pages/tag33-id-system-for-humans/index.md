---
title: 'Tag33: An ID System for Humans'
date: '2024-09-22T06:00:00.000Z'
---

I've been thinking a lot lately about how clunky most identification systems are, especially when it comes to human readability and memorization. Take the Social Security Number (SSN) in the US or the National Insurance (NI) number in the UK—they're not exactly user-friendly. They're prone to transcription errors, lack built-in error detection, and are just a pain to work with.

This got me wondering: **Can we create an ID system that's both high-capacity and genuinely user-friendly?** One that you could scribble on a napkin without worrying about mixing up an 'O' and a '0' or an 'I' and a '1'? That's how **Tag33** came into existence.

## The Idea Behind Tag33

The goal was to design an ID system tailored for human use—easy to read, write, and even memorize. To achieve this, I focused on a few key principles:

- **Avoid confusing characters**: Exclude characters that are easily mistaken for one another.
- **Include a checksum**: Provide a built-in way to detect errors in the ID.
- **Ensure high capacity**: Support a vast number of unique IDs for scalability.

## Building the Base-33 Character Set

First off, I needed a character set that's larger than just digits but still easy to distinguish. I settled on a **base-33 alphanumeric scheme** using the following characters:

```
123456789ABCDEFGHJKLMNPQRSTUVWXYZ
```

Notice that I've deliberately left out characters like '0' (zero), 'O' (the letter), 'I', and 'S' to minimize confusion. This set strikes a balance between capacity and readability.

## Structuring the Tag33 Identifier

Each Tag33 ID consists of:

- **12-character string**: The core of the ID.
- **2-character checksum**: Calculated from the initial 12 characters.

This makes for a 14-character ID in total. With 33 options for each of the 12 positions, we get **33¹²** (about **1.67 × 10²³**) unique combinations—plenty for just about any application.

### Example IDs

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

## Calculating the Checksum

The checksum is there to catch errors if someone mistypes or miswrites the ID. Here's how it's calculated:

1. **Sum the numerical values** of the 12 initial characters in base-33.
2. **Represent the sum** in base-33.
3. **Append the checksum** to the end of the ID.

This way, if there's a mistake in any of the first 12 characters, the checksum likely won't match, and the error can be flagged immediately.

## Why Traditional ID Systems Fall Short

Most existing ID systems weren't designed with human factors in mind:

- **Confusing Characters**: They often include characters that look alike, increasing the chance of errors.
- **No Error Detection**: Systems like SSNs lack built-in mechanisms to catch mistakes.
- **Limited Scalability**: As populations grow, systems without enough unique combinations run into issues.

For example, the SSN is just nine digits without a checksum, making it both error-prone and insufficient for a growing population. The UK's NI number mixes letters and numbers but doesn't avoid confusable characters.

## The Napkin Test

One of my benchmarks for Tag33 was the "napkin test"—could someone easily write down their ID on a napkin without messing it up? With its carefully chosen character set and built-in checksum, Tag33 passes this test:

- **Distinct Characters**: By avoiding look-alike characters, we reduce transcription errors.
- **Manageable Length**: At 14 characters (with spaces, if you like), it's not overwhelming.
- **Immediate Validation**: The checksum helps catch mistakes right away.

## Potential Uses for Tag33

Tag33 isn't just theoretical; it has practical applications:

- **National ID Systems**: A scalable, user-friendly alternative that could work globally.
- **Product Serial Numbers**: Easier for consumers to read and enter correctly.
- **Event Tickets and Passes**: Quick to write down, easy to verify, and hard to fake.

## Wrapping Up

Designing Tag33 was an interesting exercise in balancing human usability with technical requirements. It's not perfect, but I believe it addresses some of the key shortcomings of existing ID systems. Plus, it's kind of neat to think that an ID system could be both highly scalable and something you could comfortably jot down on a napkin.

You can download Tag33 as an [npm package](https://www.npmjs.com/package/tag33) or check out the repo on [GitHub](https://github.com/LucianBuzzo/tag33).

If you have any thoughts or suggestions, I'd love to hear them!

---