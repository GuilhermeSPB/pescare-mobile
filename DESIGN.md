---
name: Pescare
description: Category-standard Material 3 for artisanal fishers, in the Pescare Admin palette, upsized so no text reads below 16.
colors:
  primary: "#2563EB"
  primaryPressed: "#1D4ED8"
  onPrimary: "#FFFFFF"
  primaryContainer: "#EFF6FF"
  onPrimaryContainer: "#1E40AF"
  primaryTrack: "#BFDBFE"
  surface: "#FFFFFF"
  onSurface: "#111827"
  onSurfaceVariant: "#4B5563"
  outline: "#6B7280"
  outlineVariant: "#E5E7EB"
  error: "#B91C1C"
  errorContainer: "#FEF2F2"
  disabledContainer: "rgba(17, 24, 39, 0.12)"
  disabledContent: "rgba(17, 24, 39, 0.38)"
typography:
  display:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: "60px"
    letterSpacing: "-0.5px"
  tagline:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0px"
  headline:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "36px"
    letterSpacing: "0px"
  title:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: "28px"
    letterSpacing: "0px"
  bodyLarge:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "0px"
  body:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0.15px"
  label:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0.1px"
  fieldLabel:
    fontFamily: "Roboto, SF Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "20px"
    letterSpacing: "0px"
rounded:
  field: "4px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  xxxl: "48px"
components:
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.onPrimary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "56px"
  button-filled-pressed:
    backgroundColor: "{colors.primaryPressed}"
  button-filled-disabled:
    backgroundColor: "{colors.disabledContainer}"
    textColor: "{colors.disabledContent}"
  button-filled-inverse:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "56px"
  button-filled-inverse-pressed:
    backgroundColor: "{colors.primaryContainer}"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "56px"
  button-outlined-inverse:
    backgroundColor: "transparent"
    textColor: "{colors.onPrimary}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 12px"
    height: "48px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.onSurfaceVariant}"
    rounded: "{rounded.full}"
    size: "48px"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.onSurface}"
    typography: "{typography.bodyLarge}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
    height: "56px"
  text-field-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.onSurfaceVariant}"
    typography: "{typography.fieldLabel}"
    padding: "0 4px"
  text-field-label-focused:
    textColor: "{colors.primary}"
  text-field-label-error:
    textColor: "{colors.error}"
  text-field-supporting:
    textColor: "{colors.onSurfaceVariant}"
    typography: "{typography.body}"
    padding: "0 16px"
  text-field-supporting-error:
    textColor: "{colors.error}"
  top-app-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.onSurface}"
    typography: "{typography.title}"
    padding: "0 4px"
    height: "64px"
  progress-track:
    backgroundColor: "{colors.primaryTrack}"
    rounded: "2px"
    height: "4px"
  progress-indicator:
    backgroundColor: "{colors.primary}"
    rounded: "2px"
    height: "4px"
  progress-label:
    textColor: "{colors.onSurfaceVariant}"
    typography: "{typography.body}"
  form-headline:
    textColor: "{colors.onSurface}"
    typography: "{typography.headline}"
  form-example:
    textColor: "{colors.onSurfaceVariant}"
    typography: "{typography.bodyLarge}"
  form-footer:
    backgroundColor: "{colors.surface}"
    padding: "12px 16px 16px"
  list-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.onSurface}"
    typography: "{typography.bodyLarge}"
    padding: "8px 16px"
    height: "72px"
  list-item-selected:
    backgroundColor: "{colors.primaryContainer}"
    textColor: "{colors.onPrimaryContainer}"
  form-message-error:
    backgroundColor: "{colors.errorContainer}"
    textColor: "{colors.error}"
    typography: "{typography.bodyLarge}"
    rounded: "12px"
    padding: "16px"
  form-message-success:
    backgroundColor: "{colors.primaryContainer}"
    textColor: "{colors.onPrimaryContainer}"
    typography: "{typography.bodyLarge}"
    rounded: "12px"
    padding: "16px"
  welcome-stage:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.onPrimary}"
    padding: "0 24px"
  wordmark:
    textColor: "{colors.onPrimary}"
    typography: "{typography.display}"
---

# Design System: Pescare

## Overview

**Creative North Star: "The Patient Clerk"**

