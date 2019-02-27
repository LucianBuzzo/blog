---
title: Writing bad Javascript micro libraries
date: "2015-05-27T17:00:00.000Z"
---

Like many developers, I have a few Javascript libraries that turn to again and
again. I often find myself loading the full
[jQuery](https://jquery.com/) and
[lodash](https://lodash.com/), libraries only to use a handful of methods from each of them.
I'd had it in my mind for a while to write a replacement library for lodash that would
provide a few utility methods like array mapping and type checking but I had
never really got around to actually doing anything. Last Friday I got into
a little back and forth with our new team member Chris Quinn when he sent
me a 3 line Javascript "framework" that deleted cookies. It got me thinking, how
many lines of code do you actually need to make a usable cookie library?

Ideas started churning and I quickly hacked out a rough version of a tiny cookie
library - it was pretty sloppy and didn't work particularly well, but I was
captivated by the idea of seeing what else I could come up with. I tried to get my
fellow developers involved in a weekend hack, but my cries of "Lib Wars!" fell
on deaf ears:  this was going to be a solo mission.

Over the bank holiday I wrote a further 7 Javascript libraries. The goal was to keep them as small as
possible, providing a knife edge of usefulness. I think some of them were
a genuine success, other were pretty miserable failures. I learnt a lot about
writing vanilla Javascript and had a lot of fun. None of them have any
documentation and are barely tested beyond the latest version of chrome (and
even then I'm sure they're all pretty buggy). I thought I'd detail what I learnt
on each of them here (warning: experienced JS devs may experience extended eye-rolling).

[Biscuit](https://github.com/LucianBuzzo/biscuit)
-

Biscuit is the finished version of the cookie lib that kicked it all off. The
name was stolen from Chris in a friendly attempt to draw him into the failed
"Lib Wars" hackathon. Embarrassingly, Biscuit exposed my terrible lack of
understanding when it came to getting and setting cookies through Javascript.
From [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)

>document.cookie is an accessor property with native setter and getter functions,
>and consequently is not a data property with a value: what you write is not the
>same [as when] you read, everything is always mediated by the JavaScript interpreter.

When setting a cookie you need to assign a string value in the form `KEY=VALUE` to the document.cookie
variable like so `document.cookie = 'foo=bar'`. Additional parameters can be
added by appending them to the string, seperated by `; `. For example, to set a
a cookie to the current domain that will apply to all paths you would use:

    document.cookie = foo=bar; domain=mydomain.com; path=/

I'd previously only used the (excellent)
[jquery-cookie](https://github.com/carhartl/jquery-cookie) plugin, which
conveniently wraps document.cookie manipulation into something a little easier
to digest, so this was a bit of an eye-opener for me.
I think the finished product was a success, it's not very flexible but it does
what it says on the tin.


[Balsa](https://bitbucket.org/snippets/gravitywell_ltd/97jq/js)
-

I have to hold my hands up and admit that I had already written a portion of
this library, but I'm including it here because I finished it during my mini hack.
The aim of Balsa was to provide my most used methods from the lodash library in
a smaller package. The big headscratcher for me was figuring out how to write
a function that provides methods that can be accessed through dot notation. The
solution turned out to be surprisingly straightforward. After defining a function,
simply attach methods to it using dot notation.

    function myFunc() {
      return 'foobar';
    }

    myFunc.hello = function() {
      return 'world';
    }

    myFunc();
    // -> foobar

    myFunc.hello();
    // -> world

You could also assign methods to a function using brackets.

    function multiply(x, y) {
      return x * y;
    }

    function add(x, y) {
      return x + y;
    }

    var methods = [multiply, add];

    methods.forEach( function( method ) {
      myFunc[method.name] = method;
    });

    myFunc.add(1, 1);
    // -> 2

    myFunc.multiply(2, 2);
    // -> 4

I'm definitely happy with how Balsa turned out and with some polish and testing
I could see myself using it in a production site. Working on Balsa really upped
my confidence with using function attributes (name, arguments etc) and methods
like
[`call()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
and
[`apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply).



[Awful](https://bitbucket.org/snippets/gravitywell_ltd/Kde5/awfuljs)
-

A while ago I came across their Stackoverflow question [Do DOM tree elements with
ids become global
variables?](http://stackoverflow.com/questions/3434278/do-dom-tree-elements-with-ids-become-global-variables).
This highlighted the behaviour where giving an element an id attribute
adds it to it's parent window element. E.g.

    <h1 id="title">A page title</h1>
    <script>
      alert(window.title.innerText); // -> 'A page title'
    </script>

I thought it would be fun to try and wrap this up into a data binding framework
but it wasn't particularly successful. Changing the values of elements through
the global namespace was already too easy - wrapping it in another Javascript
function just didn't make any sense. If you can come up with an interesting
way to use this behaviour [send me a pull
request](https://bitbucket.org/lbuzzo/awful-js/)!.


[Pantry](https://github.com/LucianBuzzo/pantry)
-

This is a simple alternative to HTML5 storage that stores data as JSON in
[`window.name`](https://developer.mozilla.org/en-US/docs/Web/API/Window/name).
Writing Pantry was quick and fun, I didn't learn much but it was good exercise
in writing concise functions. I'd be interested in doing some testing and seeing
how practical this is as a lightweight method of storing small amounts of application data.


[Quentin](https://github.com/LucianBuzzo/quentin)
-

Recently I've found myself using jQuery for changing CSS classes and DOM
traversal (`find`, `parents`, `children` etc). I wrote Quentin as a replacement
for jQuery that would provide these functions for me in a smaller package (2.4KB minified).
I used
[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
to retrieve arrays of matched elements. The
[NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) returned
is converted to an array which then has the Quentin methods applied to it.
I was keen to have jQuery style chaining of methods e.g:

    $('ul').find('li').first().addClass('active')

This proved to be particularly tricky. My solution was to use a helper function
to assign the Quentin methods to a provided collection. If the return value
from the Quentin method could have other Quentin methods applied to it, then
I use the helper to attach those functions before returning a value.
The helper function utilises
"[currying](https://javascriptweblog.wordpress.com/2010/04/05/curry-cooking-up-tastier-functions/)"
with the help of a method borrowed from the handsome and generous [Angus
Croll](https://javascriptweblog.wordpress.com/).

    var methods = [
      addClass, removeClass, hasClass, find, first, last, eq, data, siblings,
      parent, children, toggleClass
    ];

    function wrapMethods(collection) {
      console.log(collection);
      methods.forEach(function(method) {
        collection[method.name] = method.curry(collection);
      });
      collection.find = find.curry(collection);
      return collection;
    }

It's not particularly pretty or performant, but it does work! I will most likely
revisit Quentin in the future and try to improve its processing speed.

Overall I'm really pleased with how Quentin turned out. I really recommend
trying out a jQuery-less approach to DOM selectors if you haven't before.



[Loadly](https://github.com/LucianBuzzo/loadly)
-

Loadly is inspired by [Glen Chiacchieri](http://glench.com/hash) and the
[cli](https://github.com/chriso/cli) node module. It provides a progress bar and
a spinner that are displayed in the browser's URL bar using a hash fragment.
I experimented with using `document.title` to display the loader which also had
some interesting effects.

It's fun and hacky and probably shouldn't be used anywhere serious!


[EnBasic](https://github.com/LucianBuzzo/enbasic-js)
-

[Ogden's basic english](http://ogden.basic-english.org/) is a list of 850 words
that, when learnt, *"are sufficient for ordinary communication in idiomatic
English"*. The [combined word list](http://ogden.basic-english.org/word2000.html)
extends the original 850 words to around 2000, providing and approximate minimum
standard English world list that, when learnt, should allow a student to
proceed on their own without difficulty.
I liked the idea of building a tool that could check text content against this
word list and "mark" words that are not considered *Basic English*. I could then
replace these words with text that would, hopefully, be easier to understand for
people whose first language is not English.
Regular expressions alongside the string methods [`match()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match)
and
[`replace`](https://developer.mozilla.org/en-US/docs/Web/EXSLT/regexp/replace)
  were the key to making EnBasic work.
EnBasic is essentially a spelling checker and could be easily adapted to run checks
against any list of words.


[Luigi](https://github.com/LucianBuzzo/luigi)
-

Luigi provides an itty bitty replacement for my most used jQuery ajax methods.
I was suprised at how simple it was to implement basic get requests in vanilla Javascript.
POST request were a little trickier, so I went with the straightforward method
of sending payload data as JSON.

    function post(url, data, callback) {
      var req = new XMLHttpRequest();
      req.onload = function() {
        callback(req.responseText);
      };
      var segments = [];
      req.open('post', url, true);
      req.setRequestHeader('Content-Type', 'application\/json');
      req.send(JSON.stringify(data));
      return req;
    }

One of my favourite methods from Luigi is `pickHTML`. Its behaviour is very
similar to [`jQuery.load()`](https://api.jquery.com/load/), but simply returns
the HTML string instead of inserting it into the DOM. The regex used in this
method is sourced from the must read article [HTML in
XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/HTML_in_XMLHttpRequest)
on MDN.

    function pickHTML(html, elementId) {
      var regexp = new RegExp("<(?!\!)\\s*([^\\s>]+)[^>]*\\s+id\\=[\"\']" + elementId + "[\"\'][^>]*>" ,"i");
      var res = regexp.exec(html);
      console.log(res);
      return res ? (new RegExp('(?:(?:.(?!<\\s*' + res[1] + '[^>]*[>]))*.?<\\s*' + res[1] + '[^>]*[>](?:.(?!<\\s*\/\\s*' + res[1] + '\\s*>))*.?<\\s*\/\\s*' + res[1] + '\\s*>)*(?:.(?!<\\s*\/\\s*' + res[1] + '\\s*>))*.?', 'i')).exec(html.slice(html.indexOf(res[0]) + res[0].length))[0] || '' : '';
    }

Browser support for Luigi seems pretty solid and I think with a little more
work and polish it could be viable for production use.


[ThickFrames](https://bitbucket.org/snippets/gravitywell_ltd/yLBA)
-

This was originally going to be a [Shadow DOM](http://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/)
utility wrapper for web components until I saw the
[caniuse.com](http://caniuse.com/#feat=shadowdom) page for Shadow DOM. I wasn't
keen on using a polyfill and I didn't want to use technology that wasn't
implemented in the majority of browsers, so I went with iframes.
My first attempt looked something like this:

    <div data-role="frame" data-source="some/component.html"></div>

    <script>
      function init(node) {
        var nodes = toArray(document.querySelectorAll('[data-role="frame"]'));
        nodes.forEach(function(node) {
          node.innerHTML = '<iframe src="' + node.dataset.source + '"></iframe>';
        });
      }
    </script>

This immediately presented three problems I wanted to solve:

- iframes are automatically set to a static width and height which screws up the
  page's layout and displays scrollbars everywhere.
- Scripts inside the iframes can't access global variables in the parent window
- CSS styles declared in the parent window don't get applied inside the iframes

For the first issue, I wrote a small function that sets the iframe's height to that of its internal
`document` element's `scrollHeight` attribute. As the `scrollHeight` value can
sometimes return a decimal value, I round it up and add 1 pixel to make sure we
don't see any scroll bars.

Injecting Javascript global variables from the parent window and making them
available on load had me stumped until I realized that I could create "empty"
iframes by not giving them a `src` attribute (this is a method used by a lot of
WYSIWYG editors to isolate styles). After creating the empty iframe I can access
its `contentWindow` property and assign any variables I want before injecting
HTML content using
[`document.write()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write).

Applying CSS styles is a little bit brutal and involves using
[`cloneNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode)
to copy styles out of the parent window into the iframe, with any external files
hopefully being served by the browser cache!

I'm keen on continuing the development of ThickFrames as I think it shows some promise.
I definitely need to make a few changes, for example removing the use of
`data-role` to prevent any unintentional conflict with the [ARIA role
model](http://www.w3.org/TR/wai-aria/roles).


All in all I had a bunch of fun writing all of these and the experience has
deepened my understanding of front end web development and really
boosted my confidence in writing Javascript unaided by libraries.
I will continue to work on these as side projects, hopefully adding
documentation and unit tests!

Bitbucket repositories for all of the libraries I've talked about above are listed here:

- [Biscuit](https://bitbucket.org/lbuzzo/biscuit-js/)
- [Balsa](https://bitbucket.org/lbuzzo/Balsa)
- [Awful](https://bitbucket.org/lbuzzo/awful-js/)
- [Pantry](https://bitbucket.org/lbuzzo/pantry-js/)
- [Quentin](https://bitbucket.org/lbuzzo/quentin-js/)
- [Loadly](https://bitbucket.org/lbuzzo/loadly-js)
- [EnBasic](https://bitbucket.org/lbuzzo/enbasic-js)
- [Luigi](https://bitbucket.org/lbuzzo/luigi-js)
- [ThickFrames](https://bitbucket.org/lbuzzo/frames/)
