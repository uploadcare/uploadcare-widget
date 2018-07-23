/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

const text = `
Global public key not set. Uploads may not work!
Add this to the <head> tag to set your key:

<script>
UPLOADCARE_PUBLIC_KEY = 'your_public_key';
</script>
`

export const publicKey: ValueTransformer<?string, ?string> = (value: ?string) => {
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(text.trim())
  }

  return value
}
