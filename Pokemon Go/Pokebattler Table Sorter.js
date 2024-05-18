// ==UserScript==
// @name         Table Sorter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort HTML tables by clicking on the headers
// @author       You
// @match        https://www.pokebattler.com/raids/attackers/rankings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokebattler.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to sort table
    function sortTable(table, col, reverse) {
        var tb = table.tBodies[0],
            tr = Array.prototype.slice.call(tb.rows, 0),
            i;
        reverse = -((+reverse) || -1);
        tr = tr.sort(function (a, b) {
            var aText = a.cells[col].querySelector('img').alt.split('_').pop();
            var bText = b.cells[col].querySelector('img').alt.split('_').pop();
            return reverse * (aText.localeCompare(bText));
        });
        for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]);
    }

    // Function to make table sortable
    function makeSortable(table, tableData) {
        var th = table.tHead.rows[0].cells;
        for (var i = 0; i < th.length; i++) {
            if (th[i].textContent === 'Fast Move' || th[i].textContent === 'Charge Move') {
                (function(i) {
                    th[i].addEventListener('click', function() {
                        sortTable(tableData, i, this.asc = !this.asc);
                    });
                }(i));
            }
        }
    }

    // Function to find and make the specific table sortable
    function makeSpecificTableSortable() {
        var mainDivCollection = document.getElementsByClassName('col-xs-12 col-md-8 col-md-offset-2');
        var mainDiv = mainDivCollection[0].firstChild;
        if (mainDiv) {
            var table = mainDiv.querySelector('div:nth-child(2) table');
            if (table) {
                var theadTable = mainDiv.querySelector('div:nth-child(1) table');
                if (theadTable && theadTable.tHead) {
                    makeSortable(theadTable, table);
                }
            }
        }
    }

    // Run the sorting function after the page is fully loaded
    window.addEventListener('load', function() {
        makeSpecificTableSortable();
    });

})();