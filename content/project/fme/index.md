---
title: "FME"
date: 2005-06-26
tags: [font,graphics,typography]
links: []
---
{{< link-download fme-55.ttf  fme-55.ttf >}}

{{< html >}}
<br/><br/>
<div class="font-preview">ABCDEFGHIJKLMNOPQRSTWUVXYZ</div>
<div class="font-preview">abcdefghijklmnopqrstwuvxyz</div>
<div class="font-preview">1234567890</div>
<div class="font-preview">!%/8)=?_.:,;#'+*</div>
{{< / html >}}

{{< html >}}
<style>
@font-face { font-family : "FME"; src: url('fme-55.ttf') format('truetype'); }
:root {
	--font-family-title: 'FME';
	--h1-size: 8rem;
}
h1.title {
	letter-spacing: 0.05em;
}
div.font-preview {
	font-family : "FME";
	line-height: 1.1em;
	/* letter-spacing: 0.5rem; */
	font-size: 4rem;
	word-break: break-all;
}
</style>
{{< / html >}}
