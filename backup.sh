#!/bin/bash

root_dir=$(dirname $BASH_SOURCE)
backups_dir="$root_dir/backups"

image_dir="$root_dir/images/maze"
textures_dir="$image_dir/textures"
textures_small_dir="$image_dir/textures_small"
uploads_dir="$root_dir/uploads"

date=$(date +"%Y-%m-%d")

backup_dir="$backups_dir/$date"
if [ ! -d $backup_dir ]
then
	mkdir $backup_dir
	echo "created directory"
else 
	echo "directory already exists"
fi

#backup uploads
cp -R $uploads_dir "$backup_dir/uploads"

#backup database
mysqldump zetamaze.com > "$backup_dir/zetamaze.sql"

#backup textures
cp -R $textures_dir "$backup_dir/textures" 
cp -R $textures_small_dir "$backup_dir/textures_small"

echo "backups saved to $backup_dir"