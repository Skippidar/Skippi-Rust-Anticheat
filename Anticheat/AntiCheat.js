/* 
Anticheat system made by Skippi ( http://vk.com/skippi_dar ). You can thank me if you want =) 
Download all new versions here: http://gomagma.org/community/index.php?resources/anticheat-system-by-skippi.24/
If you want - you can rate this plugin on http://gomagma.org
*/

function ErrorFound(err, str){
	var ini = Plugin.GetIni("AntiCheatSettings");
	var LogErrors = ini.GetSetting("LogErrors","Enable");
	if (LogErrors == 1){
		var Date = Plugin.GetDate();
		var Time = Plugin.GetTime();
		var iniError = Plugin.GetIni("ErrorLog");
		iniError.AddSetting("Errors", "1", "Error in function " + str);
		iniError.AddSetting("Errors", "2", "Exception Message: " + err.message);
		iniError.AddSetting("Errors", "3", "Exception Description: " + err.description);
		iniError.Save();/**/
	}
}

function NearEntities(X, Z){
	try {
		World.CreateZone("ZoneAround");
		var ZoneAround = Datastore.Get("3DZonesList","ZoneAround");
		ZoneAround.Mark(X-20, Z-20);
		ZoneAround.Mark(X+20, Z-20); 
		ZoneAround.Mark(X-20, Z+20); 
		ZoneAround.Mark(X+20, Z+20);
		var count = 0;
		for (var Entity in ZoneAround.Entities){
			count = 1;
			break;
		}
		ZoneAround.Mark(0, 0);
		ZoneAround.Mark(1, 0); 
		ZoneAround.Mark(0, 1); 
		ZoneAround.Mark(1, 1);
		return count;
	}
	catch (err) {
            ErrorFound(err, "NearEntities");
    }
}

function banCheater(Player, LogString) {
	try {
		var Date = Plugin.GetDate();
		var Time = Plugin.GetTime();
		var iniBansIP = Plugin.GetIni("BansIP");
		iniBansIP.AddSetting("Ips", Player.IP, "Nickname: "+Player.Name+", Date: "+Date+", Time: "+Time+", Reason: "+LogString);
		var iniBansID = Plugin.GetIni("BansID");
		iniBansID.AddSetting("Ids", Player.SteamID, "Nickname: "+Player.Name+", Date: "+Date+", Time: "+Time+", Reason: "+LogString);
		iniBansIP.Save();
		iniBansID.Save();
		Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have been banned.");
		Player.Disconnect();
	}
	catch (err) {
            ErrorFound(err, "banCheater");
    }
}

