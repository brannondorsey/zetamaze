#Zeta Todo

- Exchange cubes with models
- ~~Exchange rects with images~~
- ~~Add server side maze data validation~~
- Add safeguard from image attacks
- ~~Add 3D maze instructions~~
- ~~Add menu to `play.php`~~
- ~~better instructions in `make.php`~~
- ~~Better tool handling in `draw.php`~~
- ~~Detailed about/instructions/more info page~~
- ~~use 256x256 textures in `play.php`~~
- ~~Make collisions better (at least fix bug where a player can get stuck)~~ they could still be better...
- ~~Add maze2D error if start and end are too close~~ not doing this
- ~~Add maze2D error if locations are on top of each other~~
- ~~Add meaningful meta tags in head include~~
- ~~Check backend file upload validation~~
- ~~Set direction of 3D player so that they never start facing a wall~~
- ~~Build end of game `.zip` download system~~
- Extensively test end of game `.zip` download system
- ~~Come up with canvas maze reload process to prevent large overwrites~~
- ~~Do ^ with sketcher~~
- ~~Use random color on sketcher page load~~
- ~~Add marker icon~~
- ~~Fix drawing bug that erases last image if mouse exits canvas~~
- ~~Come up with better system for 2D maze error handling. Currently it has the possibility to block the maze.~~
- ~~Reduce number of texture images to the max possible.~~
- ~~Better feedback when using file upload on make.php. Do not us alerts.~~
- ~~Release pointer lock when Finder's Folder is found.~~
- ~~Check out what is going on with maze error handling. It is being glitchy, giving false negatives and positives.~~
- ~~Setup a cron job to auto back things up.~~
- ~~FAQ page?~~ its now on the info page

#Right Before Launch
- Pick 25 finders folder folder files and 4 item files
- Change number of finder folder images in `fileupload.php` from `5` to `25`
- Make a list of people to email/fb message
- Remove all `console.log()` occurrences
- Review all copy

#Beta test bugs
- If start is near no walls game never loads
- file upload error notification if user clicks "upload" before choosing a file when finder's folder is selected
- Change load bar color for firefox
- Ghost image of models when items collected
- 413 Request Entity Too Large
- Gradient skybox