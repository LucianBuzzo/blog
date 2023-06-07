---
title: Solving Water Sort
date: '2023-05-07T06:00:00.521Z'
---

There is a puzzle game that I enjoy playing called "water sort", and it involves sorting colored liquids into containers. There are a lot of different versions out there and you can probably find several different versions for iOS and Android and [even browser based](1)
The game is simple, but it can be difficult to solve. I thought it would be a fun project to try and write a program that can solve the game for me.

In water sort, you have a set of containers with different colored liquids in them. The goal is to sort the liquids into containers of the same color. You can only move one liquid at a time, and you can only move a liquid onto an empty container or onto a container with the same color liquid in it.
Each container holds at maximum 4 units of liquid.

![3 flask problem](3-flask-problem.png)

The example above shows the solution to a problem with 3 flasks and two colors. You can see that the problem is solved by pouring the liquids back and forth until we end up with two containers of the same color.

My first step is to represent the problem as a data structure. To do this, I assign each color to a constant, and then arrange those constant values in an array to represent a container. The beginning of the array represents the bottom of the container, and the end of the array represents the top of the container. Empty containers are represented by an empty array.
I then add the containers to an array to represent the entire problem.

```javascript
const BLUE = 0
const ORANGE = 1

const problem = [[ORANGE, BLUE, ORANGE, BLUE], [BLUE, ORANGE, BLUE, ORANGE], []]
```

By representing the problem as a data structure, I can easily manipulate it with code. For example, I can move a liquid from one container to another by removing it from the end of one array and adding it to the end of another array. I can also check if a container is empty by checking if its array is empty. Because the game has a concept of "pouring" liquids on top of each other, you never add to the beginning of the array or modify a value other than the last one, making this a simple data structure to work with.

Before I can write code that will solve the problem, I need to some utility functions. The first one is `isSolved`, which checks if the problem is solved. This is done by checking if all the containers are empty or if all the containers have the same color liquid in them.

```javascript
const isSolved = containers => {
  for (let i = 0; i < containers.length; i++) {
    // If any container is not empty and not full, the problem is not solved
    if (containers[i].length !== 0 && containers[i].length !== 4) {
      return false
    }
    // If the container contains at least two colors that are not the same, the problem is not solved
    const color = containers[i][0]
    if (containers[i].some(c => c !== color)) {
      return false
    }
  }
  // If none of the above conditions are met, the problem is solved
  return true
}
```

I'll also need a function for pouring one container into another. This is done by removing the last element from one container and adding it to the end of another container. Pouring continues until the source container is empty, another color is reached, or the destination container is full.
For the condition where we continue pouring units of the same color, I simply call the function recursively.

```javascript
const pour = (containers, source, target) => {
  // If the source container is empty, there is nothing to pour
  if (containers[source].length === 0) {
    return containers
  }
  // If the target container is full, there is nothing to pour
  if (containers[target].length === 4) {
    return containers
  }
  // Create a simple copy of the containers array
  const newcontainers = containers.map(tube => tube.slice())
  // Remove the last element from the source container
  const color = newcontainers[source].pop()
  // Push it onto the target container
  newcontainers[target].push(color)
  // If the next element in the source container is the same color, pour again
  if (newcontainers[source][newcontainers[source].length - 1] === color) {
    return pour(newcontainers, source, target)
  } else {
    return newcontainers
  }
}
```

With my code so far, I can represent the game state, pour liquid from one container to another, and check if I've won or not, nice!

Now I need to write code that can determine what possible moves I can make. To put it another way, given a container, what other containers can I pour it into? This is actually a harder problem then it first appears, and the reason for this is that there are a number of game states, where a legal move can be made, but it doesn't advance the game. For example, if I have a container with two colors in it, and I pour it into an empty container, I haven't changed the game state at all. I need to be able to detect these situations and ignore them. When I initially built my solver, I hadn't considered this, and it would get stuck in an infinite loop!

```javascript
const pourTargets = (containers, source) => {
  const sourceClone = containers[source].slice().reverse()
  const color = containers[source][containers[source].length - 1]
  if (!color) {
    return []
  }
  let num = 0
  for (const hue of sourceClone) {
    if (hue === color) num++
    else break
  }
  const secondColor = containers[source][containers[source].length - 2]
  const stackedColor = color === secondColor
  const targets = []
  for (let j = 0; j < containers.length; j++) {
    if (source === j) continue
    if (containers[j].length === 4) continue
    if (containers[j].length === 0) {
      // This avoids the situation where you pour a stack of colors into an empty tube back and forth
      if (containers[source].every(c => c === color)) continue

      targets.push(j)
      continue
    }
    const comparator1 = containers[j][containers[j].length - 1]
    const comparator2 = containers[j][containers[j].length - 2]
    // This avoids the situation where you continually pour the same color back and forth
    if (color === comparator1) {
      // This avoids the situation where you pour a stack of colors into a tube an leave some color remaining
      if (num + containers[j].length > 4) continue
      if (comparator2 && stackedColor && comparator1 === comparator2) continue

      targets.push(j)
    }
  }

  return targets
}
```

[1]: https://html5.gamedistribution.com/rvvASMiM/d77896c3e7e443b7b48ead37718d7b01/index.html?gd_sdk_referrer_url=https%3A%2F%2Fwww.crazygames.com%2Fgame%2Fwater-sort-puzzle&gd_zone_config=eyJwYXJlbnRVUkwiOiJodHRwczovL3d3dy5jcmF6eWdhbWVzLmNvbS9nYW1lL3dhdGVyLXNvcnQtcHV6emxlIiwicGFyZW50RG9tYWluIjoiY3JhenlnYW1lcy5jb20iLCJ0b3BEb21haW4iOiJjcmF6eWdhbWVzLmNvbSIsImhhc0ltcHJlc3Npb24iOmZhbHNlLCJsb2FkZXJFbmFibGVkIjp0cnVlLCJob3N0IjoiaHRtbDUuZ2FtZWRpc3RyaWJ1dGlvbi5jb20iLCJ2ZXJzaW9uIjoiMS41LjE2In0%253D

```

```

```

```

```

```
