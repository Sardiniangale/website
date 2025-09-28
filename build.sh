#!/bin/bash

# This script compiles all the LaTeX files in the src/latex directory
# and moves the generated PDFs to the public/documents directory.

set -e

echo "Starting LaTeX build process..."

OUTPUT_DIR="/home/giacomo/Documents/git/website/public/documents"
LATEX_SRC_DIR="/home/giacomo/Documents/git/website/src/latex"

echo "Searching for projects in: $LATEX_SRC_DIR"

for dir in "$LATEX_SRC_DIR"/*/; do
    echo "Found directory: $dir"
    (
        cd "$dir"
        echo "Changed directory to $(pwd)"
        main_tex_file=$(find . -maxdepth 1 -type f -name "*.tex")
        
        if [ -n "$main_tex_file" ]; then
            echo "Found main .tex file: $main_tex_file"
            echo "Cleaning up before build..."
            latexmk -c
            echo "Running latexmk..."
            latexmk -pdf "$main_tex_file"
            
            pdf_file="${main_tex_file%.tex}.pdf"
            echo "Checking for PDF file: $pdf_file"
            if [ -f "$pdf_file" ]; then
                echo "Found PDF. Moving $pdf_file to $OUTPUT_DIR/"
                mv "$pdf_file" "$OUTPUT_DIR/"
                echo "Cleaning up auxiliary files..."
                latexmk -c
            else
                echo "Warning: PDF file not found."
            fi
        else
            echo "No .tex file found in this directory."
        fi
    ) || echo "ERROR: Failed to build project in $dir. Continuing..."
done

echo "LaTeX done"
