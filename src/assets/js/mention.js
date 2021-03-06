(function(e) {
    e.fn.extend({
        mention: function(t) {
           
            this.opts = {
                users: [],
                delimiter: "@",
                sensitive: true,
                queryBy: ["name", "username"],
                typeaheadOpts: {}
            };  
            var n = e.extend({}, this.opts, t),
        
                r = function() {
                    console.log("value====")
                    if (typeof e == "undefined") {
                        throw new Error("jQuery is Required")
                    } else {
                        if (typeof e.fn.typeahead == "undefined") {
                            throw new Error("Typeahead is Required")
                        }
                    }
                    return true
                },
                i = function(e, t) {
                    var r;
                   
                    for (r = t; r >= 0; r--) {
                        if (e[r] == n.delimiter) {
                            break
                        }
                    }
                    return e.substring(r, t)
                },
                s = function(e) {
                  
                    var t;
                    for (t in n.queryBy) {
                        if (e[n.queryBy[t]]) {
                            var r = e[n.queryBy[t]].toLowerCase(),
                                i = this.query.toLowerCase().match(new RegExp(n.delimiter + "\\w+", "g")),
                                s;
                            if (!!i) {
                                for (s = 0; s < i.length; s++) {
                                    var o = i[s].substring(1).toLowerCase(),
                                        u = new RegExp(n.delimiter + r, "g"),
                                        a = this.query.toLowerCase().match(u);
                                    if (r.indexOf(o) != -1 && a === null) {
                                        return true
                                    }
                                }
                            }
                        }
                    }
                },
                o = function(e) {
                    var t = this.query,
                        r = this.$element[0].selectionStart,
                        i;
                    for (i = r; i >= 0; i--) {
                        if (t[i] == n.delimiter) {
                            break
                        }
                    }
                    var s = t.substring(i, r),
                        o = t.substring(0, i),
                        u = t.substring(r),
                        t = o +" "+ n.delimiter + e+" "+ u;
                       
                    this.tempQuery = t;
             
                
                    localStorage.setItem("mentionValue",t);
                    return t;
                },
                u = function(e) {
                  
                    if (e.length && n.sensitive) {
                        var t = i(this.query, this.$element[0].selectionStart).substring(1),
                            r, s = e.length,
                            o = {
                                highest: [],
                                high: [],
                                med: [],
                                low: []
                            },
                            u = [];
                        if (t.length == 1) {
                            for (r = 0; r < s; r++) {
                                var a = e[r];
                                if (a.username[0] == t) {
                                  
                                    o.highest.push(a)
                                } else if (a.username[0].toLowerCase() == t.toLowerCase()) {
                                    o.high.push(a)
                                } else if (a.username.indexOf(t) != -1) {
                                    o.med.push(a)
                                } else {
                                    o.low.push(a)
                                    
                                }
                            }
                            for (r in o) {
                                var f;
                                for (f in o[r]) {
                                    u.push(o[r][f])
                                }
                            }
                            return u
                        }
                    }
                    return e
                },
                a = function(t) {
                    var r = this;
                    t = e(t).map(function(t, i) {
                        t = e(r.options.item).attr("data-value", i.username).attr('onClick', 'selectmention('+i.id+');');
                      //  t = e(r.options.item).attr('onClick', 'selectmention(this);');
                        var s = e("<div />");
                        if (i.image) {
                            s.append('<img class="mention_image" src="' + i.image + '">')
                        }
                        if (i.name) {
                            s.append('<b class="mention_name">' + i.name + "</b>")
                        }
                        if (i.username) {
                            s.append('<span class="mention_username"> ' + n.delimiter + i.username  + "</span>")
                        }
                        //t.find("a").html("click",selectmention);
                        t.find("a").html(r.highlighter(s.html()));
                       // t.find("a").html("onClick",selectmention());
                        return t[0]
                    });
                    t.first().addClass("active");
                    this.$menu.html(t);
                    return this
                };
            e.fn.typeahead.Constructor.prototype.render = a;
            return this.each(function() {
              
                var t = e(this);
                if (r()) {
                    t.typeahead(e.extend({
                        source: n.users,
                        matcher: s,
                        updater: o,
                        sorter: u
                    }, n.typeaheadOpts))
                }
            })
        }
    })
})(jQuery)

function selectmention(id)
  {

  }






// (function(e){e.fn.extend({mention:function(t){this.opts={users:[],delimiter:"@",sensitive:!0,queryBy:["name","username"],typeaheadOpts:{}};var n=e.extend({},this.opts,t),r=function(){if(typeof e=="undefined"){throw new Error("jQuery is Required")}else{if(typeof e.fn.typeahead=="undefined"){throw new Error("Typeahead is Required")}}
// return!0},i=function(e,t){var r;for(r=t;r>=0;r--){if(e[r]==n.delimiter){break}}
// return e.substring(r,t)},s=function(e){var t;for(t in n.queryBy){if(e[n.queryBy[t]]){var r=e[n.queryBy[t]].toLowerCase(),i=this.query.toLowerCase().match(new RegExp(n.delimiter+"\\w+","g")),s;if(!!i){for(s=0;s<i.length;s++){var o=i[s].substring(1).toLowerCase(),u=new RegExp(n.delimiter+r,"g"),a=this.query.toLowerCase().match(u);if(r.indexOf(o)!=-1&&a===null){return!0}}}}}},o=function(e){var t=this.query,r=this.$element[0].selectionStart,i;for(i=r;i>=0;i--){if(t[i]==n.delimiter){break}}
// var s=t.substring(i,r),o=t.substring(0,i),u=t.substring(r),t=o+" "+n.delimiter+e+" "+u;this.tempQuery=t;console.log(t)
// localStorage.setItem("mentionValue",t);return t},u=function(e){if(e.length&&n.sensitive){var t=i(this.query,this.$element[0].selectionStart).substring(1),r,s=e.length,o={highest:[],high:[],med:[],low:[]},u=[];if(t.length==1){for(r=0;r<s;r++){var a=e[r];if(a.username[0]==t){o.highest.push(a)}else if(a.username[0].toLowerCase()==t.toLowerCase()){o.high.push(a)}else if(a.username.indexOf(t)!=-1){o.med.push(a)}else{o.low.push(a)}}
// for(r in o){var f;for(f in o[r]){u.push(o[r][f])}}
// return u}}
// return e},a=function(t){var r=this;t=e(t).map(function(t,i){t=e(r.options.item).attr("data-value",i.username).attr('onClick','selectmention('+i.id+');');var s=e("<div />");if(i.image){s.append('<img class="mention_image" src="'+i.image+'">')}
// if(i.name){s.append('<b class="mention_name">'+i.name+"</b>")}
// if(i.username){s.append('<span class="mention_username"> '+n.delimiter+i.username+"</span>")}
// t.find("a").html(r.highlighter(s.html()));return t[0]});t.first().addClass("active");this.$menu.html(t);return this};e.fn.typeahead.Constructor.prototype.render=a;return this.each(function(){var t=e(this);if(r()){t.typeahead(e.extend({source:n.users,matcher:s,updater:o,sorter:u},n.typeaheadOpts))}})}})})(jQuery)
// function selectmention(id)
// {}