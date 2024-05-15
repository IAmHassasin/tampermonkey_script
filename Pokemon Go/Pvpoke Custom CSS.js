// ==UserScript==
// @name     Pvpoke Custom CSS
// @include  https://pvpoke.com/team-builder/all/1500/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0. It restores the sandbox.

    If in Tampermonkey, use "// @unwrap" to enable sandbox instead.
*/

waitForKeyElements (".offense", actionFunction);

function actionFunction (jNode) {
    console.log('Check');
    $("#main").css("max-width", "79%");
}