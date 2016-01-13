const DBNAME="TSAx9";String.prototype.trim||!function(){var e=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;String.prototype.trim=function(){return this.replace(e,"")}}();const SPECIES=0,FAMILY=6,ORDER=9,CLASS=11;var Module=function(){this.eventhandlers=[]};Module.prototype={Import_isDone:function(){return Ti.App.Properties.hasProperty(DBNAME)},Import_Init:function(){var e=(new Date).getTime();this.rows=JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"model","tsa.json").read().text).Workbook.Worksheet.Table.Row,console.log("durationJSONparsing :"+((new Date).getTime()-e))},Import_loadTaxo:function(){var e=(new Date).getTime(),i={},t={},s=Ti.Database.open(DBNAME);Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"model","init.sql").read().text.split("\n").forEach(function(e){e.length>1&&s.execute(e)}),console.log("durationCREATING TABLES :"+((new Date).getTime()-e)),e=(new Date).getTime(),s.execute("PRAGMA synchronous = OFF"),s.execute("BEGIN TRANSACTION");return this.rows.forEach(function(e,r){var a=e.C;r>0&&Array.isArray(a)&&30==a.length&&!i[a[SPECIES]]&&(s.execute("INSERT INTO species VALUES (?,?,?,?)",a[SPECIES].trim(),a[FAMILY].trim(),a[5].trim(),a[4].trim()),i[a[SPECIES]]=!0),r>0&&Array.isArray(a)&&30==a.length&&!t[a[FAMILY]]&&(s.execute("INSERT INTO families VALUES (?,?,?,?)",a[FAMILY].trim(),a[ORDER].trim(),a[8].trim(),a[7].trim()),t[a[FAMILY]]=!0),s.execute("INSERT OR REPLACE INTO orders VALUES (?,?,?,?)",a[ORDER].trim(),a[11].trim(),"",a[10].trim()),s.execute("INSERT OR REPLACE INTO classes VALUES (?,?,?)",a[CLASS].trim(),"","")}),s.execute("COMMIT"),console.log("DB TAXO transaction finished"),s.close(),console.log("durationTaxo :"+((new Date).getTime()-e)),Ti.App.Properties.setBool("TSAx9TAXO",!0),!0},Import_loadRecords:function(){var e=(new Date).getTime(),i=Ti.Database.open(DBNAME);i.execute("PRAGMA synchronous = OFF"),i.execute("BEGIN TRANSACTION");var t=this;return this.rows.forEach(function(e,s){if(s>0&&Array.isArray(e.C)&&30==e.C.length){var r=e.C;s%50||t.fireEvent("progress",{progress:s/t.rows.length}),i.execute("INSERT INTO records VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",r[SPECIES],r[1].trim(),r[2].trim(),r[4].trim(),r[5].trim(),r[14],r[15],r[16],r[17],r[18],r[19],r[20],r[21],r[22],r[23],r[24],r[25],r[26],r[27],r[28],r[29])}}),i.execute("COMMIT"),console.log("DB transaction finished"),i.close(),console.log("durationRecords :"+((new Date).getTime()-e)+" ms."),Ti.App.Properties.setBool(DBNAME,!0),!0},getAllClasses:function(){for(var e=Ti.Database.open(DBNAME),i=e.execute('SELECT * FROM classes WHERE latin <> ""'),t=[];i.isValidRow();){var s={latin:i.fieldByName("latin"),de:i.fieldByName("de"),en:i.fieldByName("en"),image:"/assets/"+i.fieldByName("latin").toLowerCase()+".png"};t.push(s),i.next()}return i.close(),e.close(),t.sort(function(e,i){return e.latin>i.latin?!0:!1})},getOrdersByClass:function(e){for(var i=Ti.Database.open(DBNAME),t=i.execute("SELECT * FROM orders WHERE classes = ?",e),s=[];t.isValidRow();){var r={latin:t.fieldByName("latin"),de:t.fieldByName("de"),en:t.fieldByName("en"),image:"/assets/"+t.fieldByName("latin").toLowerCase()+".png"};s.push(r),t.next()}return t.close(),i.close(),s.sort(function(e,i){return e.latin>i.latin?!0:!1})},getFamiliesByOrdo:function(e){var i=Ti.Database.open(DBNAME);console.log(e);for(var t=i.execute("SELECT * FROM families WHERE orders = ?",e),s=[];t.isValidRow();){var r={latin:t.fieldByName("latin"),de:t.fieldByName("de"),en:t.fieldByName("en"),image:"/assets/"+t.fieldByName("latin").toLowerCase()+".png"};s.push(r),t.next()}return t.close(),i.close(),console.log(s),s.sort(function(e,i){return e.latin>i.latin?!0:!1})},getSpeciesByFamily:function(e){for(var i=Ti.Database.open(DBNAME),t=i.execute("SELECT * FROM species WHERE families = ?",e),s=[];t.isValidRow();){var r={latin:t.fieldByName("latin"),de:t.fieldByName("de"),en:t.fieldByName("en"),image:"/assets/"+t.fieldByName("latin").toLowerCase()+".png"};s.push(r),t.next()}return t.close(),i.close(),s.sort(function(e,i){return e.latin>i.latin?!0:!1})},getRecordsBySpecies:function(e){for(var i=Ti.Database.open(DBNAME),t=i.execute("SELECT * FROM records WHERE species = ?",e),s=[];t.isValidRow();){var r=t.fieldByName("filename"),a={species:t.fieldByName("species"),deutscher_name:t.fieldByName("deutscher_name")||t.fieldByName("species"),beschreibung:t.fieldByName("Beschreibung"),gps:t.fieldByName("latitude")+","+t.fieldByName("longitude"),mp3:"http://www.tierstimmenarchiv.de/recordings/"+r+"_short.mp3",spectrogram:"http://mm.webmasterei.com/spectrogram/"+r+"_short.mp3.wav.png.jpg",autor:t.fieldByName("autor"),itemId:r,copyright:t.fieldByName("Copyright")};s.push(a),t.next()}return t.close(),i.close(),s},getRecordsWithLatLng:function(){var e=Ti.Database.open(DBNAME);console.log("getRecordsWithLatLng ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈");for(var i=e.execute("SELECT classes.latin AS class,records.* FROM classes,records,species,families,orders WHERE records.latitude <> 0 AND records.longitude <>0 AND records.species=species.latin AND species.families=families.latin AND families.orders=orders.latin AND orders.classes=classes.latin"),t={};i.isValidRow();){var s=i.fieldByName("filename"),r=i.fieldByName("class");t[r]||(t[r]=[]);var a={itemId:"http://www.tierstimmenarchiv.de/recordings/"+s+"_short.mp3",id:s,image:"/images/"+r+".png",title:i.fieldByName("species"),subtitle:i.fieldByName("Beschreibung"),lat:i.fieldByName("latitude"),lng:i.fieldByName("longitude")};t[r].push(a),i.next()}return i.close(),t},getRecordById:function(e){if(!e)return{};var i=Ti.Database.open(DBNAME);console.log('getRecordById≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ "'+e+'"');var t='SELECT records.*,  species.latin species_latin, species.de species_de, families.latin families_latin, families.de families_de, orders.latin orders_latin,orders.de orders_de, classes.latin classes_latin FROM classes,orders,families,species,records WHERE records.filename="'+e+'" AND records.species=species.latin AND species.families=families.latin AND families.orders=orders.latin AND orders.classes=classes.latin';console.log(t),console.log("≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈");for(var s=i.execute(t),r=[],a=0;a<s.getFieldCount();a++)r.push(s.getFieldName(a));var o={};return s.isValidRow()?(console.log("Info: valide entry for recording found"),o={audio:"http://www.tierstimmenarchiv.de/recordings/"+e+"_short.mp3",spectrogram:"http://mm.webmasterei.com/spectrogram/"+e+"_short.mp3.wav.png.jpg"},r.forEach(function(e){console.log(e+" = "+s.fieldByName(e)),o[e]=s.fieldByName(e)})):console.log("Warning: no recording found"),s.close(),i.close(),console.log(o),o||null},searchAnimals:function(e){for(var i=Ti.Database.open(DBNAME),t=i.execute('SELECT * FROM records WHERE deutscher_name LIKE "%'+e+'%" AND species <> "div." ORDER BY species LIMIT 500'),s=[];t.isValidRow();){var r=t.fieldByName("filename"),a={species:t.fieldByName("species"),deutscher_name:t.fieldByName("deutscher_name")||t.fieldByName("species"),beschreibung:t.fieldByName("Beschreibung"),spectrogram:"http://mm.webmasterei.com/spectrogram/"+r+"_short.mp3.wav.png.jpg",autor:t.fieldByName("autor"),audio:"http://www.tierstimmenarchiv.de/recordings/"+r+"_short.mp3",itemId:r,copyright:t.fieldByName("Copyright")};s.push(a),t.next()}t.close();var o={};return s.forEach(function(e){o[e.species]||(o[e.species]=[]),o[e.species].push(e)}),o},fireEvent:function(e,i){if(this.eventhandlers||(this.eventhandlers={}),this.eventhandlers[e])for(var t=0;t<this.eventhandlers[e].length;t++)this.eventhandlers[e][t].call(this,i)},addEventListener:function(e,i){this.eventhandlers||(this.eventhandlers={}),this.eventhandlers[e]||(this.eventhandlers[e]=[]),this.eventhandlers[e].push(i)},removeEventListener:function(e,i){if(this.eventhandlers||(this.eventhandlers={}),this.eventhandlers[e]){var t=this.eventhandlers[e].filter(function(e){return e!=i});this.eventhandlers[e]=t}}},module.exports=Module;