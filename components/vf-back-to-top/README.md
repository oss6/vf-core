# Back to top component

[![npm version](https://badge.fury.io/js/%40visual-framework%2Fvf-back-to-top.svg)](https://badge.fury.io/js/%40visual-framework%2Fvf-back-to-top)

## About

An anchor or JavaScript button to scroll the  user to top of the current page, or to a target element.

## Usage

Only use on component per page, multiple "back to top" links are [not recommended](https://www.nngroup.com/articles/back-to-top).

### Inline variant

The inline variant can be used without JavaScript and placed at the bottom of content or the page.

### Floating variant

Te floating variant is recommended for this component, which appears floating at the bottom right of page. It will appear once the user has scrolled down to 100% of the page height. This requires JavaScript to function.

## Install

This repository is distributed with [npm][https://www.npmjs.com/]. After [installing npm][https://www.npmjs.com/get-npm] and [yarn](https://classic.yarnpkg.com/en/docs/install), you can install `vf-back-to-top` with this command.

```
$ yarn add --dev @visual-framework/vf-back-to-top
```

### JS

You should import this component in `./components/vf-component-rollup/scripts.js` or your other JS process:

```js
import { vfBackToTop } from 'vf-back-to-top/vf-back-to-top';
// Or import directly
// import { vfBackToTop } from '../components/raw/vf-back-to-top/vf-back-to-top.js';
vfBackToTop(); // invoke it
```

### Sass/CSS

The style files included are written in [Sass](https://sass-lang.com/). If you're using a VF-core project, you can import it like this:

```
@import "@visual-framework/vf-back-to-top/index.scss";
```

Make sure you import Sass requirements along with the modules. You can use a [project boilerplate](https://stable.visual-framework.dev/building/) or the [`vf-sass-starter`](https://stable.visual-framework.dev/components/vf-sass-starter/)

## Help

- [Read the Visual Framework troubleshooting](https://stable.visual-framework.dev/troubleshooting/)
- [Open a ticket](https://github.com/visual-framework/vf-core/issues)
- [Chat on Slack](https://join.slack.com/t/visual-framework/shared_invite/enQtNDAxNzY0NDg4NTY0LWFhMjEwNGY3ZTk3NWYxNWVjOWQ1ZWE4YjViZmY1YjBkMDQxMTNlNjQ0N2ZiMTQ1ZTZiMGM4NjU5Y2E0MjM3ZGQ)
