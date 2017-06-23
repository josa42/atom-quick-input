# atom-quick-input

**Work in progress**

## Example: Simple

```JavaScript
'use babel';

import quickInput from 'atom-quick-input';

const value = await quickInput()
if (value) {
  console.log('value', value)
}
```

## Example: Pre filled

```JavaScript
'use babel';

import quickInput from 'atom-quick-input';

const value = await quickInput('Foo')
if (dvalue) {
  console.log('value', value)
}
```

## Atom packages using this library

- [readme](https://atom.io/packages/pandoc-convert)

## License

[The MIT License](LICENSE.md)
