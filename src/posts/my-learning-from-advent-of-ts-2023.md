---
title: My Learning from Advent of TS 2023
date: 2023-12-11
slug: my-learning-from-advent-of-ts-2023
status: published
---

### Day 1,2,3

East peasy for now.

### Day 4

```typescript
type Address = { address: string; city: string };
type PresentDeliveryList<T> = Record<keyof T, Address>;
```

Learnt that we can make object type using `Record` and `key of`.

### Day 5

```typescript
type SantasList<A extends readonly any[],B extends readonly any[]> = [...A, ...B];
```

You can concat arrays apparently.

### Day 6

No idea !!

### Day 7

```typescript
type AppendGood<T extends Record<string, any>> = {[K in keyof T as `good_${string & K}`] : T[K]};
```

This is string interpolation I believe? Just renaming keys

### Day 8

```typescript
type RemoveNaughtyChildren<T> = {[K in keyof T as K extends `naughty_${string}` ? never : K] : T[K]};
```

Filtering keys out by making them `never` !!

### Day 9

Wtf? How do I reverse a type?

### Day 10

```typescript
type StreetSuffixTester<A extends string, B extends string> = A extends `${string}${B}` ? true : false;
```

Similar to the filtering types above.

### Day 11

This was difficult, below is my **attempt 1.**

```typescript
type SantaListProtector<T> = {readonly [K in keyof T] : (T[K] extends object ? SantaListProtector<T[K]> : T[K])};
```

I am not sure why this is not correct, the recursive type does not evaluate !!

```typescript
{ readonly hacksore: SantaListProtector<() => 'santa'>; readonly somekey: string;}
```

I know the logic is flawed but the evaluation should throw errors and not just stop evaluating at the first level of recursion?

**Second attempt !**

```typescript
type SantaListProtector<T> = T extends object ? {readonly [K in keyof T] : SantaListProtector<T[K]>} : T;
```

now the function got converted into empty type ??? why?

```typescript
{ readonly hacksore: {}>; readonly somekey: string;}
```
