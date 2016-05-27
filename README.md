## Moss ##
Moss is a small Javascript framework for converting natural language plaintext explanations into interactive explanation tree webpages.

Blog post: http://docjoku.int.greenhouse.io/blog/2016/05/24/moss.html
Demo: http://docjoku.int.greenhouse.io/

### What does it do? ###
  * Moss takes a plaintext file and generates a webpage.
  * Pages start with a single introductory paragraph.
  * Clauses which also begin later paragraphs are automatically linkified.
  * Clicking links appends further paragraphs to the page in a growing path.
  * Opening a link from an earlier paragraph collapses the current path and opens a new one.
  * Object references to other parts of the explanation are linkified.
  * These tangent links add background information to the page without redirecting from the current path.
  * Every path has a unique fragment id which can be used to identify and share it.

### Why? ###
  * Explanations that expand to the reader's interest and degree of background knowledge.
  * Explanations with multiple levels of abstraction so readers can get the gist before burrowing.
  * A simple tree-like interface that adds content inline so you don't get derailed or sidetracked.
  * Browse downwards from the root to see scope or browse upwards from a node to get context.
  * Have one explanation that can grow indefinitely instead of producing multiple documents and indexes.
  * Couple the location of content with its context so that additions must be of explicit germanity.
  * No metadata, no special formats, no language to learn, just explicit natural language.

### How to install: ###
  - Run `./make.sh` to build `site/data.txt` from the files in `/contents`.
  - Run `./watch.sh` to watch `/contents` for changes and run make
  - Run `./run.sh` to host a static assets server from `/site` and navigate to `http://127.0.0.1:8000/` in your browser.

### How to use: ###

Make changes by adding to the text files in `/content`. Files in `/content` should have the following format.

#### Lines ####
- Files are composed of newline seperated lines of text.
- You can use any number of newlines.
- Lines have first, independent clauses, or 'ics'.
- Lines are identified by ic.
- Ics must be unique
- Lines have one parent line, the line that contains the first reference to its ic.
- This produces a tree of paragraphs.
- The substring of a parent which matches a child cannot be reused to match further children.
- Once we match a child to a parent, we stop looking for other parent matches for that child.

#### Topic links ####
- The webpage initialized with the first paragraph displayed.
- Some clauses of the paragraph will be linkified automatically.
- When a line has a child, the clause of the parent which matches the child's ic will be linkified.
- Clicking the link will display the child paragraph below the current paragrah.
- Opening a different child will close the current path and open a new one.
- Only one path can be on the screen at one time.
- The bolded links show which is the open path.
- Every path has a fragment id which is the ic of the last displayed paragraph.

#### Object links ####
- The clauses of a line can contain object references.
- An object reference is a reference to another line's ic.
- Object references are rendered as links.
- Clicking an object link causes the referred-to line to be appended in parentheses below the current path.
- Derivations have a linkified ic that appends to the view that line's parent.
- If an earlier topic link is clicked the parenthetical paragraphs are cleared.
- Open object references do not affect the url.

#### Files ####
- Parent lines must proceede child lines in the file.
- You can break a large file up into smaller files.
- `.make.sh` will concatinate all files in all directories in `/content` recursively.
- `./make.sh` will concatinate files in a parent directory before files in subdirectories.
- Put files containing child lines in subdirectories of files containing parent lines to ensure they are concatinated after their parents.

#### Comments ####
- Lines that begin with hyphens are not interpreted.