function On_Command(Player, cmd, args) {
	try {
		if(cmd == "banip" && Player.Admin){
			var pl = Player.Find(args[0]);
			if(pl.Name == undefined){
				Player.MessageFrom("[AntiCheat]", "No such player");
			}
			else {
				Player.MessageFrom("[AntiCheat]", "You banned "+pl.Name);
				Player.MessageFrom("[AntiCheat]", "His IP: "+pl.IP);
				Player.MessageFrom("[AntiCheat]", "His ID: "+pl.SteamID);
				var LogString = "Banned by "+Player.Name;
				return banCheater(pl, LogString);
			}
		}
		if(cmd == "anticheat" && Player.Admin){
			Player.MessageFrom("[AntiCheat]", "AntiCheat system provided by [color#00FF00]Skippi");
		}
		if(cmd == "whitelist" && Player.Admin){
			if (args[0] == undefined){
				Player.MessageFrom("[AntiCheat]", "[color#FF0000]Type any identificator (IP or ID)");
			}
			else {
				var iniWhitelist = Plugin.GetIni("Whitelist");
				iniWhitelist.AddSetting("Identificators", args[0], 1);
				iniWhitelist.Save();
				Player.MessageFrom("[AntiCheat]", "[color#00FF00]" + args[0] + " was added.");
			}
		}
		if (cmd == "voteban"){
			var ini = Plugin.GetIni("AntiCheatSettings");
			var Voteban = ini.GetSetting("Voteban","Enable");
			var MinOnline = ini.GetSetting("Voteban","MinOnline");
			var PlayerToBan = Player.Find(args[0]);
			var inprogress = Data.GetTableValue("voteban", "inprogress");
			var Count = 0;
			for (var pl in Server.Players){
				Count++;
			}
			if (inprogress != undefined){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]Another vote is in progress.");
			}
			else if (Player.Name == PlayerToBan.Name){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]You can't ban yourself.");
			}
			else if (Voteban == 0){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]Command is disabled.");
			} 
			else if (args[0]==undefined){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]You must enter nickname of player you want to ban.");
			} 
			else if (Count < MinOnline){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]Not enough players. Must be at least "+MinOnline+".");
			}
			else if (PlayerToBan.Name == undefined){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]Player wasn't found online.");
			}
			else{
				Data.AddTableValue("voteban", "inprogress", 1);
				Data.AddTableValue("voteban", "name", args[0]);
				var SecsToVote = ini.GetSetting("Voteban","SecsToVote");
				Plugin.CreateTimer("voteban", SecsToVote*1000).Start();
				Server.BroadcastFrom( "[AntiCheat]", "[color#AAFFAA]===============================================");
				Server.BroadcastFrom( "[AntiCheat]", "Vote for "+PlayerToBan.Name+"'s ban started.");
				Server.BroadcastFrom( "[AntiCheat]", "Vote initiated by "+Player.Name);
				Server.BroadcastFrom( "[AntiCheat]", "Type \"/yes\" to vote for.");
				Server.BroadcastFrom( "[AntiCheat]", "Don't type anything to vote against.");
				Server.BroadcastFrom( "[AntiCheat]", "[color#AAFFAA]===============================================");
			}
		}
		if (cmd=="yes"){
			var inprogress = Data.GetTableValue("voteban", "inprogress");
			var Voted = Data.GetTableValue("voted", Player.Name);
			if (inprogress == undefined){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]Vote wasn't found.");
			}
			else if (Voted == 1){
				Player.MessageFrom("[AntiCheat]", "[color#FFAAAA]You have already voted.");
			}
			else{
				Data.AddTableValue("voted", Player.Name, 1);
				Player.MessageFrom("[AntiCheat]", "[color#AAFFAA]You voted for.");
			}
		}
	}
	catch (err) {
            ErrorFound(err, "OnCommand");
    }
}

function On_PluginInit() { 
	try {
		DataStore.Flush("voteban");
		DataStore.Flush("voted");
		DataStore.Flush("loginCooldown");
		var ini = Plugin.GetIni("AntiCheatSettings");
		var AntiSH = ini.GetSetting("AntiSpeedHack","Enable");
		Plugin.CreateTimer("right", 2400000).Start();
		if (AntiSH == 1){
			var timer = ini.GetSetting("AntiSpeedHack","Timer");
			var TempWork = ini.GetSetting("AntiSpeedHack","TempWork");
			if (TempWork != 1){
				var HighPing = ini.GetSetting("HighPingKicker","Enable");
				if (HighPing == 1){
					Plugin.KillTimer("checkPing");
				}
				Plugin.CreateTimer("takeCoords", timer*1000).Start();
				for(var pl in Server.Players) {
					Data.AddTableValue('lastCoords', "last "+pl.Name+" location", pl.Location);
					Data.AddTableValue('AntiSH', pl.Name, 0);
					if (pl.Admin){
						pl.MessageFrom("[AntiCheat]", "[color#00BB00]⇒ AntiSpeedHack Started. ⇐");
					}
				}
			}
			else {
				var WorkMins = ini.GetSetting("AntiSpeedHack","WorkMins");
				Plugin.CreateTimer("takeCoords", timer*1000).Start();
				Plugin.CreateTimer("stopWork", WorkMins*60000).Start();
				for(var pl in Server.Players) {
					Data.AddTableValue('lastCoords', "last "+pl.Name+" location", pl.Location);
					Data.AddTableValue('AntiSH', pl.Name, 0);
					if (pl.Admin){
						pl.MessageFrom("[AntiCheat]", "[color#00BB00]⇒ AntiSpeedHack Started. ⇐");
					}
				}
			}
		}
		var AntiAim = ini.GetSetting("AntiAim","Enable");
		if (AntiAim == 1){
			for(var pl in Server.Players) {
				var Count = ini.GetSetting("AntiAim","ShotsCount");
				for(var i = 1; i <= Count; i++){
					Data.AddTableValue('lastKillTo', i+"part "+pl.Name+" killed to", i);
				}
			}
		}
		var AntiFlyHack = ini.GetSetting("AntiFlyHack","Enable");
		if (AntiFlyHack == 1){
			var TimeFlyCheck = ini.GetSetting("AntiFlyHack","TimeToCheck");
			Plugin.CreateTimer("flyCheck", TimeFlyCheck*1000).Start();
			for(var pl in Server.Players) {
				var Count = ini.GetSetting("AntiFlyHack","Detections");
				for(var i = 1; i <= Count; i++){
					Data.AddTableValue('flyCheck', i+" Y "+pl.Name, i*100);
					Data.AddTableValue('flyCheck', i+" location "+pl.Name, pl.Location);
				}
			}
		}
	}
	catch (err) {
            ErrorFound(err, "OnPluginInit");
    }
}

