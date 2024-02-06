import os
from bs4 import BeautifulSoup

def add_target_blank(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith('http') and not a_tag.has_attr('target'):
            a_tag['target'] = '_blank'
    return str(soup)

def process_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()
        modified_content = add_target_blank(html_content)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(modified_content)

if __name__ == "__main__":
    directory = input("Enter the directory path containing HTML files: ")

    if not os.path.isdir(directory):
        print("Invalid directory path.")
        exit()

    for root, dirs, files in os.walk(directory):
        for file_name in files:
            if file_name.endswith('.html'):
                file_path = os.path.join(root, file_name)
                process_html_file(file_path)

    print("Process completed.")
