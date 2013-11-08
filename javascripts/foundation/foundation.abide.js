!function(t,e,n){"use strict";Foundation.libs.abide={name:"abide",version:"4.3.2",settings:{live_validate:!0,focus_on_invalid:!0,timeout:1e3,patterns:{alpha:/[a-zA-Z]+/,alpha_numeric:/[a-zA-Z0-9]+/,integer:/-?\d+/,number:/-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,password:/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,card:/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,cvv:/^([0-9]){3,4}$/,email:/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,url:/(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,domain:/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,datetime:/([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,date:/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,time:/(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,dateISO:/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,month_day_year:/(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,color:/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/}},timer:null,init:function(e,n,i){return"object"==typeof n&&t.extend(!0,this.settings,n),"string"==typeof n?this[n].call(this,i):(this.settings.init||this.events(),void 0)},events:function(){var e=this,n=t("form[data-abide]",this.scope).attr("novalidate","novalidate");n.on("submit validate",function(n){return e.validate(t(this).find("input, textarea, select").get(),n)}),this.settings.init=!0,this.settings.live_validate&&n.find("input, textarea, select").on("blur change",function(t){e.validate([this],t)}).on("keydown",function(t){clearTimeout(e.timer),e.timer=setTimeout(function(){e.validate([this],t)}.bind(this),e.settings.timeout)})},validate:function(e,n){for(var i=this.parse_patterns(e),r=i.length,s=t(e[0]).closest("form"),o=0;r>o;o++)if(!i[o]&&/submit/.test(n.type))return this.settings.focus_on_invalid&&e[o].focus(),s.trigger("invalid"),t(e[o]).closest("form").attr("data-invalid",""),!1;return/submit/.test(n.type)&&s.trigger("valid"),s.removeAttr("data-invalid"),!0},parse_patterns:function(t){for(var e=t.length,n=[],i=e-1;i>=0;i--)n.push(this.pattern(t[i]));return this.check_validation_and_apply_styles(n)},pattern:function(t){var e=t.getAttribute("type"),n="string"==typeof t.getAttribute("required");if(this.settings.patterns.hasOwnProperty(e))return[t,this.settings.patterns[e],n];var i=t.getAttribute("pattern")||"";return this.settings.patterns.hasOwnProperty(i)&&i.length>0?[t,this.settings.patterns[i],n]:i.length>0?[t,new RegExp(i),n]:(i=/.*/,[t,i,n])},check_validation_and_apply_styles:function(e){for(var n=e.length,i=[],r=n-1;r>=0;r--){var s=e[r][0],o=e[r][2],a=s.value,c="radio"===s.type,l=o?s.value.length>0:!0;c&&o?i.push(this.valid_radio(s,o)):e[r][1].test(a)&&l||!o&&s.value.length<1?(t(s).removeAttr("data-invalid").parent().removeClass("error"),i.push(!0)):(t(s).attr("data-invalid","").parent().addClass("error"),i.push(!1))}return i},valid_radio:function(e){for(var i=e.getAttribute("name"),r=n.getElementsByName(i),s=r.length,o=!1,a=0;s>a;a++)r[a].checked&&(o=!0);for(var a=0;s>a;a++)o?t(r[a]).removeAttr("data-invalid").parent().removeClass("error"):t(r[a]).attr("data-invalid","").parent().addClass("error");return o}}}(Foundation.zj,this,this.document);