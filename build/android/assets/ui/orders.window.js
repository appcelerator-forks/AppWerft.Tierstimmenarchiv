module.exports=function(e){var t=Ti.UI.createWindow({backgroundColor:COLOR.LIGHTGREEN});return console.log("Info: window orders opened ≈≈≈≈≈≈≈≈≈≈≈≈≈≈ "+e),t.addEventListener("close",function(e){console.log("ordo window closed by event   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈"),e.source=null}),t.addEventListener("open",function(i){function r(){console.log("ordo window closed   from <-  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈"),i.source.close()}if(Ti.Android){var a=i.source.getActivity();a.actionBar.onHomeIconItemSelected=r;var n=require("com.alcoapps.actionbarextras");n.setTitle("Tierstimmenarchiv"),n.setFont("Helvetica-Bold"),n.setSubtitle("Class: "+e),n.displayUseLogoEnabled=!1,n.setStatusbarColor(COLOR.BROWN),i.source.getActivity().actionBar.displayHomeAsUp=!0,n.backgroundColor=COLOR.DARKGREEN}var o=new(require("model/tsa.adapter"));t.list=Ti.UI.createTableView({data:o.getOrdersByClass(e).map(require("ui/taxo.row"))}),t.add(t.list),t.list.addEventListener("click",function(e){require("ui/families.window")(e.row.itemId).open()})}),t};