Pescare is the category standard on purpose: Material 3 as Google ships it in Gmail and Files, themed with the Pescare Admin palette so the fishers' app and the team's panel read as one product. Nothing is reinvented. The character comes from the reader it serves: often older, reading little, more at home in WhatsApp than in any form. So the system behaves like a patient clerk at a counter. It asks for one thing at a time, in large print, shows an example of the answer, and keeps the next action in the same place on every screen.

Density is low and the scale is large. The Material roles and type roles are kept, but every size moves up: reading text is 18, button labels are 18, and nothing falls below 16. Controls are 56dp tall, no touch target is under 48dp, and text follows the phone's font-size setting. Working screens are white pages; blue marks action, focus, progress, and the chosen answer. The only full-bleed blue is the brand's arrival: the native splash and the welcome screen share Working Blue, and with no logo yet, the "Pescare" wordmark is the mark and rises into view as the splash hands off.

The system is flat: no shadows and no tonal elevation are in use, and a hairline appears only when content scrolls under a bar. Shapes are Material's: pill buttons, 4dp outlined fields. The platform sans (Roboto on Android, SF Pro on iPhone) carries all type, and icons are Material Symbols on Android with the matching SF Symbols on iPhone. The app is light-only for now. On iPhone it stays Material while keeping the iOS guarantees: safe-area insets, Reduce Motion, and edge-swipe back.