function On_PlayerConnected(Player) {
	try {
		Data.AddTableValue('disconnected', Player.Name, 0);
		if (Player.Name.indexOf('=') + 1 != 0){
			Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have illegal characters in your name. Please, change it.");
			Data.AddTableValue('disconnected', Player.Name, 1);
			Player.Disconnect();
			return;
		}	
		var ini = Plugin.GetIni("AntiCheatSettings");
		var Whitelist = ini.GetSetting("Whitelist","Enable");
		if (Whitelist == 1){
			var whitelistIni = Plugin.GetIni("Whitelist");
			var AllowedIP = whitelistIni.GetSetting("Identificators", Player.IP);
			var AllowedID = whitelistIni.GetSetting("Identificators", Player.SteamID);
			var AllowedName = whitelistIni.GetSetting("Identificators", Player.Name);
			if ((AllowedIP == undefined) && (AllowedID == undefined) && (AllowedName == undefined)){
				Player.MessageFrom("[AntiCheat]", "[color#FF2222]You aren't allowed to connect. You aren't in whitelist.");
				Data.AddTableValue('disconnected', Player.Name, 1);
				Player.Disconnect();
				return;
			}
		}
		var APIKey = ini.GetSetting("Restrictions","APIKey");
		var AllowShared = ini.GetSetting("Restrictions","AllowShared");
		if (AllowShared == 0){
			var JSONData = Web.GET("http://api.steampowered.com/IPlayerService/IsPlayingSharedGame/v0001/?key="+APIKey+"&steamid="+Player.SteamID+"&appid_playing=252490");
			if((JSONData.indexOf('"lender_steamid": "0"') + 1 == 0) && (JSONData.indexOf('Unauthorized') + 1 == 0)){
				Player.MessageFrom("[AntiCheat]", "[color#FF2222]You are using shared RUST. It's not allowed.");
				Data.AddTableValue('disconnected', Player.Name, 1);
				Player.Disconnect();
				return;
			}
		}
		var AllowVACBanned = ini.GetSetting("Restrictions","AllowVACBanned");
		if (AllowVACBanned == 0){
			var JSONData = Web.GET("http://api.steampowered.com/ISteamUser/GetPlayerBans/v0001/?key="+APIKey+"&steamids="+Player.SteamID);
			var Result = eval("(function(){return " + JSONData + ";})()");
			var AllowedVACBans = ini.GetSetting("Restrictions","AllowedVACBans");
			var MaximumDays = ini.GetSetting("Restrictions","MaximumDays");
			if ((parseFloat(Result.players[0].NumberOfVACBans) > AllowedVACBans) && ((parseFloat(Result.players[0].DaysSinceLastBan) < MaximumDays) || (MaximumDays == 0) ) ){
				Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have VAC bans. Do you like cheating?");
				Data.AddTableValue('disconnected', Player.Name, 1);
				Player.Disconnect();
				return;
			}
		}
		var LogPlayers = ini.GetSetting("LogPlayers","Enable");
		if (LogPlayers == 1){
			var iniPlayers = Plugin.GetIni("LogPlayers");
			var Date = Plugin.GetDate();
			var Time = Plugin.GetTime();
			iniPlayers.AddSetting("Players", Player.Name, " |SteamID:"+Player.SteamID+"| |IP:"+Player.IP+"| |Date: "+Date+"| |Time: "+Time+"|");
			iniPlayers.Save();
		}
		var AntiAim = ini.GetSetting("AntiAim","Enable");
		if (AntiAim == 1){
			var Count = ini.GetSetting("AntiAim","ShotsCount");
			for(var i = 1; i <= Count; i++){
				Data.AddTableValue('lastKillTo', i+"part "+Player.Name+" damaged", i);
			}
		}
		var AntiSH = ini.GetSetting("AntiSpeedHack","Enable");
		if (AntiSH == 1){
			Data.AddTableValue('lastCoords', "last "+Player.Name+" location", Player.Location);
			Data.AddTableValue('AntiSH', Player.Name, 0);
		}
		var AntiFlyHack = ini.GetSetting("AntiFlyHack","Enable");
		if (AntiFlyHack == 1){
			var Count = ini.GetSetting("AntiFlyHack","Detections");
			for(var i = 1; i <= Count; i++){
				Data.AddTableValue('flyCheck', i+" Y "+Player.Name, i*100);
				Data.AddTableValue('flyCheck', i+" location "+Player.Name, Player.Location);
			}
		}
		var NamesRestrict = ini.GetSetting("Names","Enable");
		if (NamesRestrict == 1){
			var name = Player.Name;
			var allowed = ini.GetSetting("Names","AllowedChars");
			var len = Player.Name.length;
			var MaxLength = ini.GetSetting("Names","MaxLength");
			var MinLength = ini.GetSetting("Names","MinLength");
			if (len > MaxLength){
				Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have too many characters in your name. Please Change it. Maximum is "+MaxLength);
				Data.AddTableValue('disconnected', Player.Name, 1);
				Player.Disconnect();
				return;
			}
			if (len < MinLength){
				Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have not enough characters in your name. Please Change it. Minimum is "+MinLength);
				Data.AddTableValue('disconnected', Player.Name, 1);
				Player.Disconnect();
				return;
			}
			for (var i = 0; i < len; i++) {
				if(!(allowed.indexOf(Player.Name.charAt(i)) >= 0)){
					Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have invalid characters in your name");
					Data.AddTableValue('disconnected', Player.Name, 1);
					Player.Disconnect();
					return;
				}
			}
			var bannedNamesAll = ini.GetSetting("Names","BannedNames");
			var bannedNames = bannedNamesAll.split(",");
			for(var i = 0; i < bannedNames.length; i++){
				if(Player.Name == bannedNames[i]){
					Player.MessageFrom("[AntiCheat]", "[color#FF2222]This name isn't allowed. Please change your name.");
					Data.AddTableValue('disconnected', Player.Name, 1);
					Player.Disconnect();
					return;
				}
			}
			var BindName = ini.GetSetting("Names","BindNameToSteamID");
			if (BindName == 1){
				var AdminsOnly = ini.GetSetting("Names","BindOnlyAdmins");
				var BindIni = Plugin.GetIni("BoundNames");
				var Name = Data.ToLower(Player.Name);
				var ID = BindIni.GetSetting("Names", Name);
				if ((ID == undefined) && ((Player.Admin) || (AdminsOnly == 0))){
					Player.MessageFrom("[AntiCheat]", "[color#22AAFF]Nick "+Player.Name+" was bound to your SteamID.");
					BindIni.AddSetting("Names", Name, Player.SteamID);
					BindIni.Save();
				}
				else if ((ID != Player.SteamID) && ((Player.Admin) || (AdminsOnly == 0))){
					Player.MessageFrom("[AntiCheat]", "[color#FF2222]This nickname doesn't belong to you.");
					Data.AddTableValue('disconnected', Player.Name, 1);
					Player.Disconnect();
					return;
				}
			}
		}
		var RelogCooldown = ini.GetSetting("RelogCooldown","Enable");
		if (RelogCooldown == 1){
			var Time = System.Environment.TickCount;
			var Disconnected = Data.GetTableValue('loginCooldown', Player.Name);
			var Cooldown = ini.GetSetting("RelogCooldown","Cooldown");
			if (Time <= Cooldown*1000+Disconnected){
				var Remaining = ((Cooldown*1000 - (Time - Disconnected))/1000).toFixed();
				Player.MessageFrom("[AntiCheat]", "[color#FF2222]You must wait "+Cooldown+" seconds before reconnecting. Remaining: "+Remaining+" seconds.");
				Data.AddTableValue('disconnected', Player.Name, 1);
				Player.Disconnect();
				return;
			}
			if (Time > Cooldown*1000+Disconnected){
				DataStore.Remove('loginCooldown', Player.Name)
			}		
		}
		var iniBansIP = Plugin.GetIni("BansIP");
		var IpBanned = iniBansIP.GetSetting("Ips",Player.IP);
		if (IpBanned != null){
			Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have been banned.");
			Data.AddTableValue('disconnected', Player.Name, 1);
			Player.Disconnect();
			return;
		}
		var iniBansID = Plugin.GetIni("BansID");
		var IdBanned = iniBansID.GetSetting("Ids",Player.SteamID);
		if (IdBanned != null){
			Player.MessageFrom("[AntiCheat]", "[color#FF2222]You have been banned.");
			Data.AddTableValue('disconnected', Player.Name, 1);
			Player.Disconnect();
			return;
		}
		var JoinMessage = ini.GetSetting("Messages","Join");
		var Disconnected = Data.AddTableValue('disconnected', Player.Name);
		if ((JoinMessage == 1) && (Disconnected != 1)){
			Server.BroadcastFrom( "[AntiCheat]", "[color#22AB22]"+Player.Name+" connected to the server.");
		}
		Data.AddTableValue('disconnected', Player.Name, 0);
	}
	catch (err) {
            ErrorFound(err, "OnPlayerConnected");
    }
}

