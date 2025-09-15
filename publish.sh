#!/bin/bash

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <SubjectName>"
  echo "Available subjects: Fisica2, Laboratorio2, MeccanicaClassica, MetodiMatematici1, ChimicaGenerale, ComplementiAnalisiMatematica"
  exit 1
fi

SUBJECT=$1
LATEX_DIR="/home/giacomo/Documents/git/Latex"
WEBSITE_DOCS_DIR="/home/giacomo/Documents/git/website/public/documents"
SUBJECT_DIR="$LATEX_DIR/$SUBJECT"
TEX_FILE="$SUBJECT_DIR/$SUBJECT.tex"
PDF_FILE="$SUBJECT_DIR/$SUBJECT.pdf"
FINAL_PDF_FILE="$WEBSITE_DOCS_DIR/$SUBJECT.pdf"

# Check if the subject directory exists
if [ ! -d "$SUBJECT_DIR" ]; then
  echo "Error: Subject '$SUBJECT' not found."
  echo "Available subjects: Fisica2, Laboratorio2, MeccanicaClassica, MetodiMatematici1, ChimicaGenerale, ComplementiAnalisiMatematica"
  exit 1
fi

# Navigate to the subject directory
cd "$SUBJECT_DIR" || exit

# Compile the LaTeX file
if ! command -v pdflatex &> /dev/null
then
    echo "pdflatex could not be found, please install it."
    exit
fi

echo "Compiling $TEX_FILE..."
pdflatex "$TEX_FILE"

# Check if PDF was created
if [ ! -f "$PDF_FILE" ]; then
  echo "Error: PDF generation failed."
  exit 1
fi

# Move the PDF to the website directory
echo "Moving $PDF_FILE to $FINAL_PDF_FILE..."
mv "$PDF_FILE" "$FINAL_PDF_FILE"

# Clean up auxiliary files
echo "Cleaning up auxiliary files..."
rm -f "$SUBJECT.aux" "$SUBJECT.log" "$SUBJECT.out"

echo "Done. The document is now available on the website."
