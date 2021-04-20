---
title: "Vinyl SVG"
date: 2021-04-20
tags: [svg,vinyl]
keywords: [vector,icon,graphics]
description: "Aspect ratio correct vinyl records."
---
{{< html >}}
<style>
	div.records {
		display: flex;
		flex-wrap: wrap;
		justify-items: center;
		text-align: center;
		padding: 2rem;
	}
	div.records a {
		display: table;
	}
	div.records svg {
		height: auto;
		margin-bottom: 2rem;
	}
	div.records svg[width="30cm"] {
		width: 100%;
	}
	div.records svg[width="25.4cm"] {
		width: calc(100/30*25.4%);
	}
	div.records svg[width="17.8cm"] {
		width: calc(100/30*17.8%);
	}
	div.records svg[width="12.7cm"] {
		width: calc(100/30*12.7%);
	}
	@media screen and (min-width: 30em) {
		div.records {
			flex-wrap: nowrap;
			align-items: center;
			padding: 2vmin;
		}
		div.records svg {
		}
	}
</style>
<div class="records">

	<a download href="vinyl12.svg" title='12"'>
		<svg width="30cm" height="30cm" version="1.1" viewBox="0 0 30 30"
			xmlns="http://www.w3.org/2000/svg">
			<g fill-rule="evenodd">
				<path id="vinyl" d="m15 15m-15 0a15 15 0 1 0 30 0 15 15 0 1 0-30 0m15 0m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--f_med)"/>
				<path id="label" d="m15 15m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0m5 0m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--b_high"/>
			</g>
		</svg>
	</a>

	<a download href="vinyl10.svg" title='10"'>
	<svg width="25.4cm" height="25.4cm" version="1.1" viewBox="0 0 25.4 25.4" xmlns="http://www.w3.org/2000/svg">
	<g fill-rule="evenodd">
	<path id="vinyl" d="m12.7 12.7m-12.7 0a12.7 12.7 0 1 0 25.4 0 12.7 12.7 0 1 0-25.4 0m12.7 0m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--f_med)"/>
	<path id="label" d="m12.7 12.7m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0m5 0m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--b_high"/>
	</g>
	</svg>
	</a>

	<a download href="vinyl7.svg" title='7"'>
	<svg width="17.8cm" height="17.8cm" version="1.1" viewBox="0 0 17.8 17.8" xmlns="http://www.w3.org/2000/svg">
	<g fill-rule="evenodd">
	<path id="vinyl" d="m8.9 8.9m-8.9 0a8.9 8.9 0 1 0 17.8 0 8.9 8.9 0 1 0-17.8 0m8.9 0m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--f_med)"/>
	<path id="label" d="m8.9 8.9m-4.5 0a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0m4.5 0m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--b_high"/>
	</g>
	</svg>
	</a>

	<a download href="vinyl5.svg" title='5"'>
	<svg width="12.7cm" height="12.7cm" version="1.1" viewBox="0 0 12.7 12.7" xmlns="http://www.w3.org/2000/svg">
	<g fill-rule="evenodd">
	<path id="vinyl" d="m6.35 6.35m-6.35 0a6.35 6.35 0 1 0 12.7 0 6.35 6.35 0 1 0-12.7 0m6.25-0.1m-0.35 0a0.35 0.35 0 1 0 0.7 0 0.35 0.35 0 1 0-0.7 0" fill="var(--f_med)"/>
	</g>
	</svg>
	</a>

</div>
{{< /html >}}
