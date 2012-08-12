dataUrl = 'zotero-data.json'
ccfUrl = 'ccf.json'
sciUrl = 'sci.json'
bibs = []

NOT_AVAILABLE = '--'
ELIPSE = '...'

tableHead = "<table id='zv'><thead><tr>
<th>No.</th><th>Title</th><th>Venue</th><th>CCF Ranking</th><th>SCI IF</th>
<th>Publish Date</th><th>Authors</th></tr>
</thead><tbody></tbody></table>"


loadBibs = ->
	$.getJSON dataUrl, (data) ->
		bibs = data
		$.getJSON ccfUrl, (data) ->
			CCF = data
			$.getJSON sciUrl, (data) ->
				SCIIF = data
				renderTable bibs, CCF, SCIIF
				$('table').each makeTableSortable

renderTable = (bibs, CCF, SCIIF) ->
	$('#zotero-container').append(tableHead)
	for bib, i in bibs
		classname = toggle classname
		title = getTitle bib
		venue = getVenue bib
		ccfr = getCCFRanking bib, CCF
		sciif = getSCIIf bib, SCIIF
		date = getDate bib
		authors = getAuthors bib

		$('#zv tbody').append("<tr #{classname}><td>#{i+1}</td><td id='#{bib.id}'>#{title}</td><td>#{venue}</td><td>#{ccfr}</td><td>#{sciif}</td>
<td>#{date}</td><td>#{authors}</td></tr>")

		addTooltipWithAbstarct bib


toggle = (classname) ->
	if classname is '' then "class = 'alternate'" else ''

getTitle = (bib) ->
	bib.title

getVenue = (bib) ->
	venue = bib['collection-title'] ? bib['container-title'] ? bib['publisher'] ? 'Web Page'
	venue.replace(/(.+), (.+)/, '$2 $1')	

getVenueName = (bib) ->
	getVenue(bib).replace(/'\d+/, '').toUpperCase()
		.replace(/\s+/, ' ').trim()

getCCFRanking = (bib, CCF) ->
	return NOT_AVAILABLE if bib.type not in ['paper-conference', 'article-journal']
	return CCF[getVenueName(bib)] ? NOT_AVAILABLE

getSCIIf = (bib, SCIIF) ->
	return NOT_AVAILABLE if bib['type'] isnt 'article-journal'
	return SCIIF[getVenueName(bib).toUpperCase()]

getDate = (bib) ->
	date = bib.issued
	return NOT_AVAILABLE if not date
	parts = date['date-parts']
	result = ''
	result += parts[0]
	result += '-' + parts[1] if parts[1] 
	result += '-' + parts[2] if parts[2] 
	result

getAuthors = (bib) ->
	authors = bib.author or []
	result = []
	for author in authors
		result.push "<span class='author'>#{author.given} #{author.family}</span>"
	result.join ', '

addTooltipWithAbstarct = (bib) ->
	if bib.abstract 
		$ ()->
			$("#" + bib.id).tooltip({
				bodyHandler : () ->
					return bib.abstract
				extraClass : 'abstract'
			})

$(loadBibs)
