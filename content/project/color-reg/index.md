---
title: "Color Regular"
date: 2005-06-26
tags: [font,graphics,typography]
links: []
---
{{< link-download color-reg.ttf color-reg.ttf >}}

{{< html >}}
<br/><br/>
<div class="font-preview">ABCDEFGHIJKLMNOPQRSTWUVXYZ</div>
<div class="font-preview">abcdefghijklmnopqrstwuvxyz</div>
<div class="font-preview">1234567890</div>
<div class="font-preview">!%/8)=?_.:,;#'+*</div>
{{< / html >}}

{{< html >}}
<style>
@font-face { font-family : "ColorReg"; src: url('color-reg.ttf') format('truetype'); }
:root {
	--font-family-title: 'ColorReg';
	--h1-size: 10rem;
}
h1.title {
	letter-spacing: unset;
	line-height: 0.7em;
}
div.font-preview {
	font-family : "ColorReg";
	line-height: 1em;
	/* letter-spacing: 0.5rem; */
	font-size: 4rem;
	word-break: break-all;
}
</style>
{{< / html >}}
