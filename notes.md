#Notes

#How to do it

##Drawings

Using the __right hand rule__ I could wrap one long image (separated into squares the size of each wall) around the entire maze.

###Drawing using Canvas

I will base my drawing system off of this [repo](https://github.com/triceam/HTML5-Canvas-Brush-Sketch) and it will function similarly to the example [here](http://tricedesigns.com/portfolio/sketch/brush.html).

The differences will be that:

- Users will be able to draw in black __and__ white
- Faint dotted lines will illustrate wall separations
- Users will be able to use a hand icon to drag left and right changing the current area of the image that they can draw on
- Users will be able to change the greater area of the wall in which they are working by sliding a "change area" icon

In code, I will load new images via `ajax` whenever the hand or change area tools are used. I will also make sure that enough images to the left and right of the visible area are loaded so as to decrease the chance that a user will need to wait for images to load.




###Loading images as textures

In code this would be a matter of figuring out the index of the wall (not the cube but the actual wall surface) that would appear next using the right hand rule algorithm and then applying the next image from the image list as that walls texture.


###Things to think about

- Some mazes will be require a significantly more amount of images than others.
- Floating blocks (a.k.a. blocks that are connected to no other blocks) are ignored by the right hand rule. This needs to be accounted for or else they should not be allowed to exist in the maze.