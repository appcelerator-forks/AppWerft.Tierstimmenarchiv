exports.search4Article=function(e,t,i){var r={action:"query",list:"search",srsearch:t.replace(/ /g,"+"),format:"json"},o="https://"+e+".wikipedia.org/w/api.php",a=Ti.Network.createHTTPClient({tlsVersion:Ti.Network.TLS_VERSION_1_2,onload:function(){try{var t=JSON.parse(a.responseText).query;if(parseInt(t.searchinfo.totalhits)>0){var r=t.search[0].title;r.split(" ").length<4&&i({lang:e,dir:"he"==e||"ar"==e||"fa"==e?"rtl":"ltr",title:t.search[0].title})}}catch(o){return void console.log(o)}},onerror:function(){console.log(this.error)}});a.open("POST",o),a.send(r)},exports.getImages=function(e,t){if(Ti.App.Properties.hasProperty(e))return t(null),Ti.App.Properties.getList(e);var i=Ti.Network.createHTTPClient({tlsVersion:Ti.Network.TLS_VERSION_1_2,onload:function(){try{var r=JSON.parse(i.responseText).query.search}catch(o){return}for(var a=[],n=0;n<r.length;n++)a.push(encodeURI(r[n].title));var s=Ti.Network.createHTTPClient({tlsVersion:Ti.Network.TLS_VERSION_1_2,onload:function(){try{var i=JSON.parse(s.responseText).query.pages,r=[];for(var o in i)0>o||i[o].imageinfo[0].url.match(/(\.jpg|\.png)$/i)&&r.push(i[o].imageinfo[0].url);Ti.App.Properties.setList(e,r),t(r)}catch(a){}}});s.open("POST","https://commons.wikimedia.org/w/api.php"),s.send({action:"query",titles:a.join("|"),prop:"imageinfo",iiprop:"url",format:"json"})}});i.open("POST","https://commons.wikimedia.org/w/api.php"),i.send({action:"query",list:"search",srnamespace:6,srsearch:e,srlimit:20,sroffset:0,prop:"imageinfo",format:"json"})},exports.getSpeciesImage=function(e,t){const i="imagecache";if(Ti.Filesystem.isExternalStoragePresent())var r=Ti.Filesystem.externalStorageDirectory;else var r=Ti.Filesystem.applicationDataDirectory;var o=Ti.Filesystem.getFile(r,i);o.exists()||o.createDirectory();var a=Ti.Filesystem.getFile(r,i,e+".jpg");if(console.log(a.nativePath),a.exists()){console.log("file exists");var n=a.read();t(n)}else{var s=Ti.Network.createHTTPClient({onload:function(){var e=/class="thumbimage" srcset="(.*?)"/gi,i=e.exec(this.responseText);if(i&&!i[1].match(/\.svg/)){console.log("≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈"+i.length);var r="https:"+i[1].split(" ")[2],o=Ti.Network.createHTTPClient({onload:function(){console.log("file written "+this.responseData.length),a.write(this.responseData);var e=a.read();t(e)}});o.open("GET",r),o.send()}}}),l="https://species.wikimedia.org/wiki/"+e.replace(" ","_");s.open("GET",l),s.send()}};