#!/bin/bash

# Check if title is provided as an argument
if [ $# -eq 0 ]; then
    echo "Error: Please provide a title as an argument."
    exit 1
fi

# Get today's date in the format 2024-02-09
TODAY=$(date +"%Y-%m-%d")

# Extract title from the first argument
TITLE="$1"

# Define file name using today's date and title
FILENAME="${TODAY}-${TITLE// /-}.mdx"

# Create MDX content
MDX_CONTENT="---
title: \"$TITLE\"
pubDate: $TODAY
author: \"Santanu\"
description: \"This is a new blog entry.\"
tags: []
category: \"General\"
cover: \"/path/to/default/cover-image.jpg\"
coverAlt: \"Cover image alt text\"
---

Your MDX content goes here...
"

# Write MDX content to file
echo "$MDX_CONTENT" > "./blog/$FILENAME"
echo "MDX file \"./blog/$FILENAME\" created successfully."
