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

if[ -d $restore_dir ]
then

	#backup textures
	cp -R "$restore_dir/textures" "$image_dir/textures"
	cp -R "$restore_dir/textures_small" "$image_dir/textures_small"

	#restore uploads
	cp -R "$restore_dir/uploads" "uploads"

	echo "Restored maze to its state on $backup_dir"
else
	echo "There are no backups for that date"
fi