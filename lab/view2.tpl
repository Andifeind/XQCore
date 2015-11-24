div id=categories
	ul
		each $listing
			li onClick=item
				img src=$avatar
				span class=name
					$name