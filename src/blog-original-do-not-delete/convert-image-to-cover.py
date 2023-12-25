import os
import frontmatter

def process_mdx_file(input_file, output_directory):
    # Read the input file
    with open(input_file, 'r', encoding="utf-8") as file:
        md_content = frontmatter.load(file)

    if 'image' in md_content:
        # Extract src and alt values
        src_value = md_content['image']['src']
        alt_value = md_content['image']['alt']

        # Add new variables cover and coverAlt
        md_content['cover'] = src_value
        md_content['coverAlt'] = alt_value

        # Remove the original image.src and image.alt fields
        del md_content['image']

        # Create the output directory if it doesn't exist
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)

        # Construct the output file path
        output_file = os.path.join(output_directory, os.path.basename(input_file))

        # Write the updated content to the output file
        with open(output_file, 'w', encoding="utf-8") as output_file:
            output_file.write(frontmatter.dumps(md_content))

        print(f'Successfully updated "{output_file}" with cover and coverAlt fields.')
    else:
        print(f'No image data found in "{input_file}".')

# Get a list of all *.mdx files in the current directory
mdx_files = [file for file in os.listdir() if file.endswith('.mdx')]

# Process each file
output_directory = 'output'
for mdx_file in mdx_files:
    input_file_path = mdx_file
    process_mdx_file(input_file_path, output_directory)
