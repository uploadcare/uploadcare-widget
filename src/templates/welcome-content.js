import { html } from '../utils/html.ts'

const welcomeContent = html`
  <div class="uploadcare--tab__content">
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title"
    >
      Hello!
    </div>

    <div class="uploadcare--text">
      Your

      <a class="uploadcare--link" href="https://uploadcare.com/dashboard/">
        public key
      </a>

      is not set.
    </div>

    <div class="uploadcare--text">
      Add this to the &lt;head&gt; tag to start uploading files:
    </div>

    <div class="uploadcare--text uploadcare--text_pre">
      &lt;script&gt; UPLOADCARE_PUBLIC_KEY = 'your_public_key'; &lt;/script&gt;
    </div>
  </div>
`

export { welcomeContent }
