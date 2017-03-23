angular.module('templates.app', ['about.tpl.html', 'api.tpl.html', 'browser-tools.tpl.html', 'landing.tpl.html', 'team.tpl.html']);

angular.module("about.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("about.tpl.html",
    "<div class=\"page about\">\n" +
    "    <h1>About</h1>\n" +
    "    <p>\n" +
    "        An oaDOI link is like a DOI, with a useful difference: if there's an open access version\n" +
    "        of the article, the oaDOI URL will send you there, instead of the paywalled article\n" +
    "        landing page. So for instance,\n" +
    "\n" +
    "    </p>\n" +
    "    <ul>\n" +
    "        <li>This DOI links you a paywall page <a href=\"http://doi.org/10.1038/nature12373\"><strong>doi.org</strong>/10.1038/nature12373</a>,</li>\n" +
    "        <li>but this oaDOI link gets you a PDF <a href=\"http://oadoi.org/10.1038/nature12373\"><strong>oadoi.org</strong>/10.1038/nature12373</a></li>\n" +
    "    </ul>\n" +
    "    <p>The oaDOI system was inspired by <a href=\"http://doai.io/\">DOAI.</a> It improves\n" +
    "        on their coverage, and offers\n" +
    "        <a href=\"/api\">an API</a> with license information and other details. It's in\n" +
    "        <a href=\"https://github.com/Impactstory/oadoi\">active development</a> by the\n" +
    "\n" +
    "\n" +
    "        <a href=\"/team\">Impactstory team.</a>\n" +
    "        \n" +
    "        <p>\n" +
    "\n" +
    "    <h2 id=\"data-source\">Data Sources</h2>\n" +
    "    <div>\n" +
    "        We look for open copies of articles using the following data sources:\n" +
    "        <ul>\n" +
    "            <li>The <a href=\"https://doaj.org/\">Directory of Open Access Journals</a> to see if it’s in their index of OA journals.</li>\n" +
    "            <li><a href=\"http://crossref.org/\">CrossRef’s</a> license metadata field, to see if the publisher has reported an open license.</li>\n" +
    "            <li>Our own custom list DOI prefixes, to see if it's in a known preprint repository.</li>\n" +
    "            <li><a href=\"http://datacite.org/\">DataCite</a>, to see if it’s an open dataset.</li>\n" +
    "            <li>The wonderful <a href=\"https://www.base-search.net/\">BASE OA search engine</a> to see if there’s a Green OA copy of the article.\n" +
    "            BASE indexes 90mil+ open documents in 4000+ repositories by harvesting OAI-PMH metadata.</li>\n" +
    "            <li>Repository pages directly, in cases where BASE was unable to determine openness.</li>\n" +
    "            <li>Journal article pages directly, to see if there’s a free PDF link (this is great for detecting hybrid OA)</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2 id=\"errors\">Fixing errors</h2>\n" +
    "    <div class=\"section\">\n" +
    "        <p>\n" +
    "            We make a lot of errors. First of all, some open repositories are not yet\n" +
    "            <a href=\"https://www.base-search.net/about/en/about_sources_date.php?menu=2&submenu=1\">indexed by BASE</a>\n" +
    "            (which is where most of our Green OA information comes from). Then typos,\n" +
    "            dead links, and inconsistent formatting add up to create lots more chances to mix up\n" +
    "            connections between fulltext and DOIs.\n" +
    "            The good news is, we're getting better all the\n" +
    "            time, and your feedback helps.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            When you find errors, please let us know by\n" +
    "            <a href=\"https://goo.gl/forms/kFZUUZUeM9ze9uXr2\" target=\"_blank\" >completing this form.</a>\n" +
    "             From there it'll go in our bug\n" +
    "            queue. We'll drop you a line when it's fixed.\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("api.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("api.tpl.html",
    "<div class=\"page api\">\n" +
    "    <h1>API</h1>\n" +
    "    <p>\n" +
    "        The REST API allows programmatic access to read oaDOI's data. It's free and open for anyone to use.\n" +
    "        The rate limit is 25k requests per day, but get in touch if you need more and we'll hook you up.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Please send <code>?email=YOUREMAIL</code> in your requests so we can get in touch if something\n" +
    "        breaks, and so we can report usage to our funders :).\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "    <h2 id=\"return-format\">Endpoints</h2>\n" +
    "\n" +
    "    <div class=\"endpoint\">\n" +
    "        <code class=\"endpoint\">GET /</code>\n" +
    "\n" +
    "        <p>\n" +
    "            Gets information about the API.\n" +
    "            Returns a status object with version number. Try it here:\n" +
    "             <a href=\"https://api.oadoi.org\">https://api.oadoi.org</a>\n" +
    "        </p>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"endpoint\">\n" +
    "        <code class=\"endpoint\">GET /:doi</code>\n" +
    "        <p>\n" +
    "            Gets data about a single DOI.  Try this example:\n" +
    "            <a href=\"https://api.oadoi.org/10.1038/nature12373\">https://api.oadoi.org/10.1038/nature12373</a>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <h2 id=\"return-format\">Return format</h2>\n" +
    "    <div>\n" +
    "        Here's an example of what you get back.\n" +
    "    </div>\n" +
    "    <pre><code class=\"json\">{\n" +
    "      \"doi\": \"10.1038/nature12873\",\n" +
    "      \"doi_resolver\": \"crossref\",\n" +
    "      \"evidence\": \"oa repository (via base-search.net oa url)\",\n" +
    "      \"free_fulltext_url\": \"https://dash.harvard.edu/bitstream/handle/1/12785839/3944098.pdf?sequence=1\",\n" +
    "      \"is_boai_license\": false,\n" +
    "      \"is_free_to_read\": true,\n" +
    "      \"is_subscription_journal\": true,\n" +
    "      \"license\": \"cc-by-nc\",\n" +
    "      \"oa_color\": \"green\",\n" +
    "      \"url\": \"http://doi.org/10.1038/nature12873\"\n" +
    "    }</code></pre>\n" +
    "\n" +
    "    Details on the response field. These are in progress; we'll continue to improve them this week:\n" +
    "    <ul>\n" +
    "        <li><code>doi</code>: the requested DOI</li>\n" +
    "        <li><code>doi_resolver</code>: String. Possible values:\n" +
    "            <ul>\n" +
    "                <li>crossref</li>\n" +
    "                <li>datacite</li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "        <li><code>evidence</code>: String. A phrase summarizing the step of our OA detection process where we found the <code>free_fulltext_url</code>.</li>\n" +
    "        <li><code>free_fulltext_url</code>: String. The url where we found a free-to-read version of the DOI. None when no free-to-read version was found.\n" +
    "        <li><code>is_boai_license</code>: Boolean. True whenever the <code>license</code> is cc-by, cc0, or PD.  This is the highly-regarded <a href=\"http://www.budapestopenaccessinitiative.org/read\">BOAI definition</a> of Open access</li>\n" +
    "        <li><code>is_free_to_read</code>: Boolean. True whenever the <code>free_fulltext_url</code> is not None.</li>\n" +
    "        <li><code>is_subscription_journal</code>: Boolean. True whenever the journal is not in the Directory of Open Access Journals or DataCite.</li>\n" +
    "        <li><code>license</code>: String. Contains the name of the Creative Commons license associated with the <code>free_fulltext_url</code>, whenever we find one.  Example: \"cc-by\".</li>\n" +
    "        <li><code>oa_color</code>: String. Possible values:\n" +
    "            <ul>\n" +
    "                <li>green</li>\n" +
    "                <li>gold</li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "        <li><code>url</code>: the canonical DOI URL</li>\n" +
    "\n" +
    "    </ul>\n" +
    "\n" +
    "    <h2 id=\"versions\">Versions</h2>\n" +
    "    <p>The API <a href=\"http://semver.org/\">is versioned,</a> and the\n" +
    "        <a href=\"https://api.oadoi.org\">API base URL</a> specifies the current version.\n" +
    "        We're committed to supporting major releases (ones that break backwards\n" +
    "        compatibility) for six months. The current major version (v1) came out\n" +
    "        around November 1st, so it'll be supported through April 2017.\n" +
    "    </p>\n" +
    "\n" +
    "    <!--\n" +
    "    <p>If your implementation must be tied to a specific major version of our API, use content-negotiation\n" +
    "        to request that version of the API by sending an <code>ACCEPT</code> header like this:\n" +
    "    </p>\n" +
    "    <pre><code>Accept: application/x.oadoi.v1+json</code></pre>\n" +
    "    -->\n" +
    "\n" +
    "\n" +
    "    <h2 id=\"examples\">Client libraries and example uses</h2>\n" +
    "    The API is still new but there are already some great examples of folks using it. Drop us a line\n" +
    "    if you've got something; we'd love to add you to this list. In no particular order:\n" +
    "    <ul>\n" +
    "        <li>\n" +
    "            <a href=\"https://github.com/njahn82/roadoi\">roadoi</a> is an R wrapper around the oaDOI API.\n" +
    "            Has a nice README that includes a really slick usage example.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"https://github.com/claytonllibrar/oaDOI-LibGuides-Widget\">oaDOI-LibGuides-Widget</a>\n" +
    "            lets you search oaDOI from within a LibGuide. Here's an example from\n" +
    "            <a href=\"http://guides.lib.wayne.edu/c.php?g=174735&p=2659947#s-lg-box-wrapper-14700556\">Wayne State LibGuides.</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"https://www.mpdl.mpg.de/en/services/service-catalog/sfx\">The SFX DOI lookup service</a>\n" +
    "            from Max Planck Digital Library uses oaDOI.\n" +
    "            Here's an <a href=\"http://sfx.mpg.de/sfx_local?id=doi:10.1142/S0219622014500564\">example result,</a>\n" +
    "            and <a href=\"https://devtools.mpdl.mpg.de/projects/vlib/wiki/SFXTargets/oaDOIgetFullTxt\">some documentation</a>\n" +
    "            by <a href=\"https://twitter.com/grumpf/status/791773184764805120\">@grumpf.</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            Zotero can use oaDOI as\n" +
    "            <a href=\"https://www.zotero.org/support/locate\">a lookup engine.</a> Here's\n" +
    "            <a href=\"https://github.com/Impactstory/oadoi/pull/1#issuecomment-255518267\">a screencast of it in action.</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("browser-tools.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("browser-tools.tpl.html",
    "<div class=\"page browser-tools\">\n" +
    "    <h1>Browser tools</h1>\n" +
    "\n" +
    "        <p>\n" +
    "        The power of oaDOI is now available as a Chrome Extension!  As you browse,\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "    <!--\n" +
    "        <p>\n" +
    "            These tools do more or less the same thing: when you're\n" +
    "            viewing the landing page for a scholarly article, they'll use oaDOI to find\n" +
    "            any open versions of that article. Both of them only work on pages\n" +
    "            with DOIs.\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h2>Chrome Extension</h2>\n" +
    "        <p>\n" +
    "            The beta release is now available! Install it via the Chrome Web Store:\n" +
    "            <a href=\"https://chrome.google.com/webstore/detail/getthepdf/iplffkdpngmdjhlpjmppncnlhomiipha\">\n" +
    "                un\n" +
    "            </a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h2>Bookmarklet <span class=\"beta\">beta</span> </h2>\n" +
    "        <p>\n" +
    "            Drag the link up to your bookmarks toolbar. When you're viewing an article\n" +
    "            landing page, click the bookmark. If we can find open fulltext for it anywhere,\n" +
    "            we'll redirect you there.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <span class=\"instructions\">\n" +
    "                Drag this link to your bookmarks toolbar:\n" +
    "            </span>\n" +
    "            <a class=\"bookmarklet-link\" href=\"javascript:(function () {var jsCode = document.createElement('script'); jsCode.setAttribute('src', '//oadoi.org/browser-tools/bookmarklet.js');document.body.appendChild(jsCode);  }());\">oaDOI it</a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <p>\n" +
    "            The tool is in beta right now, so we're really interested in your feedback.\n" +
    "            <a href=\"mailto:team@impactstory.org\">Drop us a line</a> with bug reports\n" +
    "            and feature ideas!\n" +
    "        </p>\n" +
    "\n" +
    "    -->\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("landing.tpl.html",
    "<div class=\"page landing\">\n" +
    "    <div class=\"top-screen\" layout=\"row\" layout-align=\"center center\">\n" +
    "        <div class=\"content\">\n" +
    "            <div class=\"main-banner\">\n" +
    "                <div class=\"tagline\">\n" +
    "                    <span class=\"number\">{{ d.numServed }}</span>\n" +
    "                    <span class=\"text\">fulltext articles served.</span>\n" +
    "                </div>\n" +
    "                <div class=\"subtagline\">\n" +
    "                    Search our database of over 100 million scholarly resources\n" +
    "                    and find free fulltext from open-access repositories worldwide.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"products\">\n" +
    "                <div class=\"product unpaywall\">\n" +
    "                    <div class=\"text\">\n" +
    "                        <h2>\n" +
    "                            <i class=\"fa fa-user\"></i>\n" +
    "                            Everyone\n" +
    "                        </h2>\n" +
    "                        <div class=\"about\">\n" +
    "                            The Unpaywall browser extension\n" +
    "                            bypasses paywalls as you browse. Installed by\n" +
    "                            500 new users every day.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"cta\">Install it now</div>\n" +
    "                </div>\n" +
    "                <div class=\"product sfx\">\n" +
    "                    <div class=\"text\">\n" +
    "                        <h2>\n" +
    "                            <i class=\"fa fa-university\"></i>\n" +
    "                            Libraries\n" +
    "                        </h2>\n" +
    "                        <div class=\"about\">\n" +
    "                            Our SFX integration adds millions of open-access articles\n" +
    "                            to your library's holdings. Used by 600 libraries worldwide.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"cta\">Learn more</div>\n" +
    "                </div>\n" +
    "                <div class=\"product api\">\n" +
    "                    <div class=\"text\">\n" +
    "                        <h2>\n" +
    "                            <i class=\"fa fa-cogs\"></i>\n" +
    "                            Developers\n" +
    "                        </h2>\n" +
    "                        <div class=\"about\">\n" +
    "                            Build your own apps or do research using\n" +
    "                            our free, open, and scalable REST API.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"cta\">Read the docs</div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("team.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team.tpl.html",
    "<div class=\"page team\">\n" +
    "    <h1>Team</h1>\n" +
    "    <p>\n" +
    "        oaDOI is being built at <a href=\"http://impactstory.org\">Impactstory</a>\n" +
    "        by <a href=\"http://twitter.com/researchremix\">Heather Piwowar<a/> and\n" +
    "        <a href=\"http://twitter.com/jasonpriem\">Jason Priem</a>, funded by the Alfred P. Sloan foundation.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        We'd like to thank all of the people who've worked on earlier projects\n" +
    "        (<a href=\"http://ananelson.github.io/oacensus/\">OA Census</a>,\n" +
    "        <a href=\"https://github.com/CottageLabs/OpenArticleGauge\">Open Article Gauge</a>,\n" +
    "        <a href=\"http://dissem.in/\">Dissemin</a>,\n" +
    "        <a href=\"https://cottagelabs.com/ \">Cottage Labs</a>, and the\n" +
    "        <a href=\"https://openaccessbutton.org/\">Open Access Button</a>)\n" +
    "        for sharing ideas in conversations and open source code -- in particular <a href=\"http://doai.io/\">DOAI</a>\n" +
    "        for inspiring the DOI resolver part of this project.  Thanks also to <a href=\"/about\"> the\n" +
    "        data sources</a> that make oaDOI possible.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        All of the code behind oaDOI is <a href=\"http://github.com/impactstory/oadoi\">open source on GitHub</a>.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Questions or ideas?  You can reach us at <a href=\"mailto:team@impactstory.org\">team@impactstory.org</a>\n" +
    "        or <a href=\"http://twitter.com/oadoi_org\">@oadoi_org</a>.\n" +
    "    </p>\n" +
    "</div>\n" +
    "");
}]);
