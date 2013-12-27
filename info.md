#Info

This document describes the roles of all files and directories in the zeta project folder (__only__). Having been raised in the coding equivalent of caves, I am attempting to alleviate the pain of my sometimes nonsensical coding style.

##Views

- `index.php` - The splash page that provides links to the `make.php`, `draw.php`, and `play.php` pages.
- `make.php` - Allows the user to change the structure of the maze, as well as upload files that are downloaded when players recover in-game items in `play.php`.
- `draw.php` - Allows the user to draw on the walls of the 3D maze in `play.php`.
- `play.php` - The 3D maze.

##APIs

- `api.php` - Provides a web accessible `JSON` representation of the 2D maze data in a way that can be translated by `play.php` into the 3D maze.
- `itemnames.php` - Provides the current filenames of the `fileX.ext` (`X` representing a number and `ext` representing a file extension) files in the `uploads/` directory as a `JSON` array. Used by `play.php` to know which files to download when a player picks up an in-game item. If an http request is made to this page passing a directory path using as a `GET` as a directory `parameter` (i.e. `http://zetamaze.com/itemnames.php?directory=images/maze/textures`) then a `JSON` array containing all non-hidden filenames in the specified directory will be returned.
- `mazevalidator.php` acts as a backend maze validator to prevent unsolvable mazes from being inserted into the database via a post request that doesn't come from the canvas maze editor in the `make.php` page. Returns the html contents of this file + the string `"lfpsq66zf8"` if maze passes. This is a hacky way to do backend validation but it is in an attempt to refrain from re-writting all of my `JavaScript` maze validation code in `PHP`.

##Backend `.php` pages
- `fileupload.php` - Handles the backend saving of the files that represent in-game items and Finders Folder contents to the server's `uploads/` directory. Requests made to this page most often come from `make.php` but also from `play.php` when a player finds the Finder's Folder and is prompted to upload a file.
- `promptdownload.php` - Prompts a browser auto-download of a file inside the `uploads/` (specified using the `filename` parameter using `GET`) while remaining on the page that made the request. Used inside `play.php`. I.e. `http://zetamaze.com/promptdownload.php?filename=file1.jpg`.
- `saveimage.php` - Handles the saving of `HTML5` canvas images from `draw.php` to be saved in the `images/maze/textures`. This directory is the location where maze wall textures are loaded from in `play.php`.

##Directories

- `images/` - contains all images. Split into subdirectories.
- `models/` - contains the `.obj` and `.mtl` files for the 3D models used in `play.php`
- `uploads/` - contains the files uploaded by users in `make.php` as well as the `findersfolder.zip` and all Finders Folder files in a subdirectory.
- `styles/` - All `CSS` files used to style the site.
- `scripts/` - All `JavaScript` files that make the whole Zetamaze project work. There are a number of sub and subsub and subsubsubdirectories.
- `includes/` - All `PHP` includes. Contains both logic and content snippets.


##Misc
- `zeta.sql` - A `MySQL` file that contains the structure of the Zetamaze database. Used for import using phpmyadmin.
- `README.md` - A description of the Zetamaze project.
- `todo.md` - An ongoing todo list for the Zetamaze project.
- `info.md` - This.

