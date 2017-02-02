# Moss #
Moss is a Javascript framework for creating explanation trees, interactive webpages generated from natural language plaintext.

- [How to use a Moss website](#how-to-use-a-moss-website)
  - [Using the Moss keyboard shortcuts](#using-the-moss-keyboard-shortcuts)
- [How to start a Moss project](#how-to-start-a-moss-project)
  - [Install the command line build tools](#install-the-command-line-build-tools)
  - [Create a project directory](#create-a-project-directory)
  - [Initialize project directory](#initialize-project-directory)
    - [The Moss text file format](#the-moss-text-file-format)
    - [The Content directory structure](#the-content-directory-structure)
  - [Building Assets](#building-assets)
  - [Updating moss build tools](#updating-moss-build-tools)
  - [Watching for changes](#watching-for-changes)
  - [Building assets manually](#building-assets-manually)
  - [Using debug information](#using-debug-information)
  - [Running the Moss specs](#running-the-moss-specs)
  - [Running the Moss linter](#running-the-moss-linter)
- [Acknowledgements](#acknowledgements)

## How to use a Moss website ##

The page initializes to a paragraph.

The paragraph contains black links.

The first link of each paragraph is called the 'ic' link, the other black links are called 'parent links.'

Click a parent link to open its child paragraph. The open paragraphs form a path, similar to a directory structure.

Some links are blue, these are alias links and URL links. Clicking an alias link will navigate to a different point in the tree. Clicking a URL link will open that URL.

Every paragraph has its own fragment identifier, so if you navigate to a particular path and share your URL, another user can be directed to the same path you are viewing. Every link has a unique fragment id -- for this reason, alias links must occur in unique clauses because these are used as fragment identifiers.

#### Keyboard Shortcuts ####

| Key  | Action |
| ---- | ------ |
| down, j | Go down, cycling if at bottom |
| up, k | Go up, collapsing if at top |
| right, l | Open paragraph |
| left, h | Close paragraph |
||
| ' | Open new tab to root |
| ; | Duplicate current tab |
||
| n | IC of current paragraph |
| m | First parent link of current paragraph |
| , | second parent link of current paragraph |
| . | third parent link of current paragraph |
| / | fourth parent link of current paragraph |
||
| tab | Depth-first search forward |
| shift-tab | Depth-first search backward |
| space | Exit depth first search forward |
| shift-space | Exit depth first search backward |
| return | Burrow, open links |
| shift-return | Go to parent |
| backspace | Go to parent |
| escape | Go to root |
| command-return | Burrow with new tab |
| ctrl-return | Burrow with new tab |
| command-shift-return | Go to parent with new tab |
||
| y | Go to parent's parent |
| u | Go to parent's IC |
| i | Go to parent |
| o | Go to top of current paragraph |
| p | Go to bottom of current paragraph |
||
| [ | Breath first search forward |
| ] | Breath first search backwards |
||
| 1 | Go to IC of current link's great-grandparent |
| 2 | Go to IC of current link's grandparent |
| 3 | Go to IC of current link's parent |
| 4 | Go to IC of current link |
||
| q | Go to link before current link's great grandparent |
| w | Go to link before current link's grandparent |
| e | Go to link before current link's parent |
| r | Go to link before current link |
| shift-[q/w/e/r] | Go to first child of given link |
||
| a | Go to current link's great grandparent |
| s | Go to current link's grandparent |
| d | Go to current link's parent |
| f | Go to current link (no-op) |
| shift-[a/s/d/f] | Go to first child of given link |
||
| z | Go to link after current link's great grandparent |
| x | Go to link after current link's grandparent |
| c | Go to link after current link's parent |
| v | Go to link after current link |
| shift-[z/x/c/v] | Go to first child of given link |
||
| 7 | Scroll to top of page |
| 8 | Scroll to first third of page |
| 9 | Scroll to second third of page |
| 0 | Scroll to bottom of page |
||
| - | Scroll up |
| = | Scroll down |

## How to start a Moss project ##

Make a project directory named for your project, eg `my_project`.

In your project directory create a `content` directory, which contains the text files.

### Install command line build tools ###

The command line build tools are not required but can speed up project initialization.

Install:
```
git clone https://github.com/grnhse/moss.git
cd moss
./script/install
```
### Initialize project directory ###

Make a project directory, `cd` into it and run:
```
moss init
```
You will get a content directory, a `.gitignore` file, a `content` directory for your moss text files, and `moss watch` will be run (see below.)

### The Moss text file format ###

The `content` directory will contain text files that must be in a particular format.

Text files should end in the file extension `.txt`.

Each file should contain a series of double newline seperated paragraphs.

Paragraphs contain a series of newline seperated lines.

The "IC" or independent clause of a paragraph is its first delimited clause (ie one ending in [.,:;?!]).

Every paragraph should have one parent, an earlier paragraph which contains a reference to that paragraph's IC. If there are multiple references to an IC, the closest one becomes the parent, and others will become alias references.

For example:

```
There are fifty states of America.
New York is a state.
New Jersey is a state.

New York is a state.
New York is next to New Jersey. (New Jersey is a state.)

New Jersey is a state.
New Jersey is next to New York. (New York is a state.)
```
would produce a tree with two parent references in the first paragraph and one alias reference in each of the second two paragraphs.

Urls beginning in http(s) will become linkified and behave like alias links except that they navigate off the page when selected.

### The Moss content directory structure ###

Text files will be concatinated in a depth-first search, so references should be structured so that the first paragraph of each file has its parent reference in an earlier paragraph of that file or a file at a higher level in the tree, so that the parser will have visited the parent before the child.

Running `moss build` from your project directory will generate an `assets` directory based on the files in your `content` directory, which is deployable with a static assets server. It will also create a preview asset called `your_project_name.html` in the project directory which you can view locally.

It is recommended that you put your project directory under version control, and ignore the `assets` directory.

### Building assets ###

Run the asset build script:
```
cd my_project
moss build
```
This will generate the `assets` directory:
`assets/site` is a static website that can be deployed.
`project_name.html` is a single concatinated asset for local use.

### Updating Moss ###

Update your version of the moss assets and scripts:
```
moss update
```

### Watching for changes ###

It can be helpful to have the build script run on any change to your project content directory.

1. Install a version of fswatch appropriate for your platform.

2. Enter your project directory and run the following command:
```
cd my_project
moss watch
```
3. Edit the files in content and refresh `project_name.html` in the browser for changes.

Running `moss unwatch` will terminate a running `moss watch` process.

### Building assets manually ###

The above will generate a simple stand-alone website, but you can also put Moss on an existing page.

  1. Create an index.html, or use assets/index.html as a model.
  2. Include assets/moss.js in a script tag.
  3. Include assets/moss.css in a style sheet tag.
  4. Create an html element with the id '\_moss'.
  5. Moss.js requires a data string, which can be provided in one of two ways:
  - Moss will look on the \_moss element for an attribute called `data-source_url`.
    - If the data-source attribute exists, Moss will make a GET request to its value and expect a data string.
  - If no data-source attribute is found, Moss will look for text in the \_moss element and use this for its data string, clearing the element before rendering.
    - If providing Moss the data string via text in the element, it is recommended to use a single `pre` tag inside your `_moss` element. Otherwise, Moss will get a string without newline characters, which it needs to determine where the paragraphs break.

### Using debug information ###

You can use the concatinated html file in your project directory to get useful information to help you debug your content files. For example, the program will print an 'orphan list' of all the paragraphs that never got subsumed by a parent reference. It will also log other useful errors and warnings.

### Running the Tests ###

Run the tests by opening `moss/spec/index.html` in your browser.

## Acknowledgements ##

Moss was vastly improved by the code changes suggested by Tharsan Bhuvanendran, Aaron Gibralter, Bradley Griffith, Mike O'Neil, Dana Pieluszczak, and Rob Rosenbaum, the infrastructure support of Elena Washington, and the participation of the Greenhouse team.
