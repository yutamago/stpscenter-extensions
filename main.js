// ==UserScript==
// @name         STP Center Extensions
// @namespace    http://consiliari.de/
// @version      0.1
// @author       Yutamago
// @match        https://center-stps.stpag.de/TimeSheet/Index/*
// @icon         https://www.google.com/s2/favicons?domain=stpag.de
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function( obj, callback ){
            if( !obj || obj.nodeType !== 1 ) return;

            // define a new observer
            var mutationObserver = new MutationObserver(callback)

            // have the observer observe foo for changes in children
            mutationObserver.observe( obj, { childList:true, subtree:true })
            return mutationObserver;
        }
    })();

    function addButtons() {
        var dateControls = document.querySelector('.modal#modalEditActivity > .modal-body > .control-group > .controls');
        if(!!dateControls.querySelector('#lastDateBtn')) return;

        var dateInput = dateControls.querySelector('input#Date');
        var lastDateBtn = document.createElement('button');
        lastDateBtn.setAttribute('id', 'lastDateBtn');
        lastDateBtn.setAttribute('type', 'button');
        lastDateBtn.classList.add('btn');
        lastDateBtn.classList.add('btn-primary');
        lastDateBtn.append('Letztes Datum');
        lastDateBtn.onclick = function() {
            var lastDate = getCookie('form-lastDate');
            if(lastDate === null) return;

            dateInput.value = lastDate;
        };
        dateControls.append(lastDateBtn);

        var saveButton = document.querySelector('.modal#modalEditActivity > .modal-footer > button[type=submit]');
        var saveDate = function() {
            setCookie('form-lastDate', dateInput.value, 10 * 365);
        };
        saveButton.addEventListener('mouseenter', saveDate);
        saveButton.addEventListener('focusin', saveDate);

        /*var previousDayBtn = document.createElement('button');;
        previousDayBtn.setAttribute('type', 'button');
        previousDayBtn.classList.add('btn');
        previousDayBtn.append('-1');
        lastDateBtn.onclick = function() {
            var currentDate = new Date(dateInput.value);
            dateInput.value = currentDate.;
        };
        dateControls.append(previousDayBtn);

        var nextDayBtn = document.createElement('button');;
        nextDayBtn.setAttribute('type', 'button');
        nextDayBtn.classList.add('btn');
        nextDayBtn.append('+1');
        dateControls.append(nextDayBtn);*/
    }

    function setTaetigkeitSonstiges() {
        var taetigkeit = document.querySelector('select#Taetigkeit');
        taetigkeit.value = 'Sonstiges';
        taetigkeit.setAttribute('aria-invalid', 'false');
        var controlGroup = taetigkeit.parentElement.parentElement;
        if(!controlGroup.classList.contains('success')) {
            controlGroup.classList.add('success');
        }
    }

    function activateDescription() {
        var beschreibung = document.querySelector('textarea#Description');
        if(beschreibung.hasAttribute('readonly')) {
            beschreibung.removeAttribute('readonly');
        }
    }

    function changeModal() {
        setTaetigkeitSonstiges();
        activateDescription();
    }

    const body = document.querySelector('body');
    observeDOM(body, function(x){
        if(!x.length || !x[0].addedNodes || !x[0].addedNodes.length) return;

        if(body.querySelector('form > .modal')) {
            setTimeout(changeModal, 500);
            addButtons();
        }
    });
})();
