#!/bin/bash
cd "$HOME/wiki" || exit
for e in ""$(ls); do
	echo "$e"
done
