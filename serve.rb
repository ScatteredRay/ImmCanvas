# Small script to spawn a test web server.
require "WEBrick";
require "webrick/httputils";

s = WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => ".");
trap('INT') { s.shutdown };
s.start