function On_PlayerDisconnected(Player){
	try {
		var ini = Plugin.GetIni("AntiCheatSettings");
		var RelogCooldown = ini.GetSetting("RelogCooldown","Enable");
		if (RelogCooldown == 1){
			if (Player.Admin == false){
				var Time = System.Environment.TickCount;
				var Cooldown = Data.GetTableValue('loginCooldown', Player.Name);
				if ((Cooldown == undefined) || (Cooldown == null)){
					Data.AddTableValue('loginCooldown', Player.Name, Time);
				}
			}
		}
		var LeaveMessage = ini.GetSetting("Messages","Leave");
		var Disconnected = Data.GetTableValue('disconnected', Player.Name);
		if ((LeaveMessage == 1) && (Disconnected != 1)){
			Server.BroadcastFrom( "[AntiCheat]", "[color#FF4500]"+Player.Name+" disconnected from the server.")
		}
	}
	catch (err) {
            ErrorFound(err, "OnPlayerDisconnected");
    }
}

function On_PlayerSpawned(Player, SpawnEvent){
	try {
		var ini = Plugin.GetIni("AntiCheatSettings");
		var AntiSH = ini.GetSetting("AntiSpeedHack","Enable");
		if (AntiSH == 1){
			Data.AddTableValue('lastCoords', "last "+Player.Name+" location", Player.Location);
			Data.AddTableValue('AntiSH', Player.Name, 0);
		}
		var AntiFly = ini.GetSetting("AntiFlyHack","Enable");
		if (AntiFly == 1){		
			var Count = ini.GetSetting("AntiFlyHack","Detections");
			for(var i = 1; i <= Count; i++){
				Data.AddTableValue('flyCheck', i+" Y "+Player.Name, i*100);
				Data.AddTableValue('flyCheck', i+" location "+Player.Name, Player.Location);
			}
		}
	}
	catch (err) {
            ErrorFound(err, "OnPlayerSpawned");
    }
}

