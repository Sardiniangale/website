#!/bin/bash

# This script compiles all the LaTeX files in the src/latex directory
# and moves the generated PDFs to the public/documents directory.

set -e

OUTPUT_DIR="/home/giacomo/Documents/git/website/public/documents"
LATEX_SRC_DIR="/home/giacomo/Documents/git/website/src/latex"

for dir in "$LATEX_SRC_DIR"/*/; do
    (
        cd "$dir"
        main_tex_file=$(find . -maxdepth 1 -type f -name "*.tex")
        if [ -n "$main_tex_file" ]; then
            latexmk -pdf "$main_tex_file"
            pdf_file="${main_tex_file%.tex}.pdf"
            if [ -f "$pdf_file" ]; then
                mv "$pdf_file" "$OUTPUT_DIR/"
                latexmk -c
            fi
        fi
    )
done

echo "LaTeX compilation complete."
