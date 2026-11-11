---
title: "Styleguide"
date: 2024-02-23
description: "Every element the stylesheet touches, and the ones it pretends not to."
tags: [design]
rss_ignore: true
sitemap:
  disable: true
---

Two voices: Inter for the titles, set large, and for the text. JetBrains Mono, small, for all the data around them. No color but the text and its background, which follow the OS.

## Headings

# h1 An ihren Daten sollt ihr sie erkennen

## h2 An ihren Daten sollt ihr sie erkennen

### h3 An ihren Daten sollt ihr sie erkennen

#### h4 An ihren Daten sollt ihr sie erkennen

##### h5 An ihren Daten sollt ihr sie erkennen

###### h6 An ihren Daten sollt ihr sie erkennen

## Text

Many non-authoritarian organizations have foundered on the dubious principle of open membership, which [frequently](/necessary-secrecy/) leads to a preponderance of assholes, yahoos, spoilers, whining neurotics, & police agents. Some will call this an elitist attitude, but it is not—at least not in the C.&nbsp;Wright Mills sense of the word: that is, a small group which exercises power over non-insiders for its own aggrandizement.

“Hanging punctuation” keeps quotes outside the left edge where the browser supports it. Lines wrap with `text-wrap: pretty`, headings with `balance`. Figures are tabular: 0123456789, 1111111111.

**Bold**, _italic_, ~~strikethrough~~, `inline code`, <kbd>ctrl</kbd>+<kbd>]</kbd>, <mark>marked</mark>, <small>small print</small>, H<sub>2</sub>O, x<sup>2</sup>, <abbr title="Serious Fucking Index">SFI</abbr>.

## Links

