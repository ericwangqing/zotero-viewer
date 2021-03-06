// Generated by CoffeeScript 1.3.3
var ELIPSE, NOT_AVAILABLE, addTooltipWithAbstarct, bibs, ccfUrl, dataUrl, getAuthors, getCCFRanking, getDate, getSCIIf, getTitle, getVenue, getVenueName, loadBibs, renderTable, sciUrl, tableHead, toggle;

dataUrl = 'zotero-data.json';

ccfUrl = 'ccf.json';

sciUrl = 'sci.json';

bibs = [];

NOT_AVAILABLE = '--';

ELIPSE = '...';

tableHead = "<table id='zv'><thead><tr><th>No.</th><th>Title</th><th>Venue</th><th>CCF Ranking</th><th>SCI IF</th><th>Publish Date</th><th>Authors</th></tr></thead><tbody></tbody></table>";

loadBibs = function() {
  return $.getJSON(dataUrl, function(data) {
    bibs = data;
    return $.getJSON(ccfUrl, function(data) {
      var CCF;
      CCF = data;
      return $.getJSON(sciUrl, function(data) {
        var SCIIF;
        SCIIF = data;
        renderTable(bibs, CCF, SCIIF);
        return $('table').each(makeTableSortable);
      });
    });
  });
};

renderTable = function(bibs, CCF, SCIIF) {
  var authors, bib, ccfr, classname, date, i, sciif, title, venue, _i, _len, _results;
  $('#zotero-container').append(tableHead);
  _results = [];
  for (i = _i = 0, _len = bibs.length; _i < _len; i = ++_i) {
    bib = bibs[i];
    classname = toggle(classname);
    title = getTitle(bib);
    venue = getVenue(bib);
    ccfr = getCCFRanking(bib, CCF);
    sciif = getSCIIf(bib, SCIIF);
    date = getDate(bib);
    authors = getAuthors(bib);
    $('#zv tbody').append("<tr " + classname + "><td>" + (i + 1) + "</td><td id='" + bib.id + "'>" + title + "</td><td>" + venue + "</td><td>" + ccfr + "</td><td>" + sciif + "</td><td>" + date + "</td><td>" + authors + "</td></tr>");
    _results.push(addTooltipWithAbstarct(bib));
  }
  return _results;
};

toggle = function(classname) {
  if (classname === '') {
    return "class = 'alternate'";
  } else {
    return '';
  }
};

getTitle = function(bib) {
  return bib.title;
};

getVenue = function(bib) {
  var venue, _ref, _ref1, _ref2;
  venue = (_ref = (_ref1 = (_ref2 = bib['collection-title']) != null ? _ref2 : bib['container-title']) != null ? _ref1 : bib['publisher']) != null ? _ref : 'Web Page';
  return venue.replace(/(.+), (.+)/, '$2 $1');
};

getVenueName = function(bib) {
  return getVenue(bib).replace(/'\d+/, '').toUpperCase().replace(/\s+/, ' ').trim();
};

getCCFRanking = function(bib, CCF) {
  var _ref, _ref1;
  if ((_ref = bib.type) !== 'paper-conference' && _ref !== 'article-journal') {
    return NOT_AVAILABLE;
  }
  return (_ref1 = CCF[getVenueName(bib)]) != null ? _ref1 : NOT_AVAILABLE;
};

getSCIIf = function(bib, SCIIF) {
  if (bib['type'] !== 'article-journal') {
    return NOT_AVAILABLE;
  }
  return SCIIF[getVenueName(bib).toUpperCase()];
};

getDate = function(bib) {
  var date, parts, result;
  date = bib.issued;
  if (!date) {
    return NOT_AVAILABLE;
  }
  parts = date['date-parts'];
  result = '';
  result += parts[0];
  if (parts[1]) {
    result += '-' + parts[1];
  }
  if (parts[2]) {
    result += '-' + parts[2];
  }
  return result;
};

getAuthors = function(bib) {
  var author, authors, result, _i, _len;
  authors = bib.author || [];
  result = [];
  for (_i = 0, _len = authors.length; _i < _len; _i++) {
    author = authors[_i];
    result.push("<span class='author'>" + author.given + " " + author.family + "</span>");
  }
  return result.join(', ');
};

addTooltipWithAbstarct = function(bib) {
  if (bib.abstract) {
    return $(function() {
      return $("#" + bib.id).tooltip({
        bodyHandler: function() {
          return bib.abstract;
        },
        extraClass: 'abstract'
      });
    });
  }
};

$(loadBibs);
