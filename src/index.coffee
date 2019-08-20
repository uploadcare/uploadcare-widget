import template from './template.ejs'

import { version } from '../package.json'

export { version }

parseHTML = (str) ->
  tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  tmp.body.children;

external = {
  t: () -> 'translation logic here'
}

export fn = () -> parseHTML(template(external))