This [link](https://disktree.net) is a link, this one [has been visited](/styleguide/), hover them to see the underline. Bare: <https://velak.klingt.org/>, <https://disktree.net>.

## Lists

- Unordered list item
- Unordered list item with a longer text that will wrap onto a second line on most screens, to check the hanging indent
  - Nested item
  - Nested item
- Unordered list item

1. Ordered list item
2. Ordered list item
3. Ordered list item
10. Ordered list item, ten

- [x] Write the press release
- [ ] Update the website

Term
: Definition
: Another definition

## Quotes

> The basis of conflict is a lie.
> The lie is the image of divergent interests.
>
> — The Process

## Code

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
```

    $ npm run update:code

## Table

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |
| Numbers   |     1/3     |    1,234.50 |

## Footnotes

Here's a sentence with a footnote.[^1] And another one.[^2]

[^1]: This is the footnote.
[^2]: This is the second footnote.

## Media

Embeds and figures step out of the measure into the aside column.

{{< iframe src="https://art.disktree.net/alive" >}}

<figure>
<img src="/s/2020-04-14-060812/Screenshot_2020-04-14_06-08-12.png" alt="screenshot" loading="lazy">
<figcaption>A figure with a caption.</figcaption>
</figure>

{{< audio src="https://music.disktree.net/MIX/sumup.mp3" >}}

## Colors

{{< html >}}
<table class="swatches">
<thead><tr><th>token</th><th>value</th><th></th></tr></thead>
<tbody>
<tr><td><code>--bg</code></td><td><code>Canvas</code></td><td><span class="swatch" style="background:Canvas"></span></td></tr>
<tr><td><code>--fg</code></td><td><code>CanvasText</code></td><td><span class="swatch" style="background:CanvasText"></span></td></tr>
<tr><td><code>--muted</code></td><td><code>GrayText</code></td><td><span class="swatch" style="background:GrayText"></span></td></tr>
</tbody>
</table>
{{< /html >}}

## Weights

JetBrains Mono, variable, `wght` 100–800.

{{< html >}}
<p><span style="font-weight:100">100</span> <span style="font-weight:200">200</span> <span style="font-weight:300">300</span> <span style="font-weight:400">400</span> <span style="font-weight:500">500</span> <span style="font-weight:600">600</span> <span style="font-weight:700">700</span> <span style="font-weight:800">800</span></p>
<p><i><span style="font-weight:100">100</span> <span style="font-weight:200">200</span> <span style="font-weight:300">300</span> <span style="font-weight:400">400</span> <span style="font-weight:500">500</span> <span style="font-weight:600">600</span> <span style="font-weight:700">700</span> <span style="font-weight:800">800</span></i></p>
{{< /html >}}

## Metadata

<p class="mono-sample"><time>2026-11-06</time></p>

---

## Characters

A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z

### Monospace ligatures

-- --- == === != !== =!= =:= =/= &lt;= &gt;= &amp;&amp; &amp;&amp;&amp; &amp;= ++ +++ _\*\* ;; !! ?? ??? ?: ?. ?= &lt;: :&lt; :&gt; &gt;: &lt;:&lt; &lt;&gt; &lt;&lt;&lt; &gt;&gt;&gt; &lt;&lt; &gt;&gt; || -| _|_ |- ||- |= ||= ## ### #### #{ #[ ]# #( #? #* #*( #: #! #= ^= &lt;$&gt; &lt;$ $&gt; &lt;+&gt; &lt;+ +&gt; &lt;_&gt; &lt;\* _&gt; &lt;/ &lt;/&gt; /&gt; &lt;!-- &lt;#-- --&gt; -&gt; -&gt;&gt; &lt;&lt;- &lt;- &lt;=&lt; =&lt;&lt; &lt;&lt;= &lt;== &lt;=&gt; &lt;==&gt; ==&gt; =&gt; =&gt;&gt; &gt;=&gt; &gt;&gt;= &gt;&gt;- &gt;- -&lt; -&lt;&lt; &gt;-&gt; &lt;-&lt; &lt;-| &lt;=| |=&gt; |-&gt; &lt;-&gt; &lt;~~ &lt;~ &lt;~&gt; ~~ ~~&gt; ~&gt; ~- -~ ~@ [||] |] [| |} {| [&lt; &gt;] |&gt; &lt;| ||&gt; &lt;|| |||&gt; &lt;||| &lt;|&gt; ... .. .= ..&lt; .? :: ::: := ::= :? :?&gt; // /// /_ \*/ /= //= /== @\_ \_\_

### Diacritics

Á Ă Ắ Ặ Ằ Ẳ Ẵ Ǎ Â Ấ Ậ Ầ Ẩ Ẫ Ä Ạ À Ả Ā Ą Å Ã Æ Ǽ Ć Č Ç Ĉ Ċ Ð Ď Đ É Ĕ Ě Ê Ế Ệ Ề Ể Ễ Ë Ė Ẹ È Ẻ Ē Ę Ɛ Ẽ Ǵ Ğ Ǧ Ĝ Ģ Ġ Ħ Ĥ Í Ĭ Î Ï İ Ị Ì Ỉ Ī Į Ĩ Ĵ Ķ Ĺ Ľ Ļ Ŀ Ł Ń Ň Ņ Ŋ Ñ Ó Ŏ Ô Ố Ộ Ồ Ổ Ỗ Ö Ọ Ò Ỏ Ơ Ớ Ợ Ờ Ở Ỡ Ő Ō Ǫ Ø Ǿ Õ Œ Þ Ŕ Ř Ŗ Ś Š Ş Ŝ Ș ẞ Ə Ŧ Ť Ţ Ț Ú Ŭ Û Ü Ụ Ù Ủ Ư Ứ Ự Ừ Ử Ữ Ű Ū Ų Ů Ũ Ẃ Ŵ Ẅ Ẁ Ý Ŷ Ÿ Ỵ Ỳ Ỷ Ȳ Ỹ Ź Ž Ż á ă â ä à ā ą å ã æ ǽ ć č ç ĉ ċ ð ď đ é ĕ ě ê ë ė è ē ę ə ğ ǧ ĝ ġ ħ ĥ i ı í ĭ î ï ì ī į ĩ j ȷ ĵ ĸ l ĺ ľ ŀ ł m n ń ŉ ň ŋ ñ ó ŏ ô ö ò ơ ő ō ø ǿ õ œ þ ŕ ř s ś š ş ŝ ß ſ ŧ ť ú ŭ û ü ù ư ű ū ģ ķ ļ ņ ŗ ţ ǫ ǵ ș ț ạ ả ấ ầ ẩ ẫ ậ ắ ằ ẳ ẵ ặ ẹ ẻ ẽ ế ề ể ễ ệ ỉ ị ọ ỏ ố ồ ổ ỗ ộ ớ ờ ở ỡ ợ ụ ủ ứ ừ ử ữ ự ỵ ỷ ỹ ų ů ũ ẃ ŵ ẅ ẁ ý ŷ ÿ ỳ z ź ž ż

### Numbers

0 1 2 3 4 5 6 7 8 9 ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ½ ¼ ¾ ↋ ↊ ૪

### Punctuation

. , : ; … ! ¡ ? ¿ · • \* ⁅ ⁆ # ․ ‾ / \ ‿ ( ) { } [ ] ❰ ❮ ❱ ❯ ⌈ ⌊ ⌉ ⌋ ⦇ ⦈ - – — ‐ \_ ‚ „ “ ” ‘ ’ « » ‹ › ‴ " ' ⟨ ⟪ ⟦ ⟩ ⟫ ⟧ · ;

### Greek

Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω Ά Έ Ή Ί Ό Ύ Ώ Ϊ Ϋ Ϗ α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω ί ϊ ΐ ύ ϋ ΰ ό ώ ά έ ή ϗ ϕ ϖ

### Cyrillic

А Б В Г Ѓ Ґ Д Е Ё Ж З И Й К Ќ Л М Н О П Р С Т У Ў Ф Х Ч Ц Ш Щ Џ Ь Ъ Ы Љ Њ Ѕ Є Э І Ї Ј Ћ Ю Я Ђ Ғ Қ Ң Ү Ұ Ҷ Һ Ә Ө а б в г ѓ ґ д е ё ж з и й к ќ л м н о п р с т у ў ф х ч ц ш щ џ ь ъ ы љ њ ѕ є э і ї ј ћ ю я ђ ғ қ ң ү ұ ҷ һ ә ө

### Other symbols

@ &amp; ¶ § © ® ₿ ¢ ¤ $ ₫ € ₽ £ ₮ ¥ ƒ ∙ ≔ ∁ ≃ ≅ ∐ ⎪ ⋎ ∣ ∕ ∸ ⋐ ⋱ ∈ ⋮ ∎ ≡ ∹ ∃ ≳ ⎩ ⎨ ⎧ ⎢ ⎣ ⎡ ≲ ⋯ ⊸ ⊎ ⨀ ⨆ ≇ ⊈ ≉ ∌ ∉ ≯ ≱ ≢ ≮ ≰ ⊄ ⊅ + − × ÷ = ≠ &gt; &lt; ≥ ≤ ± ≈ ¬ ~ ^ ∞ ∅ ∧ ∨ ∩ ∪ ∫ ∏ ∑ √ ∂ µ ⍳ ⍴ ℓ ℮ ∥ ⎜ ⎝ ⎛ ⎟ ⎠ ⎞ % ‰ ⁺ ™ ° ′ ″ ≺ ≼ ∷ ≟ ∶ ⊆ ⊇ ⤖ ⎭ ⎬ ⎫ ⎥ ⎦ ⎤ ⊢ ≗ ∘ ∼ ⊓ ⊔ ⊑ ⊂ ∋ ⅀ 𝔽 ℕ ℚ 𝕊 ℤ ⊃ ⊤ ≋ ∀ ⋰ ⊥ ⊛ ⊖ ⊗ ⊙ ⊕ ↑ ↗ → ↘ ↓ ↙ ← ↖ ↔ ↕ ↭ ↞ ↠ ↣ ↥ ↦ ↧ ⇉ ⇑ ⇒ ⇓ ⇔ ⇧ ⇨ ⌄ ➜ ⟵ ⟶ ⟷ ● ◯ ◔ ◕ ◌ ◎ ◦ ◆ ◇ ◊ ■ □ ▪ ▫ ◧ ◨ ◩ ◪ ◫ ▲ ▶ ▼ ◀ △ ▷ ▽ ◁ ► ◄ ▻ ◅ ▴ ▸ ▾ ◂ ▵ ▹ ▿ ◃ ⍨ ⚠ ⚡ ✓ ✕ ✗ ⋆ ✶ | ¦ † ‡ № ⌃ ⌂ ⌅ ⌥ ⌘ ⏻ ⏼ ⭘ ⏽ ⏾ �

### Block symbols

┌ └ ┐ ┘ ┼ ┬ ┴ ├ ┤ ─ │ ╡ ╢ ╖ ╕ ╣ ║ ╗ ╝ ╜ ╛ ╞ ╟ ╚ ╔ ╩ ╦ ╠ ═ ╬ ╧ ╨ ╤ ╥ ╙ ╘ ╒ ╓ ╫ ╪ ━ ┃ ┄ ┅ ┆ ┇ ┈ ┉ ┊ ┋ ┍ ┎ ┏ ┑ ┒ ┓ ┕ ┖ ┗ ┙ ┚ ┛ ┝ ┞ ┟ ┠ ┡ ┢ ┣ ┥ ┦ ┧ ┨ ┩ ┪ ┫ ┭ ┮ ┯ ┰ ┱ ┲ ┳ ┵ ┶ ┷ ┸ ┹ ┺ ┻ ┽ ┾ ┿ ╀ ╁ ╂ ╃ ╄ ╅ ╆ ╇ ╈ ╉ ╊ ╋ ╌ ╍ ╎ ╏ ╭ ╮ ╯ ╰ ╱ ╲ ╳ ╴ ╵ ╶ ╷ ╸ ╹ ╺ ╻ ╼ ╽ ╾ ╿

### Control codes

␆ ␈ ␇ ␘ ␍ ␐ ␡ ␔ ␑ ␓ ␒ ␙ ␃ ␄ ␗ ␅ ␛ ␜ ␌ ␝ ␉ ␊ ␕ ␤ ␀ ␞ ␏ ␎ ␠ ␁ ␂ ␚ ␖ ␟ ␋

### Powerline

      
