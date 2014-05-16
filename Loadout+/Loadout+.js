//-----------------Loadout+------------------
//--------------------by---------------------
//-------------------k2b---------------------
//------------------V1.1---------------------

function On_PluginInit() {
	var loadouti = Data.GetConfigValue("Rust++", "Commands", "loadout");
	if(loadouti == "true")
		Data.OverrideConfig("Rust++", "Commands", "loadout", false);
}

var itemname = "";
var itemqty = "";
var loname = "";

		
function On_Command(Player, cmd, args) {
	if(Player.Admin) {
		if(cmd == "loadout") {
			Player.MessageFrom("Loadout+", "----------------Usage-----------------"); 
			Player.MessageFrom("Loadout+", "/lo (loadoutnumber) (name)");
			Player.MessageFrom("Loadout+", "/lo (loadoutnumber)");
			Player.MessageFrom("Loadout+", "/lo");
			Player.MessageFrom("Loadout+", "--------------------------------------");
			Player.MessageFrom("Loadout+", "RUST++ Loadout Command Status:");
		}
		if(cmd == "lo" && (args[0]!=undefined)){
			loname = Data.GetConfigValue("Loadout+", "Loadout" + args[0], "name");
			if(loname != null)
				Player.MessageFrom("Loadout+", "Loadout➡" + loname + " has been added to your inventory.");
			for(var i = 1; i > 0; i++) {
				itemname = Data.GetConfigValue("Loadout+", "Loadout" + args[0], "item" + i);
				itemqty = Data.GetConfigValue("Loadout+", "Loadout" + args[0], "qty" + i);
				if(itemname == null || loname == null){
					break;
				} else if(itemqty == null){ 
					Player.Inventory.AddItem(itemname);
				} else {
					Player.Inventory.AddItem(itemname, itemqty);
				}
			}
		} 
		if(cmd == "lo" && (args[0]!=undefined) && (args[1]!=undefined)){
			var pl = Player.Find(args[1]);
			if(pl.Name == undefined){
				Player.Message("No such player");
			}
			else{
				loname = Data.GetConfigValue("Loadout+", "Loadout" + args[0], "name");
				if(loname != null)
					pl.MessageFrom("Loadout+", "Loadout➡" + loname + " has been added to your inventory by "+Player.Name+".");
				for(var i = 1; i > 0; i++) {
					itemname = Data.GetConfigValue("Loadout+", "Loadout" + args[0], "item" + i);
					itemqty = Data.GetConfigValue("Loadout+", "Loadout" + args[0], "qty" + i);
					if(itemname == null || loname == null){
						break;
					} else if(itemqty == null){ 
						pl.Inventory.AddItem(itemname);
					} else {
						pl.Inventory.AddItem(itemname, itemqty);
					}
				}
			}
		}
		if(cmd == "lo" && args[0]==undefined) {
			
			Player.MessageFrom("Loadout+", "Usage: /lo (number) ");
			Player.MessageFrom("Loadout+", "-------------------------------------");
			Player.MessageFrom("Loadout+", "[  Number ➡ Loadout-Name:  ]");
			Player.MessageFrom("Loadout+", "-------------------------------------");
			for(var i = 1; i > 0; i++) {
				loname = Data.GetConfigValue("Loadout+", "Loadout" + i, "name");
				if(loname == undefined)
					break;
				Player.MessageFrom("Loadout+", i + " ➡ " + loname);
			}
		}
	}
}				