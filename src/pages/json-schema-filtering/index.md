---
title: Definitions for filtering properties in JSON schema
date: "2019-03-02T19:30:32.250Z"
---

Using `additionalProperties: false` to remove undefined fields from an object,
is a feature that crops up regularly in JSON schema libraries, but tends to have
some strange behaviours especially, once the `anyOf` keyword is used.
This article aims to specify the expected functionality of this feature and what
rules it should follow when filtering across different branches of an `anyOf`
keyword.

When filtering; an object that validates against the provided schema will have
any undefined properties removed if `additionalProperties` is set to `false`.
This behaviour prevents the usual `additionalProperties: false` behaviour from
working. As such when validating an object to see if it is valid against the
provided schema, the value of `additionalProperties` should be evaluated as
though it were set to `true`.

For example, this object:

```yaml
foo: bar
baz: buzz
```

Would normally fail validation against the following schema:

```yaml
properties:
    foo:
        type: string
required:
  - foo
additionalProperties: false
```

This is due to the presence of the additional undefined field `baz`. However
because we want to remove undefined fields, rather than simply failing
validation, when the object is validated, a modified version of the schema with
`additionalProperties` set to true should be used. In the example schema above,
internally the filter implementation would validate using the schema:

```yaml
properties:
    foo:
        type: string
required:
  - foo
additionalProperties: true
```

The given object is valid against this modified schema, so the filtering logic
can now run using the original schema, removing the undefined property `baz`
and resulting in a final object like this:

```yaml
foo: bar
```

To make an analogy, filtering behaves like a cookie cutter:
- There must be enough cookie dough to fill the cutter, otherwise, the dough is cannot be cut.
- If there is excess dough then it is cut away by the cutter.

## A note on `required`

If a field is `required`, but it is not defined in `properties`, it should not
be removed. The following two schemas are equivalent:

```yaml
properties: {}
required:
  - foo
additionalProperties: false
```

```yaml
properties:
  foo:
    type: any
    additionalProperties: false
required:
  - foo
additionalProperties: false
```

## Evaluating `anyOf`

When filtering using a schema containing `anyOf`, each branch of the `anyOf`
should be merged with top-level properties to create a new schema, which is then
used to validate the object. If validation passes, then the schema can be used
to filter the object.

### Reconciling `additionalProperties` between `anyOf` branches and the top-level

When merging `additionalProperties`, they are combined using an `AND` operator,
where the values are evaluated topmost first.
The following two schemas are equivalent:

```yaml
# Before merge
type: object
anyOf:
  - type: object
    properties:
      slug:
        type: string
    additionalProperties: true,
    required:
      - slug
required:
  - type
additionalProperties: false
properties:
  type:
    type: string
    const: user
```

```yaml
# After merge
type: object
required:
  - type
  - slug
additionalProperties: false
properties:
  type:
    type: string
    const: user
  slug:
    type: string
```

If the `anyOf` branch has `additionalProperties: false`, then the value of
`properties` in the `anyOf` branch will overwrite the value of `properties` and
the top-level schema. This makes the following two schemas equivalent:

```yaml
# Before merge
type: object
anyOf:
  - type: object
    properties:
      slug:
        type: string
    additionalProperties: false,
    required:
      - slug
required:
  - type
additionalProperties: false
properties:
  type:
    type: string
    const: user
```

```yaml
# After merge
type: object
required:
  - type
  - slug
additionalProperties: false
properties:
  slug:
    type: string
```

This also applies to nested schemas in an `anyOf` branch. This behaviour allows
you to effectively "whitelist" fields inside an object using an `anyOf` branch.
For example:

```yaml
# Before merge
type: object
anyOf:
  - type: object
    properties:
      slug:
        type: string
      data:
        type: object
        properties
          email:
            type: string
        additionalProperties: false,
        required
          - email
    additionalProperties: true,
    required:
      - slug
      - data
required:
  - type
  - data
additionalProperties: false
properties:
  type:
    type: string
    const: user
  data:
    type: object
    properties
      password:
        type: string
    additionalProperties: true,
    required
      - password
```

```yaml
# After merge
type: object
required:
  - type
  - slug
  - data
additionalProperties: false
properties:
  slug:
    type: string
  type:
    type: string
    const: user
  data:
    type: object
    properties
      email:
        type: string
    additionalProperties: false,
    required
      - email
```

### Reconciling multiple matching `anyOf` branches

If more than one branch of `anyOf` matches the object being filtered, then the
matching branches are first merged together, and then merged with the top-level
schema fields.
When reconciling `additionalProperties` between `anyOf` branches, they are
combined using an `OR` operator,

For example, given this object:

```yaml
id: 45678
slug: user-guest
type: user
data: {}
roles: [ 'team' ]
```

And the following schema:

```yaml
type: object
anyOf:
  - type: object
    properties:
      slug:
        const: user-guest
        type: string
    additionalProperties: true
  - type: object
    properties:
      id:
        type: number
    additionalProperties: false
required:
  - type
additionalProperties: true
properties:
  type:
    type: string
    const: user
```

Both branches of the `anyOf` match the object, so they should be merged
together:

```yaml
type: object
properties:
  slug:
    const: user-guest
    type: string
  id:
    type: number
additionalProperties: true
```

This schema is then merged with the top level:

```yaml
type: object
properties:
  type:
    type: string
    const: user
  slug:
    const: user-guest
    type: string
  id:
    type: number
additionalProperties: true
```

This final schema is then used to filter the object, however in this case, the
`additionalProperties` field is `true`, so no fields are removed from the
object.

This behaviour makes the following two calls equivalent

```yaml
Filter (
    type: object
    anyOf:
      - type: object
        properties:
          slug:
            const: user-guest
            type: string
        additionalProperties: true
      - type: object
        properties:
          id:
            type: number
        additionalProperties: false
    required:
      - type
    additionalProperties: true
    properties:
      type:
        type: string
        const: user
    ,
    id: 45678
    slug: user-guest
    type: user
    data: {}
    roles: [ 'team' ]
)
```

```yaml
Filter (
    type: object
    properties:
      type:
        type: string
        const: user
      slug:
        const: user-guest
        type: string
      id:
        type: number
    additionalProperties: true
    ,
    id: 45678
    slug: user-guest
    type: user
    data: {}
    roles: [ 'team' ]
)
```

**NOTE**: This behaviour will change depending on the document being filtered, as
different documents will match different `anyOf` branches.