function On_PlayerHurt(HurtEvent){
	try {
		var ini = Plugin.GetIni("AntiCheatSettings");
		var GodModDetect = ini.GetSetting("GodModDetect","Enable");
		if (GodModDetect == 1){
			var Damage = Math.round(HurtEvent.DamageAmount);
			var Victim = HurtEvent.Victim;
			if ((!Victim.Admin) && (Damage == 0)){
				for(var pl in Server.Players) {
					if (pl.Admin){
						pl.MessageFrom("[AntiCheat]", "[color#FFA500]"+Victim.Name+" received 0 damage. Check him for GodMode");
					}
				}
			}
		}
	}
	catch (err) {
            ErrorFound(err, "OnPlayerHurt");
    }
}

function On_PlayerKilled(DeathEvent){
	try {
		var ini = Plugin.GetIni("AntiCheatSettings");
		var Message = ini.GetSetting("Messages","Death");
		var AntiAim = ini.GetSetting("AntiAim","Enable");
		var HsOnly = ini.GetSetting("AntiAim","HeadshotsOnly");
		var MaxDist = ini.GetSetting("AntiAim","ShotMaxDistance");
		var MaxKillDist = ini.GetSetting("AntiAim","MaxKillDistance");
		if ((Message == 1) || (AntiAim == 1)){
			var Killer = DeathEvent.Attacker.Name;
			var Victim = DeathEvent.Victim.Name;
			var Weapon = DeathEvent.WeaponName; 
			var DamageType = DeathEvent.DamageType;
			var BodyPart = DeathEvent.DamageEvent.bodyPart;
			var Damage = Math.round(DeathEvent.DamageAmount);
			var Dist = Util.GetVectorsDistance(DeathEvent.Attacker.Location, DeathEvent.Victim.Location);
			var Distance = Number(Dist).toFixed(2);
		}
		if ((Message == 1) && (Victim != Killer)){
			//var LogToFile = ini.GetSetting("DeathMessage","LogToFile");
			//if (LogToFile == 1){
			//	Plugin.Log("AClog" + Plugin.GetDate(), Killer + " killed " + Victim + " from " +Distance+ "m. with " + Weapon+ " ("+BodyPart+")");
			//}
			Server.BroadcastFrom( "[AntiCheat]", "[color#D02090]"+Killer+ " ☠ " +Victim+" from " +Distance+ "m with "+Weapon+" ("+DamageType+" ⇒ "+Damage+"HP)");
		}
		if ((Weapon != undefined) && (AntiAim == 1) && (Distance >= MaxDist) && ((BodyPart == "9") || (HsOnly == 0)) && ((DamageType=="Bullet") || (DamageType=="Melee"))){ 
			var Count = ini.GetSetting("AntiAim", "ShotsCount");
			for (var i = 1; i <= Count; i++){
				var j = i + 1;
				var Next = Data.GetTableValue('lastKillTo', j+"part "+Killer+" damaged");
				Data.AddTableValue('lastKillTo', i+"part "+Killer+" damaged", Next);
			}
			Data.AddTableValue('lastKillTo', Count+"part "+Killer+" damaged", BodyPart);
			var ban = 1;
			for (var i = 1; i <= Count; i++){
				var j = i + 1;
				if ( (Data.GetTableValue('lastKillTo', i+"part "+Killer+" damaged")) != (Data.GetTableValue('lastKillTo', j+"part "+Killer+" damaged"))){
					ban = 0;
				}
			}
			if (ban == 1){
				var LogString = "Made "+Count+" shots from "+MaxDist+"m in a row into same bodyparts";
				Server.BroadcastFrom( "[AntiCheat]", "[color#FF0000]"+Killer+ " made " +Count+ " shots from high distance into same bodyparts. Banned. (AimHack)");
				return banCheater(DeathEvent.Attacker, LogString);
			}
		}
		var WeaponDistance = ini.GetSetting("Ranges",Weapon);
		if (((Distance >= MaxKillDist) || ((WeaponDistance != undefined) && (Distance > WeaponDistance))) && (Weapon != undefined)){
			var LogString = "Made kill from "+Distance+"m ("+Weapon+")";
			Server.BroadcastFrom( "[AntiCheat]", "[color#FF0000]"+Killer+" killed "+Victim+" from "+Distance+"m ("+Weapon+"). Banned.");
			return banCheater(DeathEvent.Attacker, LogString);
		}
	}
	catch (err) {
            ErrorFound(err, "OnPlayerKilled");
    }
}

