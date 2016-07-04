## Moss ##
Moss is a small Javascript framework for converting natural language plaintext explanations into interactive explanation tree webpages.

#### To use ####

1. Put your text files and subdirectories in `/project`. The contents will be `gitignored`.
- Text files are recursively concatinated and subdirectories don't matter, so structure your project however you like.
- It is recommended that you put your project directory under version control.

2. Run make

3. Deploy either `assets/concat/index.html` or manually assemble from the contents of `assets/`.
  - For your convinience, Moss will build for you an index.html that includes all the required assets.
  - You are however free to manually assemble a custom configuration.

#### Custom configuration ####

  1. Create an index.html
  2. Include moss.js in a script tag.
  3. Include moss.css in a style sheet tag.
  4 Create an html element with the id '\_moss'. Moss.js will put your content here.
  5. Moss.js requires a data string, which can be provided in one of two ways:
  - Moss will look on the \_moss element for an attribute called `data-source`.
  - If the data-source attribute exists, Moss will make a GET request to its value and expect a data string.
  - Moss will look for text in the \_moss element and use this for its data string, clearing the text before rendering.
  - If providing Moss the data string via text in the element, it is recommended to use a single `pre` tag.
  - Otherwise Moss will get a string without newline characters, which it needs to determine where paragraphs break.

#### Build ####

Running `make` will do the following:
- Take the js files in src/ and compile them into assets/moss.js
- Take the src/moss.css and put it in assets/moss.css
- Take the text files in `project` (which are gitignored) and:
  - Compile them into the assets/data.txt asset
  - Build assets/concat/index.html, which is an html file containing:
    - assets/moss.js
    - assets/moss.css
    - assets/data.txt
- Take the text files of of docs/contents and:
  - Build docs/data.txt:
    - From which it build docs/index.html, which includes assets/moss.js and assets/moss.css
