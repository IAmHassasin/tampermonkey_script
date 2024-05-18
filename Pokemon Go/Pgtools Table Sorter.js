// ==UserScript==
// @name         Table Sorter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://pgtools.net/rocket-grunt
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pgtools.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function calculateDistance(coord1, coord2) {
        const [x1, y1] = coord1.split(',').map(Number);
        const [x2, y2] = coord2.split(',').map(Number);
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    function sortTableByDistance(table, inputCoords) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.rows);
        rows.sort((rowA, rowB) => {
            const coordA = rowA.cells[1].textContent.trim().split(' ')[0];
            const coordB = rowB.cells[1].textContent.trim().split(' ')[0];
            const distanceA = calculateDistance(inputCoords, coordA);
            const distanceB = calculateDistance(inputCoords, coordB);
            return distanceA - distanceB;
        });
        rows.forEach(row => tbody.appendChild(row));
    }

    function createInputElement(th, table) {
        if (th.querySelector('input')) return;
        const inputContainer = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter coordinates';
        const button = document.createElement('button');
        button.textContent = 'Apply';

        button.addEventListener('click', () => {
            const coords = input.value.trim();
            if (coords.match(/^-?\d*\.?\d*,-?\d*\.?\d*$/)) {
                sortTableByDistance(table, coords);
            } else {
                alert('Please enter valid coordinates (format: x,y)');
            }
        });

        inputContainer.appendChild(input);
        inputContainer.appendChild(button);
        th.appendChild(inputContainer);
    }

    function addInputToHeader() {
        const tableContainer = document.querySelector('.MuiTableContainer-root');
        if (!tableContainer) return;
        const table = tableContainer.querySelector('table');
        if (!table) return;
        const thead = table.querySelector('thead');
        if (!thead) return;
        const th = thead.querySelectorAll('th')[1]; // 2nd th element
        if (th) {
            createInputElement(th, table);
        }
    }

    function waitForTableToLoad() {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const tableContainer = document.querySelector('.MuiTableContainer-root');
                    if (tableContainer) {
                        const table = tableContainer.querySelector('table');
                        if (table) {
                            const tbody = table.querySelector('tbody');
                            if (tbody) {
                                observer.disconnect();
                                addInputToHeader();
                            }
                        }
                    }
                }
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    waitForTableToLoad();
})();