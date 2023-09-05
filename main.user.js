// ==UserScript==
// @name         AtCoder Favs Selector
// @version      114.514
// @description  1919810
// @author       Homo
// @match        https://atcoder.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// ==/UserScript==

const preDefinedColor = {
    'cmk666': ['style', 'color: #996600']
};

const queryColor = user => {
    if(user in preDefinedColor) return preDefinedColor[user];
    let color = null;
    $.ajax({
        url: '/users/' + user,
        async: false,
        success: HTML => {
            var span = $.parseHTML(HTML)[57].querySelector('div.row > div.col-md-3.col-sm-12 > h3 > a > span');
            if(span.className == '') color = ['style', 'color: ' + span.style.color];
            else color = ['class', span.className];
        }
    });
    return color;
}

const queryAC = (prob, user) => {
    try{
        var table = null;
        $.ajax({
            url: '/contests/' + prob.split('_')[0] + '/submissions?f.Task=' + prob + '&f.Status=AC&f.User=' + user,
            async: false,
            success: HTML => {
                table = $.parseHTML(HTML)[72].querySelector("div.row > div:nth-child(3) > div.panel.panel-default.panel-submission > div.table-responsive > table");
            }
        });
        return table != null;
    } catch(e){
        return false;
    }
}

const queryFavs = () => {
    let list = null;
    $.ajax({
        url: '/settings/fav',
        async: false,
        success: HTML => {
            eval($.parseHTML(HTML, keepScripts = true)[71].querySelector("div.row > div:nth-child(3) > script:nth-child(4)").innerText);
            list = favs;
        }
    });
    return list;
}

const main = () => {
    if(location.href.split('/')[location.href.split('/').length - 1].split('_').length != 2) return;
    let favs = queryFavs(), list = [];
    for(var id in favs){
        var token = location.href.split('/');
        if(queryAC(token[token.length - 1], favs[id])) list[list.length] = favs[id];
    }
    if(list == []) return;
    var para = document.createElement('p');
    para.appendChild(document.createTextNode('Solved: '));
    for(var id in list){
        var span = document.createElement('span');
        var color = queryColor(list[id]);
        var link = document.createElement('a');
        link.setAttribute('class', 'username');
        link.setAttribute('href', '/users/' + list[id]);
        span.setAttribute(color[0], color[1]);
        span.innerText = list[id];
        link.appendChild(span);
        para.appendChild(link);
        if(id < list.length - 1) para.appendChild(document.createTextNode(', '));
    }
    para.appendChild(document.createTextNode('.'));
    var div = document.querySelector("#main-container > div.row > div:nth-child(2)")
    div.insertBefore(para, div.firstChild)
}

main();
