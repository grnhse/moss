function Moss(data) {
  var $moss = $('#_moss');

  var lines = data.trim().split(/[\n]+/).map(trim).filter(notAComment);
  var ngramLines = {};
  var icLines = {};
  var lineParents = {};
  var icTrees = {};

  lines.forEach(function(line, index) {
    if (index !== 0) {
      lineParents[line] = ngramLines[icOf(line)];
    }

    icLines[icOf(line)] = line;

    clausesOf(line).forEach(function(clause) {
      forEachPrefixSuffix(clause, {
        each: function(string) {
          var ngram = string.toLowerCase();
          ngramLines[ngram] = ngramLines[ngram] || line;
        }
      });
    });
  });

  lines.slice().reverse().forEach(function(line) {
    icTrees[icOf(line)] = renderSection(line);
  });

  function renderSection(line) {
    var $section = $('<section></section>').attr('id', '_moss_'+idFrom(firstClauseOf(line)));
    var $paragraph = $('<p></p>').appendTo($section);
    var $span;

    handleLine(line,
      {
        beforeEachClause: function(clause) {
          $span = $('<span></span>').appendTo($paragraph);
          $span.append(document.createTextNode(punctuationOf(clause) + ' '));
        },
      },

      {
        suffixCallback: function(suffix) {
          if (suffix) {
            $span.prepend(document.createTextNode(' ' + suffix));
          }
        },

        prefixCallback: function(prefix) {
          $span.prepend(document.createTextNode(' ' + prefix + ' '));
        }
      },

      {
        test: function(substring) {
          return icTrees.hasOwnProperty(substring.toLowerCase()) && ngramLines[substring.toLowerCase()] === line;
        },

        success: function(clause) {
          var $link = $('<a href="#"></a>').text(clause);

          $link.on('click', function(e){
            e.preventDefault();
            var targetId = idFrom(e.target.innerText.charAt(0).toUpperCase() + e.target.innerText.slice(1));
            var $target = $('#_moss_' + targetId);
            if ($target.is(':visible') && !$section.parents().is($target)) {
              $derivation.empty();
              display($target.parent());
            } else {
              display($target);
            }
          })

          $span.prepend($link);
          $span.prepend(document.createTextNode(' '));
          $section.append(icTrees[clause.toLowerCase()]);
          delete icTrees[clause.toLowerCase()];
        },
      },

      {
        test: function(substring) {
          return icLines.hasOwnProperty(substring.toLowerCase());
        },

        reject: function(substring) {
          return substring.toLowerCase() === icOf(line);
        },

        success: function(object) {
          var $link = $('<a href="#"></a>').text(object);
          $link.on('click', function(e) {
            e.preventDefault();

            if ($link.hasClass('selected')) {
              $derivation.empty();
              $link.removeClass('selected');
            } else {
              display($link.closest('section'));
              $link.addClass('selected');
              $derivation.empty();
              var $object = renderDerivation(icLines[object.toLowerCase()], object);
              $derivation.append($object);
            }

          });

          $span.prepend($link);
          $span.prepend(document.createTextNode(' '));
        }

      }
    );

    return $section;
  }

  function renderDerivation(line) {
    var $section = $('<section></section>');
    var $paragraph = $('<p></p>').appendTo($section);
    var $span;

    $section.addClass(idFrom(icOf(line)));

    $derivation.find('a').
      filter('.' + idFrom(icOf(line))).
      off('click').removeAttr('href');

    handleLine(line,
      {
        icHandler: function (clause){
          $span = $('<span></span>');

          if (lineParents[line]) {
            var $link = $('<a href="#"></a>').text(clause);
            $link.addClass(idFrom(icOf(lineParents[line])));

            var icOfParent = icOf(lineParents[line]);
            if ($derivation.find('section.'+idFrom(icOfParent)).length > 0) {
              $link.removeAttr('href');
            }

            $link.on('click', function(e) {
              e.preventDefault();
              $derivation.append(renderDerivation(lineParents[line]));
            });

            $span.prepend(document.createTextNode(' '));
            $span.prepend($link);
          } else {
            $span.prepend(document.createTextNode(clause));
          }

          $paragraph.append($span);
        },

        beforeEachClause: function (clause) {
          $span = $('<span></span>').appendTo($paragraph);
          $span.append(document.createTextNode(punctuationOf(clause)));
        },

        onFinish: function() {
          $span.prepend(' ');
          $paragraph.prepend(document.createTextNode('('));
          $paragraph.append(document.createTextNode(')'));
        }
      },

      {
        suffixCallback: function(suffix) {
          if (suffix) {
            $span.prepend(document.createTextNode(' ' + suffix));
          }
        },

        prefixCallback: function(prefix) {
          $span.prepend(document.createTextNode(prefix + ' '));
        }
      },

      {
        test: function(substring) {
          return icLines.hasOwnProperty(substring.toLowerCase());
        },

        reject: function(object) {
          return $moss.find('.'+idFrom(object)).filter(':visible').length > 0 ||
            $moss.find('#_moss_'+idFrom(icOf(lineParents[icLines[object.toLowerCase()]]))).filter(':visible').length > 0 ||
            object.toLowerCase() !== icOf(line).toLowerCase();
        },

        success: function(object) {
          var $link = $('<a href="#"></a>').text(object)
          $link.addClass(idFrom(icOf(object)));

          $link.on('click', function(e) {
            e.preventDefault();
            $(e.target).removeAttr('href');
            var line = icLines[object.toLowerCase()];
            $derivation.append(renderDerivation(line));
          });

          $span.prepend($link);
          $span.prepend(document.createTextNode(' '));
        }
      }
    );

    return $section;
  }

  function handleLine(line, handlers, searchOptions) {
    var matchers = Array.prototype.slice.call(arguments, 3) || [];
    clausesWithPunctuationOf(line).forEach(function(clause, index) {
      if (handlers.icHandler && index === 0) {
        handlers.icHandler(clause);
      } else {
        (handlers.beforeEachClause||function(){}).call({}, clause);
        forEachPrefixSuffix.apply({}, [withoutPunctuation(clause), searchOptions].concat(matchers));
      }
    });
    (handlers.onFinish||function(){}).call({});
  }

  function forEachPrefixSuffix(string, options) {
    var matchers = Array.prototype.slice.call(arguments, 2) || [];
    var options = options || {};
    var suffixCallback = options.suffixCallback || function(){};
    var prefixCallback = options.prefixCallback || function(){};
    var each = options.each || function(){};
    var suffixBuffer = '';
    var words = string.trim().split(' ');

    var match = tryPrefix(words.length);
    if (match) {
      prefixCallback(words.slice(0, match.start).join(' '));
    } else {
      suffixCallback(string);
    }

    function tryPrefix(endIndex) {
      if (endIndex === 0) {
        return null;
      }

      var match = trySuffix(0);
      if (match) {
        return tryPrefix(match.start) || match;
      } else {
        suffixBuffer = ' ' + words.slice(endIndex - 1, endIndex).join(' ') + suffixBuffer;
        return tryPrefix(endIndex - 1);
      }

      function trySuffix(startIndex) {
        if (startIndex === endIndex) { return null; }
        var substring = words.slice(startIndex, endIndex).join(' ');
        each(substring);
        for (var i = 0; i < matchers.length; i++) {
          if ((matchers[i].test||function(){}).call({}, substring)) {
            if ((matchers[i].reject||function(){}).call({}, substring)) {
              suffixBuffer = substring + suffixBuffer;
              suffixCallback(suffixBuffer);
            } else {
              suffixCallback(suffixBuffer);
              (matchers[i].success || function(){}).call({}, substring);
            }
            suffixBuffer = '';
            return { start: startIndex, end: endIndex };
          }
        }
        return trySuffix(startIndex + 1);
      }
    }
  }

  function punctuationOf(clause) {
    return clause.slice(-1);
  }

  function withoutPunctuation(clause) {
    return clause.trim().slice(0, -1);
  }

  function clausesWithPunctuationOf(string) {
    return string.match(/[^.,;:!?]+(([.,:;!?])(?!($|\s)))*[^.,;:]+[.,:;?]/g);
  }

  function idFrom(string) {
    return string ? string.replace(/[ ]/g, '_').
      replace(/['".]/g, '') : '';
  }

  function clausesOf(string) {
    return string.split(/[,.;:?!]($|\s)/);
  }

  function firstClauseOf(string) {
    return clausesOf(string)[0];
  }

  function icOf(line) {
    return firstClauseOf(line).toLowerCase().trim();
  }

  function notAComment(line) {
    return line.match(/^\s*([^-*#\s])+.*/);
  }

  function trim(line) {
    return line.trim();
  }

  function subjectOf(string) {
    return string.match(/[.?!]/) ? splitOnSubject(string)[0] : string;
  }

  function splitOnSubject(line) {
    var copulasRegex = /([^,.?!]+(is|are|was|were|will be)?) (?=is|are|was|were|will be)/;
    var match = line.match(copulasRegex);
    return [match[1].trim(), match.slice(2).join('')];
  }

  function init() {
    var $section = $('#_moss_' + window.location.hash.substring(1));
    if ($section.length === 1) {
      if(!$section.is(':visible')) {
        display($section);
      }
    } else {
      display($('#_moss').children('section'));
    }
  }

  function display($section){
    $('#_moss').find('section').hide();
    $section.parentsUntil('#_moss').show();
    $section.show();
    window.location.hash = $section.attr('id').slice('_moss_'.length);

    unboldLinks();
    boldLinksTo($section);

    function unboldLinks() {
      $('#_moss').find('a').removeClass('selected');
    }

    function boldLinksTo($section) {
      if ($section.parent().is("#_moss")) { return; }
      if ($section.length === 0) {return;}
      var $paragraph = $section.siblings('p');

      $paragraph.find('a').
        filter(lineIcIsLinkText).
        addClass('selected');

      boldLinksTo($section.parent());

      function lineIcIsLinkText(index, element) {
        return icOf($section.children('p').text()) === icOf(element.innerText.toLowerCase());
      }
    }
  }

  $(window).on('hashchange', init);

  $moss.append(icTrees[icOf(lines[0])]);
  $moss.prepend($('<h3></h3>').text(subjectOf(lines[0])));
  var $derivation = $('<div id="#_derivation"></div>').appendTo($moss);

  init();
}
