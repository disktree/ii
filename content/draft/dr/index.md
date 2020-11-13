---
title: "ÐΛȐҠ"
date: 2020-11-04
type: "project"
tags: [dark,subconscious,nsfw]
description: "Subconscious image engine."
links: []
draft: true
---
{{< html >}}
	<button class="load">Expose [NSFW!]</button>
	<iframe src="" frameborder="0" width="100%"></iframe>
	<style>
		iframe {
			user-select: none;
		}
	</style>
	<script>
		var button = document.querySelector('main button.load');
		var iframe = document.querySelector('main iframe');
		iframe.oncontextmenu = e => {
			e.preventDefault();
			e.stopPropagation();
		}
		iframe.onload = function(){
			button.style.display = "block";
			button.textContent = 'Expose [NSFW!]';
			button.removeAttribute('disabled');
			iframe.style.display = "block";
		}
		function loadRandom() {
			button.textContent = 'loading';
			button.setAttribute('disabled','true');
			iframe.style.display = "none";
			var i = 1+Math.floor(Math.random()*46);
			iframe.src = "https://disktree.net/app/znn/dr/page/"+i;
		}
		button.onclick = function(){
			loadRandom();
		}
		document.body.oncontextmenu = e => {
			e.preventDefault();
			e.stopPropagation();
		};
	</script>
{{< /html >}}
