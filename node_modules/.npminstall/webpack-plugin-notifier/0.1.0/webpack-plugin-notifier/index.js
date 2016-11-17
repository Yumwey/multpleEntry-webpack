var notifier = require('node-notifier');

function NotifierPlugin(options) {

  if (typeof options !== "object") options = {};
  options.warnings = 'warnings' in options ? !!options.warnings : true;

  this.plugin('done', function (stats) {
    var msg = getCompileMessage(stats);

    if (msg) {
      // var contentImage = 'contentImage' in options ? this.options.contentImage : path.join(__dirname, '../logo.png');

      notifier.notify({
        title: options.title || 'Webpack Error',
        message: msg
        // contentImage: contentImage,
        // icon: process.platform === 'win32' ? contentImage : undefined
      });
    }
  }.bind(this));

  function getCompileMessage(stats) {
    var message = '';

    var compilation = stats.compilation;
    var obj = {
      errors: compilation.errors.map(formatError),
      warnings: compilation.warnings.map(formatError)
    };

    if (obj.errors) {
      obj.errors.forEach(function (error) {
        message += '\r\n';
        message += 'ERROR in ' + error;
        message += '\r\n';
      });
    }

    if (options.warnings && obj.warnings) {
      obj.warnings.forEach(function (warning) {
        message += '\r\n';
        message += 'WARNING in ' + warning;
        message += '\r\n';
      });
    }

    return message;
  }

  function formatError(e) {
    var RequestShortener = require('webpack/lib/RequestShortener');
    var requestShortener = new RequestShortener(process.cwd());

    var text = '';
    e = typeof e === 'string' ? {message: e} : e;

    if (e.chunk) {
      text += "chunk " + (e.chunk.name || e.chunk.id) +
        (e.chunk.entry ? " [entry]" : e.chunk.initial ? " [initial]" : "") + "\n";
    }
    if (e.file) {
      text += e.file + "\n";
    }
    if (e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === "function") {
      text += e.module.readableIdentifier(requestShortener) + "\n";
    }

    text += e.message;

    if (e.dependencies && e.origin) {
      text += '\n @ ' + e.origin.readableIdentifier(requestShortener);
      e.dependencies.forEach(function (dep) {
        if (!dep.loc) return;
        if (typeof dep.loc === "string") return;
        if (!dep.loc.start) return;
        if (!dep.loc.end) return;
        text += " " + dep.loc.start.line + ":" + dep.loc.start.column + "-" +
          (dep.loc.start.line !== dep.loc.end.line ? dep.loc.end.line + ":" : "") + dep.loc.end.column;
      });
    }

    return text;
  }

}

module.exports = NotifierPlugin;
