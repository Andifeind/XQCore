div id=details
	if $item
		h1
			$item.title
		div class=description
			$item.description
	else
		div class=message
			Please select a item!