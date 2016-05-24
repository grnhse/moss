[![Build Status](https://travis-ci.com/grnhse/tech-blog.svg?token=8sBY9aAWAsMiqzstQbKk&branch=master)](https://travis-ci.com/grnhse/tech-blog)

# In the Weeds
___

A blog by the Greenhouse Engineering team.

[tech.greenhouse.io](https://tech.greenhouse.io/)


###Process for writing Blog Posts (Work in Progress)

___

#### Jira
1. Once you have an idea for a blog post, create a jira card with the following attributes.
  * Project - Greenhouse Application
  * Epic - `Tech Blog`
  * Feature type - `Marketing Feature`
2. We will only be using these 5 columns.
  * Planned
  * In Progress
  * Code Review - when it is being reviewed / edited by others.
  * Verified by QA - Done editing and ready to be published
  * Merged - Published

#### Writing Process
1. Create a new git branch off of master ([repo](https://github.com/grnhse/tech-blog))
1. Write your blog post in markdown ([docs](http://jekyllrb.com/docs/posts/)) and keep your post in the `_drafts` folder. 
  * To see how your post will look you can test it locally by running `bundle install`, `jekyll serve --drafts`, and visiting `0.0.0.0:4000`
1. After finishing the 1st draft, create a PR against `master` and ping the #engineering slack channel asking for a review.
1. Once editing is complete and you want to publish the post. Move the post from the _drafts folder to the _posts folder and include the date of the post in the filename by following the convention of the other files.
1. Merge to the master branch and `git push`
  * We are running automated tests using [html proofer](https://github.com/gjtorikian/html-proofer) which essentially checks that all images and links point to something and don't return any errors. 
  * If html proofer finds any errors it will stop the blog post from being deployed to production.
  * To debug you can run the command locally `bundle exec htmlproof ./_site --href-ignore /tech.greenhouse.io/` to see the errors.

If the travis build passes, then your post will automatically be published via Travisci.

#### Adding new authors and tags
* If it's your first time posting, add yourself as an author to the file `_data/people.yml`
* If you are introducing any new tags it needs to be added in these two places:
  * add it to `_data/tags.yml`
  * add a layout following the convention of the other files in the directory (i.e. `blog/tag/your-new-tag.md`)