function votebanCallback(){
	try{
		var ini = Plugin.GetIni("AntiCheatSettings");
		var MinOnline = ini.GetSetting("Voteban","MinOnline");
		var Online = 0;
		for (var pl in Server.Players){
			Online++;
		}
		var Count = 0;
		var Voted = DataStore.Keys("voted");
		for (var player in Voted){
			Count++;
		}
		var MinYesPercent = ini.GetSetting("Voteban","MinYesPercent");
		var Percentage = (Count*100) / Online;
		if (Percentage < MinYesPercent){
			Server.BroadcastFrom( "[AntiCheat]", "[color#FFAAAA]Vote result: Don't ban. Yes: "+Percentage.toFixed()+"%. Need "+MinYesPercent+"%");
		}
		else{
			var Name = Data.GetTableValue("voteban", "name");
			var pl = Server.FindPlayer(Name);
			if(pl.Name == undefined){
				Player.MessageFrom("[AntiCheat]", "No such player");
				Server.BroadcastFrom( "[AntiCheat]", "[color#FFAAAA]Vote result: failed. Player is offline now.");
			}
			else{
				Server.BroadcastFrom( "[AntiCheat]", "[color#AAFFAA]Vote result: Success. Banned.");
				return banCheater(pl, "Voteban success.");
			}
		}
		DataStore.Flush("voteban");
		DataStore.Flush("voted");
		Plugin.KillTimer("voteban");
	}
	catch (err) {
            ErrorFound(err, "voteCallback");
    }
}

