# Search component

[![npm version](https://badge.fury.io/js/%40visual-framework%2Fvf-search.svg)](https://badge.fury.io/js/%40visual-framework%2Fvf-search)

## About

The `vf-search` component is a form component that can be used for for the front-end to search your site.

## Usage

### Responsive Search

This is the default search component that can be used to search your site. When the viewport size is below 600px the `vf-button` replaces the text with an icon so that it can allow the input to use more space.

### Mini Search

This is very much a work-in-progress prototype and **not to be used**.

### Search Container

To be used when searching pages, this container should sit below the `vf-hero` (and related `vf-navigation` where applicable). The code example shows that the `vf-form` is wrapped in a `vf-container` (this sectioning component has not been created, yet, but the base CSS is available as part of `vf-search`).

### Results

This shows how auto-suggest or autocomplete results should be displayed. There is no native HTML functionality for this and you will need to provide the JavaScript that is relevant to your project for it to work.

###

**note:** Version `2.0.0` of the `vf-search` has no maximum width and will fill the space of it's parent. Because of this it is recommended to make sure the component is not too wide by wrapping it in the `embl-grid` with the `--centered-content` variant. If you wish to use ths `vf-search` with `vf-grid` you will need to make use the `vf-search` component also has an appropraite `.vf-u-grid__col--span` class.

You can enable `autofocus` on the search element, but should only do so if most users intend to search on the page.

## Install

This repository is distributed with [npm](https://www.npmjs.com/). After [installing npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install), you can install with this command.

```
$ yarn add --dev @visual-framework/vf-search
```

### Sass/CSS

The style files included are written in [Sass](https://sass-lang.com/). If you're using a VF-core project, you can import it like this:

```
@import "@visual-framework/vf-search/index.scss";
```

Make sure you import Sass requirements along with the modules. You can use a [project boilerplate](https://stable.visual-framework.dev/building/) or the [`vf-sass-starter`](https://stable.visual-framework.dev/components/vf-sass-starter/)

## Help

- [Read the Visual Framework troubleshooting](https://stable.visual-framework.dev/troubleshooting/)
- [Open a ticket](https://github.com/visual-framework/vf-core/issues)
- [Chat on Slack](https://join.slack.com/t/visual-framework/shared_invite/enQtNDAxNzY0NDg4NTY0LWFhMjEwNGY3ZTk3NWYxNWVjOWQ1ZWE4YjViZmY1YjBkMDQxMTNlNjQ0N2ZiMTQ1ZTZiMGM4NjU5Y2E0MjM3ZGQ)
