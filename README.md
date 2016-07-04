## Moss ##
Moss is a Javascript framework that converts plaintext explanations into interactive webpages.

#### Plaintext format ####

For input, Moss requires a data string in the following format:

```
Moss data files have blocks.
Blocks are composed of multiple newline seperated lines of text.
You can create multiple blocks.

You can create multiple blocks.
Blocks are seperated by double newlines.
```
- This example data string has two blocks.
- The first clause of a block is its independent clause, or "IC".
- The first occurence of a block's IC in an earlier paragraph produces a "primary link".
  - The block in which the reference occurs becomes the 'parent' of the block.
    - This forms a tree.
  - Clicking a primary link exposes its child block.
- All subsequent references to a block's IC produce "secondary links".
  - Clicking a secondary link displays the referenced paragraph at the bottom of the page.

#### To use ####

1. Put your text files and subdirectories in `/project`. The contents will be `gitignored`.
  - `.txt` files in `/project` and its subdirectories are recursively concatinated.
    - Files of a level will be concatinated before all files of subdirectories of that level.
      - This lets us ensure parents with references occur before the blocks they are referencing.
    - Anything that's not a `.txt` file is skipped.
  - It is recommended that you put your project directory under version control.

2. Run `make`

3. Either deploy `assets/concat/index.html` or manually assemble from the contents of `assets/`.
  - For your convinience, Moss will build for you the assets/concat/index.html file that contains all necessary files.
  - You are however free to manually assemble a custom configuration.

#### Custom configuration ####

  1. Create an index.html, or use assets/index.html as a model.
  2. Include assets/moss.js in a script tag.
  3. Include assets/moss.css in a style sheet tag.
  4. Create an html element with the id '\_moss'. Moss.js will put your content there.
  5. Moss.js requires a data string, which can be provided in one of two ways:
    - Moss will look on the \_moss element for an attribute called `data-source`.
      - If the data-source attribute exists, Moss will make a GET request to its value and expect a data string.
      - In the example assets/index.html, a request is made for a /data.txt file from the same directory as index.html.
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
