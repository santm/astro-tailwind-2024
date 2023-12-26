import re
import os

def convert_markdown_top(markdown_text):
    # Extract metadata from the top part of the markdown file
    metadata = {}
    for line in markdown_text.splitlines():
        if line == "---":
            break
        match = re.match(r"(\w+)\s*=\s*(.*)", line)
        if match:
            key, value = match.groups()
            metadata[key] = value

    # Check if 'slug' exists before popping
    if 'slug' in metadata:
        # Convert slug to description
        metadata["description"] = metadata.pop("slug")

    # Check if 'published' exists before popping
    if 'published' in metadata:
        # Convert published to pubDate and truncate to date format
        published = metadata.pop("published")
        pubDate = re.sub(r"T.*", "", published)
        metadata["pubDate"] = pubDate

    # Check if 'author' exists before popping
    if 'author' in metadata:
        # Extract first word from author as "Santanu"
        author_name = metadata.pop("author")
        metadata["author"] = author_name.split(" ")[0]

        # Fix author tag closing
        metadata["author"] += '"'

    # Add "Category" and "General" as its value
    metadata["category"] = "General"

    # Extract tag values
    if 'tags' in metadata:
        tags_str = metadata.pop("tags")
        tag_values = tags_str.split(', ')

        # Convert tag values to lowercase
        tag_values = [tag.lower() for tag in tag_values]

        # Reconstruct the tags section with lowercase tag values
        metadata["tags"] = tag_values

    # Add image metadata
    metadata["image"] = {
        "src": "",
        "alt": "",
    }

    # Construct the new top part with updated metadata
    new_top_part = "---\n"
    for key, value in metadata.items():
        if isinstance(value, list):
            value = ", ".join(value)
        new_top_part += f"{key} : {value}\n"
    new_top_part += "---\n\n"

    return new_top_part

def process_markdown_file(input_file, output_file):
    with open(input_file, "r", encoding='utf-8') as f:
        markdown_text = f.read()

    converted_markdown = convert_markdown_top(markdown_text)

    with open(output_file, "w", encoding='utf-8') as f:
        f.write(converted_markdown)

def main():
    # Create the "output" sub-directory if it doesn't exist
    if not os.path.exists("output"):
        os.makedirs("output")

    # Process all Markdown files in the current directory
    for filename in os.listdir("."):
        if filename.endswith(".mdx"):
            input_file = os.path.join(".", filename)
            output_file = os.path.join("output", filename)
            process_markdown_file(input_file, output_file)

if __name__ == "__main__":
    main()
