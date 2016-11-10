﻿
//this function can remove a array element.
Array.remove = function (array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id) {
    for (var iii = 0; iii < popups.length; iii++) {
        if (id == popups[iii]) {
            Array.remove(popups, iii);

            document.getElementById(id).style.display = "none";

            calculate_popups();

            return;
        }
    }
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups() {
    var right = 220;

    var iii = 0;
    for (iii; iii < total_popups; iii++) {
        if (popups[iii] != undefined) {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }

    for (var jjj = iii; jjj < popups.length; jjj++) {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name) {

    for (var iii = 0; iii < popups.length; iii++) {
        //already registered. Bring it to front.
        if (id == popups[iii]) {
            Array.remove(popups, iii);

            popups.unshift(id);

            calculate_popups();


            return;
        }
    }

    var element = '<div class="live-chat" id="' + id + '"><header class="clearfix">';
    element = element + '<a href="javascript:close_popup(\'' + id + '\')" class="chat-close">x</a>';
    element = element + '<h4>' + name + '</h4></header>';
    element = element + '<div class="chat"><div class="chat-history"></div>';
    element = element + '<p class="chat-feedback">Tu amigo está escribiendo…</p>';
    element = element + '<form action="#">';
    element = element + '<fieldset><input type="text" placeholder="Escribe tu mensaje…" autofocus>' +
                '<input type="hidden"></fieldset></form></div> <!-- end chat --></div> <!-- end live-chat -->';

    document.getElementById("popcontainer").innerHTML = document.getElementById("popcontainer").innerHTML + element;

    popups.unshift(id);

    calculate_popups();

}

//calculate the total number of popups suitable and then populate the total_popups variable.
function calculate_popups() {
    var width = window.innerWidth;
    if (width < 540) {
        total_popups = 0;
    }
    else {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width / 320);
    }

    display_popups();

}


function autoscroll() {
    // Autoscroll chat
    var height = 0;
    $('#discussion li').each(function (i, value) {
        height += parseInt($(this).height());
    });

    height += '';
    $('#discussion').animate({ scrollTop: height });
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);