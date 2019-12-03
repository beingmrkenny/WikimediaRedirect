var url = window.location.href;
if (/https?:\/\/[a-z][a-z]\.(:?wikipedia|wiktionary)\.org/.test(url)) {
    var newUrl = url.replace(/(https?:\/\/)([a-z][a-z])\.(wikipedia|wiktionary)\.org/, "$1$2.m.$3.org");
    window.location.replace(newUrl);
}
