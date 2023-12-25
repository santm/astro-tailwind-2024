import re

# Define the sample data
sample_data = """---
title: "Day 6 in Kashmir"
description: "Aru Valley, Betab Valley & Chandan Wari, the golden triangle of Kashmir's tourism"
pubDate: 2022-04-16T02:05:57+05:30
author: "Aarush"
tags: [kashmir, india, travel]
category : Travel
image: {
    src : "https://ik.imagekit.io/santm/blog/2022-Kashmir-day-6_X_SZy40fC8.webp",
    alt : "Aru Valley",
}
featured_image_small : "/images/blog_pics/2022-april-kashmir-6.jpg"
---"""

# Define the regex pattern
pattern = re.compile(r'image:\s*{\s*src\s*:\s*("[^"]+"),\s*alt\s*:\s*("[^"]+")\s*}', re.DOTALL)

# Search for the pattern in the sample data
match = pattern.search(sample_data)

if match:
  # The pattern was found, so the code is working correctly
  print("Pattern found!")
else:
  # The pattern was not found, so there is an error in the regex
  print("Pattern not found!")