# Starter Dough

This is a web component framework designed to fullfill all styling needs. It also has basic behaviour for displaying things like modals. It is designed to work with any front-end framework or library, such as React, Vue, or Angular. It should also work with any other rendering engines, like HandleBars or Razor.

To use it simply import it as a script tag.

```HTML
<script src="https://cdn.jsdelivr.net/npm/starter-dough/dist/bundle.js"></script>
```

The package is also on NPM with all of the source available for anyone that wants to do a custom integration. This is not an optimised process and it is recommended to look at the webpack config and package files from the repro to better understand how to integrated it.

## Themeing

Themes are fully configurable (docs to come). There are default options for colours, padding, breakpoints, text variants. They are as follows.

Colours:
- body
- surface
- contrast
- faded_text
- primary
- info
- success
- warning
- danger

Padding
- block
- small_block
- badge
- input

Text:
- code
- display_h1
- display_h2
- display_h3
- display_h4
- display_h5
- display_h6
- h1
- h2
- h3
- h4
- h5
- h6
- body
- body_large
- small

Breakpoints:
- xs
- sm
- md
- lg
- xl

## Components

Below is a list of the components and their props as well as their children. Some components also have a child. This is a component that can only come as a direct child. They are declared with `p-child`.

- `p-accordion`
  - `p-child`
    - `title` - String
- `p-alert`
  - props
    - `colour` - Colour Name
    - `dismissable` - Boolean (No value)
- `p-badge`
  - props
    - `colour` - Colour Name
    - `top-right` - Boolean (No value)
- `p-breadcrumbs`
  - `p-child`
    - `href` - String (optional)
    - `id` - String (optional)
- `p-button`
  - props
    - `colour` - Colour Name
    - `outline` - Boolean (No value)
    - `href` - String (optional)
    - `type` - String (optional)
- `p-buttongroup`
  - No props but buttons are expected a children
- `p-card`
  - props
    - `img` - String (optional URL)
    - `img-alt` - String (optional should be included with img)
    - `colour` - Colour Name (optional)
    - `flush` - Boolean (No value)
    - `fill` - Boolean (No value)
  - slots
    - `title` - Should only be a span with text
- `p-carousel`
  - props
    - `colour` - Colour Name (optional)
    - `height` - CSS height property
  - `p-child`
    - `img` - Image URL
- `p-code`
  - props
    - `language` - Language name (see highlight.js) (optional)
    - `colour` - Colour Name (optional)
- `p-container`
  - props
    - `full-width` - Boolean (No value)
    - `flush` - Boolean (No value)
    - `fill` - Boolean (No value)
- `p-dropdown`
  - props
    - `target` - The ID of the clickable element
- `p-headrow`
- `p-icon`
  - props
    - `name` - Icon name (See RemixIcon)
    - `size` - CSS widths and height
    - `colour` - Colour Name (optional)
    - `text` - Boolean (No value) If true then will use the text colour
    - `splin` - Make the icon spin (good for loading)
- `p-input`
  - props
    - `name` - String (the form property name)
    - `help` - Help text (optional)
    - `type` - The input type (e.g. text) (optional)
    - `default` - String (the default value) (optional)
    - `placeholder` - String (optional)
    - `disabled` - Boolean (No value)
    - `no-label` - Boolean (No value)
- `p-layout`
  - props
    - `areas` - The slot names for the areas (comma separated)
    - `colours` - Colour Name for each area (comma separated) (optional)
    - For each breakpoint - TOPxHEIGHTxLEFTxWIDTH on grid of 12 (optional)
- `p-link`
  - props
    - `colour` - Colour Name (optional)
    - `href` - Target URL
    - `target` - e.g. \_blank (optional)
    - `disabled` - Boolean (No value)
- `p-list`
  - props
    - `variant` - `ordered` or `unordered`
    - `align` - `left`, `right` or `center` (optional)
    - `no-margin` - Boolean (no value)
- `p-listgroup`
  - props
    - `flush` - Boolean (No value)
  - `p-child`
    - `colour` - Colour Name (optional)
    - `disabled` - Boolean (no value)
    - `href` - Target URL to make this is a link (optional)
    - `target` - e.g. \_blank (optional)
- `p-modal`
  - props
    - `watch` - CSS selector for click listening
    - `large` - Boolean (no value)
    - `colour` - Colour Name (optional)
- `p-nav`
  - props
    - `align` - `left`, `centre`, `right`, or `spread` (optional)
    - `column` - Boolean (no value)
    - `tabs` - Boolean (no value)
  - `p-child`
    - `href` - Target URL (optional)
    - `id` - Element ID (optional)
    - `spy` - CSS selector (optional)
- `p-navbar`
  - props
    - `icon` - URL for bar logo
    - `bg` - Colour Name (optional)
  - `p-child`
    - `href` - Target URL (optional)
    - `id` - Element ID (optional)
  - slots
    - `right` - The right hand side of the nav bar
- `p-offcanvas`
  - props
    - `watch` - CSS selector for click listener
    - `large` - Boolean (no value)
    - `colour` - Colour Name (optional)
- `p-paginator`
  - props
    - `total` - The total number of items
    - `skip` - Number to skip
    - `take` - Number to take
- `p-panel`
  - props
    - `colour` - Colour Name
- `p-popover`
  - props
    - `target` - CSS selector for the element to position around
    - `trigger` - CSS selector for the trigger element
    - `position` - `top`, `bottom`, `left`, or `right` (optional)
    - `on` - `click` or `hover` (optional)
- `p-progress`
  - props
    - `value` - Current percentage of completion (may be comma separated)
    - `colour` - Bar colour (should be comma separated if value is)
    - `labels` - Boolean (no value)
    - `striped` - Boolean (no value)
- `p-row`
  - props
    - `cols` - The number of columns (optional - default 12)
    - `flush` - Boolean (no value)
    - `fill` - `screen` or `container` (optional)
  - `p-child`
    - `centre` - Boolean (no value)
    - `align` - `centre`, `right`, or `left` (optional)
    - For each breakpoint - width out of 12 (optional)
- `p-select`
  - props
    - `label` - String (optional)
    - `name` - String
    - `help` - String (optional)
    - `default` - String (optional)
    - `disabled` - Boolean (no value)
    - `no-label` - Boolean (no value)
- `p-spacer`
  - props
    - `size` - A padding option
- `p-submit`
  - props
    - `colour` - Colour Name
    - `outline` - Boolean (no value)
- `p-table`
  - props
    - `colour` - Colour name (optional)
  - `p-child`
    - `p-child`
- `p-text`
  - props
    - `align` - `left`, `right`, or `center` (optional)
    - `no-margin` - Boolean (no value)
    - `variant` - A text variant
    - For each breakpoint - a text variant (optional)
- `p-textarea`
  - props
    - `name` - String
    - `help` - String (optional)
    - `default` - String (optional)
    - `placeholder` - String (optional)
    - `disabled` - Boolean (no value)
    - `no-label` - Boolean (no value)
    - `code` - Boolean (no value)
    - `height` - Css Height (optional)
- `p-toast`
  - props
    - `position` - `top-left`, `top-right`, `bottom-left`, or `bottom-right`
- `p-toggle`
  - props
    - `name` - String
    - `help` - String (optional)
    - `type` - `radio`, `checkbox`, `toggle`
    - `default` - String (optional)
    - `disabled` - Boolean (no value)
    - `value` - String
    - `colour` - Colour Name