**Key Characteristics:**
- Material 3, executed rather than reinvented, in the Pescare Admin blue (#2563EB).
- Upsized M3 scale on the platform sans: 52 / 28 / 22 / 20 / 18 / 16, nothing below 16.
- 56dp controls, 48dp minimum targets, 4dp spacing grid, 16dp side inset.
- White pages, pill buttons, 4dp outlined fields with the label always on the top edge.
- Flat: hairlines on scroll instead of shadows.
- One full-bleed blue moment: splash into welcome, with the wordmark rising.

## Colors

Material 3 color roles filled from the Pescare Admin palette: one working blue with its own wash and ink, cool gray neutrals, and one red for errors.

### Primary
- **Working Blue** (`primary`, #2563EB): filled buttons, outlined and text button labels, the focused field outline and label, the caret and selection handles, the progress indicator, the selected row's check mark, and the full-bleed welcome ground. White on it is 5.2:1.
- **Pressed Blue** (`primaryPressed`, #1D4ED8): the pressed fill of the filled button on iOS. Android uses the ripple instead.
- **On-Blue White** (`onPrimary`, #FFFFFF): everything that sits on Working Blue: filled-button labels, the wordmark, the tagline, and the inverse outlined button's label and 2dp border.
- **Chosen Wash** (`primaryContainer`, #EFF6FF): the "this one" fill. It backs the selected list row and the success message, and it is the pressed fill of the white button on the welcome screen.
- **Chosen Ink** (`onPrimaryContainer`, #1E40AF): text and icon on Chosen Wash: the selected city's name and the success message (8.0:1).
- **Track Blue** (`primaryTrack`, #BFDBFE): the unfilled part of the step progress track, and the text-selection highlight on Android.

### Neutral
- **Page White** (`surface`, #FFFFFF): the ground of every working screen, the top app bar, the docked footer, fields, and list rows. Also the fill of the inverse filled button on blue.
- **Ink** (`onSurface`, #111827): headlines, the app bar title, input text, list item names, and the back arrow.
- **Muted Ink** (`onSurfaceVariant`, #4B5563): example lines, helper text, the resting field label, placeholders, leading field icons, the step label, the secondary line of list rows, and status lines such as "Carregando a lista de cidades…" (7.6:1 on white).
- **Field Stroke** (`outline`, #6B7280): the 1dp resting border of fields and of the outlined button on white.
- **Hairline** (`outlineVariant`, #E5E7EB): list dividers and the scroll edges under the top app bar and above the footer.
- **Disabled Veil** (`disabledContainer`, onSurface at 12%) and **Disabled Ink** (`disabledContent`, onSurface at 38%): Material's disabled container and content, used for disabled buttons.

### Semantic
- **Error Red** (`error`, #B91C1C): the 2dp error outline, the field label and supporting text in error, the error icon, and the error message text (6.5:1 on white).
- **Error Wash** (`errorContainer`, #FEF2F2): the fill of the error form message.

`theme.ts` also declares `background` (#F9FAFB, the admin ground) and `success` (#15803D). No built screen uses either, so they are not part of the recorded system yet. There is no dark scheme: `app.json` pins the app to light until one is designed.

### Named Rules
**The Admin-Palette Rule.** Every color is a Material role filled from the Pescare Admin palette. A new blue, gray, or red comes from the same ramp the panel already uses (Tailwind blue, gray, red), never from a new hue.

**The Blue-Ground Rule.** Blue as a full-screen ground belongs to the brand's arrival only: the native splash and the welcome screen. Every other screen is Page White, and blue there marks action, focus, progress, or the chosen answer.

**The Chosen-Pair Rule.** Chosen Wash means "this is the one": the selected answer or a confirmation. Its main text turns Chosen Ink, and its icon is Working Blue or Chosen Ink.

## Typography

**Display Font:** the platform sans: Roboto on Android, SF Pro on iPhone. No custom font is loaded.
**Body Font:** the same platform sans.
**Label/Mono Font:** the same platform sans; there is no mono role.

**Character:** the phone's own face, which the reader already sees in WhatsApp, on Material 3's role names with every size raised. Hierarchy comes from size and weight steps that stay obvious at large font settings, not from contrast between typefaces.

### Hierarchy
- **Display** (700, 52/60, -0.5): the "Pescare" wordmark on the welcome screen only. It is the one style capped against font scaling, at 1.4×.
- **Tagline** (400, 20/28): the single purpose line under the wordmark on blue, at most 320dp wide.
- **Headline** (500, 28/36): the screen's question on form screens ("Qual é o seu nome?") and the Home greeting. One per screen, announced as a header.
- **Title** (500, 22/28): the top app bar title, one line, truncated.
- **Body Large** (400, 18/26): the reading size: input text, the example line, list item names, form messages, and status lines.
- **Body** (400, 16/24, 0.15): helper and error text under fields, the secondary line of list rows, and the step label (set at 500).
- **Label** (500, 18/24, 0.1): button labels, larger than M3's 14 so the action reads first.
- **Field Label** (500, 16/20): the label that sits on the top edge of an outlined field.

### Named Rules
**The Sixteen-Floor Rule.** No text is smaller than 16. Supporting text, labels, and secondary lines all sit at 16 or above, because the reader is often older and reads little.

**The Grows-With-the-Phone Rule.** Text follows the OS font-size setting on both platforms. Controls and rows use minimum heights, not fixed ones, so they grow with the text. Only the wordmark is capped (1.4×), and only the top app bar title truncates.

## Layout

The app is a portrait phone layout on a 4dp grid (`spacing` xs 4 to xxxl 48). It runs edge to edge and applies the safe-area insets itself: the top app bar pads the status-bar inset, and each footer pads the bottom inset plus 16dp (24dp on the welcome screen). Fixed sizes come from `theme.size`: 56dp for buttons and fields (`control`), 48dp for icon and text buttons (`iconButton`), and 64dp for the top app bar (`appBar`).

**Form screen.** Every form uses one skeleton. Below the top app bar, a scroll area has a 16dp side inset, 8dp at the top, and 24dp at the bottom. On multi-step flows it opens with the step progress (a 4dp track and the "Passo n de 4" label 8dp below it), then 32dp of air, then the headline question, the example line 8dp under it, and the fields 24dp below that, stacked 16dp apart. The primary action is not in the scroll: it sits in a docked footer (12dp top, 16dp sides, bottom inset + 16dp) with secondary actions 8dp under it. When the keyboard opens, the footer rides above it and drops the gesture-bar inset, since the gesture bar is behind the keyboard. Each sign-up step is its own route, so the system Back button and gesture step back one question.

**Welcome stage.** A full-bleed Working Blue screen with a 24dp side inset. The wordmark and tagline (12dp apart) are left-aligned in the free height, lifted 48dp above center. The two full-width buttons sit 12dp apart, pinned 24dp above the bottom inset.

**Home (provisional).** A top app bar without back, a 16dp-padded content column with an 8dp gap, and the sign-out text button in the footer.

### Named Rules
**The Docked-Action Rule.** On a form screen the primary button lives in the docked footer, full width, above the gesture bar or the keyboard. It never scrolls away with the content.

**The Two-Inset Rule.** Screen content sits 16dp from the edge. Text inside a control sits at a second 16dp step: field labels, helper lines, and list row text line up at 32dp, and the top app bar title without a back button lands on the 16dp line (4dp bar padding + 12dp). Only the welcome stage uses 24dp.

## Elevation & Depth

The system is flat. No component uses a shadow or a tonal elevation level. Regions separate by Page White against Working Blue, by Chosen Wash for the selected answer, and by a 1dp Hairline. The hairline under the top app bar and above the docked footer is scroll-reactive: it appears only while content is actually passing beneath that bar, and it is transparent otherwise. Press feedback is a state layer, not a lift. Android shows the native ripple drawn over the content; iOS shows a flat pressed fill.

### Named Rules
**The Flat-Until-Scrolled Rule.** Bars and pages share one plane at rest. A bar earns its 1dp Hairline only while content scrolls under it, and loses it when the content clears.

## Shapes

Material shapes, used as Material uses them. Every button and icon button is a full pill or circle (`rounded.full`, 999dp). Outlined fields use Material's extra-small corner (`rounded.field`, 4dp). The form message uses a 12dp corner, Material's medium. The progress track and indicator have 2dp ends, half their 4dp height. List rows are square, full width within the content inset, and divided by 1dp Hairlines, with a hairline above the first row. Borders are 1dp at rest and 2dp for focus, error, and the outlined button on blue. Nothing is clipped, angled, or decorated.

## Components

### Buttons
Material buttons at large size: calm, unmistakable, and always labeled in words.
- **Shape:** full pill (999dp).
- **Filled:** Working Blue fill, On-Blue White 18/500 label, 56dp minimum height, 24dp side padding, stretched to the full width. One per screen for the main action ("Continuar", "Criar conta", "Entrar").
- **Outlined:** transparent with a 1dp Field Stroke border and a Working Blue label, same size as filled. Used for a recovery action under a message ("Tentar de novo").
- **Text:** Working Blue label, 48dp minimum height, 12dp side padding, centered at its own width. Used for the quieter second path in a footer ("Ainda não tenho conta", "Entrar com este e-mail") and for "Sair da conta", which is deliberately not a filled button.
- **On blue (inverse):** on the welcome stage the filled button turns Page White with a Working Blue label, and the outlined button turns transparent with a 2dp white border and a white label.
- **Pressed:** Android uses a foreground ripple: white at 24% on blue fills and on the blue stage, and Working Blue at 16% on white. On iOS the filled button darkens to Pressed Blue, the inverse filled button to Chosen Wash, and outlined and text buttons take a Working Blue 8% fill (white 12% on blue).
- **Loading / Disabled:** loading swaps the label for a spinner in the label color and blocks presses. Disabled uses the Disabled Veil fill (filled) or border (outlined) with Disabled Ink content.

### Inputs / Fields
The Material outlined text field, with one change: the label never rests inside the box.
- **Style:** Page White box, 56dp minimum height, 4dp corners, 1dp Field Stroke border, 16dp side padding, Body Large Ink text. The Field Label sits on the top edge at all times, 12dp in with 4dp of Page White behind it to cut the border, so the fisher always sees what the field asks.
- **Leading and trailing:** an optional 24dp Muted Ink leading icon (search on the city field) 12dp from the text, and an optional trailing slot (the password show/hide icon button).
- **Focus:** the border goes to 2dp Working Blue and the label turns Working Blue. The side padding drops by 1dp to absorb the thicker border, so the text does not shift. Caret and selection handles are Working Blue; the selection highlight is Track Blue on Android and Working Blue on iOS.
- **Supporting text:** helper text in Body Muted Ink, 4dp under the box with a 16dp inset. It also serves as the field's accessibility hint.
- **Error:** the border goes to 2dp Error Red, the label turns Error Red, and the error replaces the helper text, led by a 20dp error icon, in Error Red. It is announced through a polite live region and is not repeated on the input.

### Navigation
- **Top app bar:** the Material small top app bar. It is 64dp tall on Page White with 4dp padding, a 48dp back icon button in Ink ("Voltar"), and a one-line Title in Ink. The bar pads the status-bar inset and sets dark status-bar icons. It gains the Hairline only when content scrolls under it.
- **Back:** every pushed screen has the back arrow, and the system Back button and edge-swipe do the same thing.
- **Stack:** a native stack with platform transitions and no native header. Each screen's content background is Page White, and the welcome screen's is Working Blue so the transition never flashes white behind it.

### Icon Button
A 48dp circle with a 24dp icon, Muted Ink by default and Ink in the app bar, plus 4dp of extra hit area. Android uses a borderless ripple in Ink at 12%; iOS uses an Ink 8% pressed fill. It always carries an accessibility label ("Voltar", "Mostrar senha" / "Esconder senha").

### Step Progress
The Material linear progress indicator, labeled. A 4dp Track Blue track with a Working Blue indicator at step/total width, both with 2dp ends, announced as a progress bar ("Passo 2 de 4"). The visible "Passo n de 4" label sits 8dp below the track in Body at 500, Muted Ink. It is the track's label, not a heading ornament, and never appears without the track.

### Selection List
A radio list for picking one answer from a search (the city list). It has a Hairline above the first row and under every row.
- **Row:** Page White, 72dp minimum height, 8dp × 16dp padding. The name is Body Large Ink, and a second line (the state) is Body Muted Ink.
- **Selected:** Chosen Wash fill, the name at 600 in Chosen Ink, and a 24dp Working Blue check at the trailing edge. Rows are announced as radio buttons with their checked state.
- **Pressed:** Android ripple in Working Blue at 12%; iOS Ink 6% fill.
- **Around it:** a loading line (spinner and Muted Ink Body Large text), a no-results line that names the search and the fix, and a "Mostrando n de total" line when results are capped.

### Form Message
An in-flow message for what belongs to no single field: server down, wrong password, account created.
- **Style:** 16dp padding, 12dp corners, a 24dp leading icon 12dp from Body Large text.
- **Error:** Error Wash fill, Error Red text and error icon, announced as an alert.
- **Success:** Chosen Wash fill, Chosen Ink text and check-circle icon.
- Both are polite live regions. A recovery action, when there is one, follows as an outlined button.

### Icons
One icon component maps each name to a Material Symbol on Android and the matching SF Symbol on iPhone, at 24dp by default and hidden from screen readers. The meaning always comes from a text or accessibility label. The set in use: back, search, check, error, success (check circle), visibility, and visibility off.

### Welcome Stage (signature)
The brand's arrival, continuing the native splash.
- **Splash:** the native splash is Working Blue (#2563EB) with a transparent 1×1 image, because no logo exists yet. It stays up until the saved session has been read, so a signed-in fisher goes straight to Home.
- **Hand-off:** the welcome screen is the same blue with light status-bar icons. The wordmark and tagline mount only after the splash hides, then rise into place over 700ms with an exponential ease-out (Reanimated `FadeInUp`). Under Reduce Motion the rise is cut and they simply appear. The buttons are present from the first frame.
- **Content:** "Pescare" in Display On-Blue White, left-aligned. One Tagline line under it. White filled "Criar conta" and outlined "Já tenho conta" pinned above the gesture bar.

## Do's and Don'ts

### Do:
- **Do** build every form screen on the shared form screen: top app bar with back, step progress when the flow has steps, one headline question, an example line, the fields, and the primary action in the docked footer.
- **Do** take every color from the theme roles; when a new shade is needed, take it from the Pescare Admin ramp (#2563EB blue, #111827 to #E5E7EB grays, #B91C1C red).
- **Do** keep text at 16 or above, let it follow the OS font-size setting, and give controls minimum heights (56dp controls, 48dp icon and text buttons) so they grow with it.
- **Do** keep the field label on the top edge of the outlined field at all times, and show an example of the expected answer.
- **Do** put field errors on the field: 2dp Error Red border, red label, and the message with a 20dp error icon under it in a polite live region. Use a form message only for what belongs to no single field.
- **Do** draw icons through the shared icon component (Material Symbols on Android, the matching SF Symbol on iPhone) and pair each with a text or accessibility label.
- **Do** give every pressable the native ripple on Android and a flat pressed fill on iOS.
- **Do** theme what the platform draws: Working Blue caret and selection handles, Track Blue selection on Android, light status-bar icons on blue and dark ones on white.

### Don't:
- **Don't** use blue as a full-screen ground anywhere but the native splash and the welcome screen.
- **Don't** set text below 16 or turn off font scaling; the wordmark's 1.4× cap is the only limit.
- **Don't** put the primary action inline in the scroll content of a form screen; it lives in the docked footer.
- **Don't** show the step label apart from the progress track.
- **Don't** give the top app bar or the footer a permanent divider or a shadow; the Hairline appears only while content is underneath.
- **Don't** make an easy-to-regret secondary action a filled button; "Sair da conta" is a text button.