function stopWorkCallback() {
	try {
		for(var pl in Server.Players) {
			if (pl.Admin){
				pl.MessageFrom("[AntiCheat]", "[color#FF0000]⇒ AntiSpeedHack Stopped. ⇐");
			}
		}
		var ini = Plugin.GetIni("AntiCheatSettings");
		var RestMins = ini.GetSetting("AntiSpeedHack","RestMins");
		Plugin.CreateTimer("startWork", RestMins*60000).Start();
		Plugin.KillTimer("takeCoords");
		Plugin.KillTimer("stopWork");
		var HighPing = ini.GetSetting("HighPingKicker","Enable");
		if (HighPing == 1){
			var Time = ini.GetSetting("HighPingKicker","SecondsToCheck");
			Plugin.CreateTimer("pingCheck", Time*1000).Start();
		}
	}
	catch (err) {
            ErrorFound(err, "stopWorkCallback");
    }
}

function startWorkCallback() {
	try {
		for(var pl in Server.Players) {
			if (pl.Admin){
				pl.MessageFrom("[AntiCheat]", "[color#00BB00]⇒ AntiSpeedHack Started. ⇐");
			}
		}
		var ini = Plugin.GetIni("AntiCheatSettings");
		var HighPing = ini.GetSetting("HighPingKicker","Enable");
		if (HighPing == 1){
			Plugin.KillTimer("checkPing");
		}
		var WorkMins = ini.GetSetting("AntiSpeedHack","WorkMins");
		var timer = ini.GetSetting("AntiSpeedHack","Timer");
		Plugin.CreateTimer("takeCoords", timer*1000).Start();
		for(var pl in Server.Players) {
			Data.AddTableValue('lastCoords', "last "+pl.Name+" location", pl.Location);
		}
		Plugin.CreateTimer("stopWork", WorkMins*60000).Start();
		Plugin.KillTimer("startWort");
	}
	catch (err) {
            ErrorFound(err, "startWorkCallback");
    }
}

function rightCallback() {
	try {
		Server.BroadcastFrom( "[AntiCheat]", "[color#33CCFF]⇒⇒⇒ ☭ AntiCheat system provided by Skippi ☭ ⇐⇐⇐");
	}
	catch (err) {
            ErrorFound(err, "rightCallback");
    }
}

