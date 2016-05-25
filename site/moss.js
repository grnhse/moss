function Moss(data) {
  var lines = data.trim().split('\n\n').filter(notAComment).map(trim).map(removeNewlines);

  var $moss = $('#_moss');

  var icLines = {};
  var displayIds = {};
  var icParentMatchText = {};
  var icParents = {};

  lines.forEach(function(line){
    icLines[icOf(line)] = line;
  });

  var icParentIds = {};
  icParentIds[icOf(lines[0])] = '#_moss';

  lines.forEach(function(line) {
    displayIds[idFrom(icOf(line))] = idFrom(firstClauseOf(line));
    $(icParentIds[icOf(line)]).append(renderSection(line));
  });

  function renderSection(line) {
    var $section = $('<section></section>');
    $section.attr('id', '_moss_'+idFrom(icOf(line)));
    $section.hide();
    var $paragraph = $('<p></p>').appendTo($section);
    var $span;
    var ngramPrefixes = {};
    var clauseBuffer = '';

    if (firstPunctuationOf(line) === ':') {
      var $p = $('<p></p>').text(beforeColonOf(line)+':');
      $p.appendTo($section);
      var $div = $('<div></div>').html(afterColonOf(line));
      return $section.append($div)
    }

    handleLine(line,
      {
        beforeEachClause: function(clause) {
          $span = $('<span></span>').appendTo($paragraph);
          clauseBuffer = '';
        },

        afterEachClause: function(clause) {
          $span.append(punctuationOf(clause) + ' ');
        }
      },

      {
        handledCallback: function(string) {
          clauseBuffer += string;
          forEachSuffixPrefix(clauseBuffer, {
            forEach: function(ngram) {
              ngramPrefixes[ngram] = clauseBuffer.slice(0, clauseBuffer.lastIndexOf(ngram)).trim();
            }
          });
        },

        prefixHandler: function(prefix) {
          if (prefix) {
            $span.prepend(prefix);
          }
        },

        suffixHandler: function(suffix) {
          if (suffix) {
            $span.append(' ' + suffix);
          }
        },

        subjectTest: function(substring) {
          var substringWithoutAlso = substring.replace('also ', '');
          var substringWithReiteration = substringWithoutAlso.replace(/and(.*)/,
            function(afterAnd) {
              for (var i = afterAnd.split(' ').length; i > 0; i--) {
                var prefix = afterAnd.split(' ').slice(1, i).join(' ');
                if (ngramPrefixes[prefix]) {
                  return ngramPrefixes[prefix] + ' ' + prefix +
                    afterAnd.slice(afterAnd.indexOf(prefix) + prefix.length);
                }
              }
            }
          );

          if (icLines.hasOwnProperty(substringWithReiteration.toLowerCase())) {
            clauseBuffer = '';
            return substringWithReiteration;
          }

          if (icLines.hasOwnProperty(substringWithoutAlso.toLowerCase())) {
            return substringWithoutAlso;
          }

          if (icLines.hasOwnProperty(substring.toLowerCase())) {
            return substring;
          }
        },

        subjectReject: function(substring) {
          return icParentIds.hasOwnProperty(substring.toLowerCase()) ||
            icOf(substring) === icOf(line);
        },

        subjectSuccess: function(match, clause) {
          icParentIds[clause.toLowerCase()] = '#_moss_' + idFrom(icOf(line));
          icParents[clause.toLowerCase()] = line;

          icParentMatchText[icOf(clause)] = match;

          var $link = $('<a href="#"></a>').text(match).addClass(idFrom(clause));

          $link.on('click', function(e){
            e.preventDefault();
            var targetId = idFrom(clause.toLowerCase());
            var $target = $('#_moss_' + targetId);
            if ($target.is(':visible')) {
              $derivation.empty();
              display($target.parent());
            } else {
              display($target);
            }
          })

          $span.append(' ', $link);
        },

        objectTest: function(substring) {
          if (icLines.hasOwnProperty(substring.toLowerCase())) {return substring};
        },

        objectReject: function(substring) {
          return substring.toLowerCase() === icOf(line);
        },

        objectSuccess: function(object) {
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

          $span.append($link);
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

          if (icParents[icOf(line)]) {
            var $link = $('<a href="#"></a>').text(clause);
            $link.addClass(idFrom(icOf(icLines[icOf(line)])));

            var icOfParent = icOf(icParents[icOf(line)]);
            if ($derivation.find('section.'+idFrom(icOfParent)).length > 0) {
              $link.removeAttr('href');
            }

            $link.on('click', function(e) {
              e.preventDefault();
              $derivation.append(renderDerivation(icParents[icOf(line)]));
              $(e.target).removeAttr('href');
            });

            $span.prepend(' ');
            $span.prepend($link);
          } else {
            $span.prepend(clause);
          }

          $paragraph.append($span);
        },

        beforeEachClause: function (clause) {
          $span = $('<span></span>').appendTo($paragraph);
        },

        afterEachClause: function(clause) {
          $span.append(punctuationOf(clause));
        },

        onFinish: function() {
          $span.prepend(' ');
          $paragraph.prepend('(');
          $paragraph.append(')');
          var $linkIcon = $('<a href="#"><img src="external-link.png" alt="link" class="external-link"></a>');
          $linkIcon.on('click', function(e) {
            e.preventDefault();
            display($('#_moss_'+idFrom(icOf(line))));
          });
          $paragraph.append(' ', $linkIcon);
        }
      },

      {
        prefixHandler: function(prefix) {
          if (prefix) {
            $span.prepend(' ' + prefix);
          }
        },

        suffixHandler: function(prefix) {
          $span.append(prefix);
        },

        objectTest: function(substring) {
          return icLines.hasOwnProperty(substring.toLowerCase());
        },

        objectReject: function(object) {
          return true;
        },

        objectSuccess: function(object) {
          var $link = $('<a href="#"></a>').text(object)
          $link.addClass(idFrom(icOf(object)));

          $link.on('click', function(e) {
            e.preventDefault();
            $(e.target).removeAttr('href');
            var line = icLines[object.toLowerCase()];
            $derivation.append(renderDerivation(line));
          });

          $span.append($link);
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
        forEachSuffixPrefix.apply({}, [withoutPunctuation(clause), searchOptions].concat(matchers));
        (handlers.afterEachClause||function(){}).call({}, clause);
      }
    });
    (handlers.onFinish||function(){}).call({});
  }

  function forEachSuffixPrefix(string, options) {
    var options = options || {};
    var handledCallback = options.handledCallback || function(){};
    var forEach = options.forEach || function(){};
    var prefixHandler = options.prefixHandler || function(){};
    var suffixHandler = options.suffixHandler || function(){};
    var prefixBuffer = '';
    var words = string.trim().split(' ');

    var match = trySuffix(0);
    if (match) {
      suffixHandler(words.slice(match.end, words.length).join(' '));
    } else {
      prefixHandler(string);
    }

    function trySuffix(startIndex) {
      if (startIndex > words.length - 1) {
        return null;
      }

      var match = tryPrefix(words.length);
      if (match) {
        return trySuffix(match.end) || match;
      } else {
        prefixBuffer += words.slice(startIndex, startIndex + 1) + ' ';
        return trySuffix(startIndex + 1);
      }

      function tryPrefix(endIndex) {
        if (endIndex === 0) { return null; }
        var substring = words.slice(startIndex, endIndex).join(' ');
        if (substring === '') { return null; }
        forEach(substring);

        var subjectMatch = (options.subjectTest||function(){}).call({}, substring);
        var subjectReject = (options.subjectReject||function(){}).call({}, substring);
        var objectMatch = (options.objectTest||function(){}).call({}, substring);
        var objectReject = (options.objectReject||function(){}).call({}, substring);
        var subjectSuccess = options.subjectSuccess||function(){};
        var objectSuccess = options.objectSuccess||function(){};

        if (subjectMatch) {
          if (!subjectReject) {
            prefixHandler(prefixBuffer);
            handledCallback(substring);
            subjectSuccess(substring, subjectMatch);
            return { start: startIndex, end: endIndex };
          } else {
            if (objectMatch) {
              if (!objectReject) {
                prefixHandler(prefixBuffer);
                prefixBuffer = '';
                handledCallback(substring);
                objectSuccess(objectMatch);
                return { start: startIndex, end: endIndex };
              } else {
                prefixBuffer += substring;
                handledCallback(substring);
                (options.prefixHandler||function(){}).call({}, prefixBuffer);
                return { start: startIndex, end: endIndex };
              }
            }
          }
        } else if (objectMatch) {
          if (!objectReject) {
            handledCallback(substring);
            objectSuccess(objectResult);
          } else {
            prefixBuffer += substring;
            handledCallback(substring);
            (options.prefixHandler||function(){}).call({}, prefixBuffer);
            return { start: startIndex, end: endIndex };
          }
        } else {
          return tryPrefix(endIndex - 1);
        }
      }
    }
  }

  function punctuationOf(clause) {
    return clause.match(/.*([.,:?!]\)?)/)[1];
  }

  function withoutPunctuation(clause) {
    return clause.trim().match(/(.*)[.,:?!]\)?/)[1];
  }

  function clausesWithPunctuationOf(string) {
    return string.match(/[^.,;:!?]+(([.,:;!?])(?!($|\s)))*[^.,;:]+[.,:;?]\)?/g);
  }

  function idFrom(string) {
    return string ? string.replace(/[ ]/g, '_').
      replace(/['".]/g, '') : '';
  }

  function firstPunctuationOf(string) {
    return string.match(/([,.;:?!])(?=(\s|$))/)[0];
  }

  function beforeColonOf(string) {
    return string.match(/(.*?):\s/)[1];
  }

  function afterColonOf(string) {
    return string.match(/.*?:\s(.*)/)[1];
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

  function removeNewlines(string) {
    return string.replace(/\r?\n|\r/g, " ");
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
    var $section = $('#_moss_' + window.location.hash.substring(1).toLowerCase());
    var $current = $('section').filter(':visible').last();
    if (!$section.is($current)) {
      if ($section.length === 1) {
        if(!$section.is(':visible')) {
          display($section);
        }
      } else {
        display($('#_moss').children('section'));
      }
    }
  }

  function display($section){
    $('#_moss').find('section').hide();
    $section.parentsUntil('#_moss').show();
    $section.show();
    window.location.hash = displayIds[$section.attr('id').slice('_moss_'.length)];

    unboldLinks();
    boldLinksTo($section);

    function unboldLinks() {
      $('#_moss').find('a').removeClass('selected');
    }

    function boldLinksTo($section) {
      if ($section.parent().is("#_moss")) { return; }
      if ($section.length === 0) {return;}
      var $paragraph = $section.siblings('p');

      $paragraph.find('a').filter(function(index, element){
        return element.innerText === icParentMatchText[icOf($section.text())];
      }).addClass('selected');

      boldLinksTo($section.parent());
    }
  }

  $(window).on('hashchange', init);

  var $derivation = $('<div id="#_derivation"></div>').appendTo($moss);
  $moss.prepend($('<h3></h3>').text(subjectOf(lines[0])));

  init();

  // var sections = $('section').toArray();
  // window.setInterval(function() {
  //   var $section = $(sections.shift());
  //   display($section);
  //   sections.push($section);
  // }, 2000);
}
