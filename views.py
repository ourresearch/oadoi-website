from flask import make_response
from flask import request
from flask import redirect
from flask import abort
from flask import render_template
from flask import jsonify
from flask import g
from flask import url_for

import json
import os
import logging
import sys

from app import app


logger = logging.getLogger("views")


def json_dumper(obj):
    """
    if the obj has a to_dict() function we've implemented, uses it to get dict.
    from http://stackoverflow.com/a/28174796
    """
    try:
        return obj.to_dict()
    except AttributeError:
        return obj.__dict__


def json_resp(thing):
    json_str = json.dumps(thing, sort_keys=True, default=json_dumper, indent=4)

    if request.path.endswith(".json") and (os.getenv("FLASK_DEBUG", False) == "True"):
        logger.info(u"rendering output through debug_api.html template")
        resp = make_response(render_template(
            'debug_api.html',
            data=json_str))
        resp.mimetype = "text/html"
    else:
        resp = make_response(json_str, 200)
        resp.mimetype = "application/json"
    return resp


def abort_json(status_code, msg):
    body_dict = {
        "HTTP_status_code": status_code,
        "message": msg,
        "error": True
    }
    resp_string = json.dumps(body_dict, sort_keys=True, indent=4)
    resp = make_response(resp_string, status_code)
    resp.mimetype = "application/json"
    abort(resp)


#support CORS
@app.after_request
def add_crossdomain_header(resp):
    resp.headers['Access-Control-Allow-Origin'] = "*"
    resp.headers['Access-Control-Allow-Methods'] = "POST, GET, OPTIONS, PUT, DELETE, PATCH"
    resp.headers['Access-Control-Allow-Headers'] = "origin, content-type, accept, x-requested-with"

    # without this jason's heroku local buffers forever
    sys.stdout.flush()

    return resp



# @app.before_request
# def stuff_before_request():
#     # redirect everything else to https.
#     new_url = None
#     try:
#         if request.headers["X-Forwarded-Proto"] == "https":
#             pass
#         elif "http://" in request.url:
#             new_url = request.url.replace("http://", "https://")
#     except KeyError:
#         # print "There's no X-Forwarded-Proto header; assuming localhost, serving http."
#         pass
#
#     # redirect to naked domain from www
#     if request.url.startswith("https://www.oadoi.org"):
#         new_url = request.url.replace(
#             "https://www.oadoi.org",
#             "https://oadoi.org"
#         )
#         print u"URL starts with www; redirecting to " + new_url
#
#     if new_url:
#         return redirect(new_url, 301)  # permanent





@app.route("/favicon.ico")
def favicon_ico():
    return redirect(url_for("static", filename="img/favicon.ico"))

@app.route("/browser-tools/bookmarklet.js")
def bookmarklet_js():
    base_url = request.url.replace(
        "browser-tools/bookmarklet.js",
        "static/browser-tools/"
    )

    if "localhost:" not in base_url:
        # seems like this shouldn't be necessary. but i think
        # flask's request.url is coming in with http even when
        # we asked for https on the server. weird.
        base_url = base_url.replace("http://", "https://")

    rendered = render_template(
        "browser-tools/bookmarklet.js",
        base_url=base_url
    )
    resp = make_response(rendered, 200)
    resp.mimetype = "application/javascript"
    return resp



@app.route("/<path:doi>")
@app.route("/")
def index_endpoint(doi=""):

    # the web interface (returns an SPA webpage that runs AngularJS)
    if not doi or not doi.startswith("10."):
        return render_template(
            'index.html'
        )

    # the DOI resolver (returns a redirect)

    # call the api here and then server the redirect
    # return redirect(my_pub.best_redirect_url, 302)  # 302 is temporary redirect
    pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)

















