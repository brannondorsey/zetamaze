#!/bin/bash

root_dir=$(dirname $BASH_SOURCE)
backups_dir="$root_dir/backups"

image_dir="$root_dir/images/maze"
textures_dir="$image_dir/textures"
textures_small_dir="$image_dir/textures_small"
uploads_dir="$root_dir/uploads"
backup_dir="$backups_dir/$date"

echo "Which date would you like to restore? (yyyy-mm-dd)"
read date
restore_dir="backups/$date"

if [ -d "$restore_dir" ]
then

	echo "Restoring..."
	echo "copying as = $image_dir/textures"

	#backup textures'
	#if copied to "$image_dir/textures" the folder is copied
	#INTO textures and does not replace it. Refer to 
	#http://en.wikipedia.org/wiki/Cp_(Unix)
	
	cp -R "$restore_dir/textures" "$image_dir"
	cp -R "$restore_dir/textures_small" "$image_dir"

	#restore uploads
	cp -R "$restore_dir/uploads" "$root_dir"

	echo "Restored maze to its state on $date"
else
	echo "There are no backups for that date"
fi