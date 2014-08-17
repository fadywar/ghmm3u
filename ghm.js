var url = require('url');
var http = require('http');
var fs = require('fs');
var vm = require('vm');
var zlib = require('zlib');

var browser = require('./browser');

var href = 'http://w.zt6.nl/tvmenu/code.js.gz';
var options = url.parse('http://w.zt6.nl/tvmenu/code.js.gz');

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function contains(array, k) {
  for(p in array)
     if(array[p] === k)
        return true;
  return false;
}

var req = http.request(options, function(res) {
	var buffers = [];
	
	res.on('data', function (chunk) {
		buffers.push(chunk);
	});

	res.on('end', function () {
		var buffer = Buffer.concat(buffers);

		zlib.gunzip(buffer, function(error, result) {
			if (error == null) {
				var context = browser.getContext(href);
				vm.runInNewContext(result, context);

				var file = fs.createWriteStream("ghm.m3u8");
				var tags = {};
				file.write("#EXTM3U\n");
				for (var tid in context.I.menu_tv.c) {
					var tag = context.I.menu_tv.c[tid];
					var name = tag.b.default;
					if (context.I[tag.S] != undefined) {
						var channels = [];
						for (var channel in context.I[tag.S].c) {
							channels.push(context.I[tag.S].c[channel].f);
						}

						tags[name] = channels;
					}
				}
				for (var id in context.H) {
					var channel = context.H[id];
					if (channel.d[0] != undefined) {
						var channelTags = [];
						for (var tag in tags) {
							if (contains(tags[tag], channel.k))
								channelTags.push(tag);
						}

						for (var stream in channel.d) {
							var name = channel.b.default;
							if (channel.d[stream].b != undefined)
								name = name + " " + channel.d[stream].b.default;
							else if (channel.d[stream].N != undefined)
								name = name + " HD";

							file.write("#EXTINF:"+channel.k+","+name+"\n");
							file.write("#EXTTV:"+channelTags.join(",")+";\n");
							
							var stream = channel.d[stream].h;
							if (endsWith(stream, ";rtpskip=yes"))
								stream = "rtp" + stream.substring(4, stream.length-12);
							else
								stream = "udp" + stream.substring(4);

							file.write(stream+"\n");
						}
					}
				}
				file.end();
				file.on('finish', function() {
					process.exit();
				});
			} else {
				console.log("Can't decompress file: " + error.message);
			}
		});
	});
});

req.on('error', function(e) {
	console.log("Can't download file: " + e.message);
});

req.end();
