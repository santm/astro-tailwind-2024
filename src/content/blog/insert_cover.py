import yaml

def process_data(data):
    # Check if "cover" is empty
    if not data['cover']:
        # If empty, insert the default value
        data['cover'] = "../../assets/blog_pics/2003-sacre-cour.jpg"

    # Your other processing logic here
    # ...

    return data

# Example data
example_data = """
---
author: Santanu
category: General
cover: ''
coverAlt: ''
description: 2003-05-16-metro-on-strike
pubDate: 2003-05-16
tags:
- paris
- sleep
- transport
title: Metro on Strike
---
"""

# Parse the YAML data
parsed_data = yaml.safe_load(example_data)

# Process the data
processed_data = process_data(parsed_data)

# Print the processed data
print(yaml.dump(processed_data, default_flow_style=False))

