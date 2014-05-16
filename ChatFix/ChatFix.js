
function On_Chat(Player, ChatString) {
	ChatString = ChatString.toString();
	var string = "";
	if (ChatString.length > 67){
		for (var i = 1; i <= ChatString.length - 2; i++){
			if (i % 65 == 0){
				string = string + ChatString.charAt(i);
				Server.BroadcastFrom(Player.Name, string);
				string = "";
			}
			else {
				string = string + ChatString.charAt(i);
			}
		}	
		Server.BroadcastFrom(Player.Name, string);
	}
	return;
}