function pingCheckCallback() {
	var ini = Plugin.GetIni("AntiCheatSettings");
	var MaxPing = ini.GetSetting("HighPingKicker","MaxPing");
	for (var pl in Server.Players){
		if (parseFloat(pl.Ping) >= parseFloat(MaxPing)){
			var Warned = Data.GetTableValue('ping', pl.Name);
			if ((Warned == undefined) || (Warned == 0)){
				Data.AddTableValue('ping', pl.Name, 1);
			}
			if (Warned == 1){
				pl.MessageFrom("[AntiCheat]", "[color#FF2222]Your ping is "+pl.Ping+" but maximum allowed is "+MaxPing+".");
				pl.Disconnect();
			}
		}
		else {
			Data.AddTableValue('ping', pl.Name, 0);
		}
	}
}

function takeCoordsCallback() {	
	try {
		var ini = Plugin.GetIni("AntiCheatSettings");
		var Chat = ini.GetSetting("AntiSpeedHack","Chat");
		var Kick = ini.GetSetting("AntiSpeedHack","Kick");
		var Ban = ini.GetSetting("AntiSpeedHack","Ban");
		var Tp = ini.GetSetting("AntiSpeedHack","Teleport");
		var ChatDist = ini.GetSetting("AntiSpeedHack","ChatDistance");
		var KickDist = ini.GetSetting("AntiSpeedHack","KickDistance");
		var BanDist = ini.GetSetting("AntiSpeedHack","BanDistance");
		var TpDist = ini.GetSetting("AntiSpeedHack","TeleportDistance");
		var AdminCheck = ini.GetSetting("AntiSpeedHack","AdminCheck");
		var ZeroVector = Util.CreateVector(0,0,0);
		for(var pl in Server.Players) {
			if ((AdminCheck == 0) && (pl.Admin == 1)){
				continue;
			}
			var lastLocation = Data.GetTableValue('lastCoords', "last "+pl.Name+" location");
			Data.AddTableValue('lastCoords', "last "+pl.Name+" location", pl.Location);
			if ((lastLocation != ZeroVector) && (lastLocation != pl.Location)){
				var distance = Math.abs(Util.GetVectorsDistance(lastLocation, pl.Location));
				var Warned = Data.GetTableValue('AntiSH', pl.Name);
				if ((Warned == 1) && (((distance > BanDist) && ((distance < TpDist) && (Tp == 1)) && (Ban == 1)) || ((distance > BanDist) && ((Tp == 0)) && (Ban == 1)))){
					Server.BroadcastFrom( "[AntiCheat]", "[color#FF0000]"+pl.Name+" was banned (Moved "+distance.toFixed(2)+" meters)");
					pl.MessageFrom("[AntiCheat]", "[color#FF2222]You have been banned.");
					var LogString = "Moved "+distance.toFixed(2)+"m";
					banCheater(pl, LogString);
					continue;
				}
				else if ((Warned == 1) && (((distance > KickDist) && ((distance < TpDist) && (Tp == 1)) && (Kick == 1)) || ((distance > KickDist) && ((Tp == 0)) && (Kick == 1)))){
					Server.BroadcastFrom( "[AntiCheat]", "[color#FF0000]"+pl.Name+" was kicked (Moved "+distance.toFixed(2)+" meters, maybe lagged)");
					pl.MessageFrom("[AntiCheat]", "[color#FF2222]You have been kicked");
					pl.Disconnect();
					continue;
				}
				else if ((Warned == 1) && (((distance > ChatDist) && ((distance < TpDist) && (Tp == 1)) && (Chat == 1)) || ((distance > ChatDist) && ((Tp == 0)) && (Chat == 1)))){
					Server.BroadcastFrom( "[AntiCheat]", "[color#FF0000]"+pl.Name+ " moved " +distance.toFixed(2)+ " meters!");
				}	
				else if ((Warned == 1) && (distance < ChatDist)){
					Data.AddTableValue('AntiSH', pl.Name, 0);
				}
				else if (((Warned == 0) || (Warned == undefined) || (Warned == null)) && (distance > ChatDist)){
					Data.AddTableValue('AntiSH', pl.Name, 1);
				}
			}
		}
	}
	catch (err) {
            ErrorFound(err, "takeCoordsCallback");
    }
}