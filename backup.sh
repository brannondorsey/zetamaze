#!/bin/bash

root_dir=$(dirname $BASH_SOURCE)
backups_dir="$root_dir/backups"

image_dir="$root_dir/images/maze"
textures_dir="$image_dir/textures"
textures_small_dir="$image_dir/textures_small"

date=$(date +"%Y-%m-%d")
echo "date: $date"
echo "backups: $backups_dir"
echo "textures: $textures_dir"
echo "textures small: $textures_small_dir"

backup_dir="$backups_dir/$date"
if [ ! -d $backup_dir ]
then
	mkdir $backup_dir
	echo "created directory"
else 
	echo "directory already exists"
fi

echo "backing up to $backup_dir"
cp -R $textures_dir "$backup_dir/textures" 
cp -R $textures_small_dir "$backup_dir/textures_small"
