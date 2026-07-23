// Assembles the contact address at runtime so it never appears as a
// harvestable string in the page source. Elements marked .js-email keep
// their "name [at] domain" text as the no-JavaScript fallback.
(function () {
  var user = 'web';
  var host = ['michael-siemer', 'com'].join('.');
  var addr = user + String.fromCharCode(64) + host;

  var nodes = document.querySelectorAll('.js-email');
  for (var i = 0; i < nodes.length; i++) {
    var link = document.createElement('a');
    link.href = 'mailto:' + addr;
    link.textContent = addr;
    nodes[i].textContent = '';
    nodes[i].appendChild(link);
  }
})();
