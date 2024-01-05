import os
import yaml

def process_data(data):
    # Check if "cover" is empty
    if not data['cover']:
        # If empty, insert the default value
        data['cover'] = "../../assets/blog_pics/2003-sacre-cour.jpg"

    # Your other processing logic here
    # ...

    return data

def update_mdx_file(file_path):
    # Read the content of the .mdx file
    with open(file_path, 'r') as file:
        content = file.read()

    # Find the YAML front matter using triple dashes (---)
    start_index = content.find('---') + 3
    end_index = content.find('---', start_index)

    # Extract and parse the YAML front matter
    front_matter = content[start_index:end_index]
    data = yaml.safe_load(front_matter)

    # Process the data
    processed_data = process_data(data)

    # Update the content with the modified YAML front matter
    updated_content = content[:start_index] + yaml.dump(processed_data, default_flow_style=False) + content[end_index:]

    # Write the updated content back to the .mdx file
    with open(file_path, 'w') as file:
        file.write(updated_content)

# Specify the directory containing the .mdx files
directory_path = '/path/to/your/directory'

# Iterate through all .mdx files in the directory
for filename in os.listdir(directory_path):
    if filename.endswith('.mdx'):
        file_path = os.path.join(directory_path, filename)
        update_mdx_file(file_path)
