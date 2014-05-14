Anticheat System by Skippi
========================================================
If somebody wants to help me to test anticheat - i have no server to test this plugin on. Test it yourself =)

Features:

AntiSpeedhack - tellsabout\kicks\bans players who have speed bigger then ChatDistance\KickDistance\Bandistance
Whitelist
/voteban NAME
New Join\Leave messages system - now it doesn't flood if player was banned and trying to connect (in Rust++.cfg join_notice and leave_notice must be false)
AntiAim - bans player if he made ShotsCount from distance bigger then ShotMaxDistance in a row
Bans players who made kill from distance bigger then MaxKillDistance....or bigger then maximum weapon's range
DeathMessage - just Death message =)
NameRestriction - doesn't allow players with illegal characters\names to log in
Don't allow to connect players who are using shared RUST client or players who have any VAC ban.
You can set how many seconds should players wait before connecting to your server after disconnect

Warning: If your server has lags - increase numbers, otherwise you will see many kicks

Commands:
"/banip NAME" - ban NAME by IP and SteamID
with "/whitelist SteamID" or "/whitelist IP" or "/whitelist Name" you can whitelist players
/voteban NAME - to start voting for NAME's ban

Config:
Join - post message when player joins server (in Rust++.cfg join_notice must be false)
Leave - post message when player leaves server (in Rust++.cfg leave_notice must be false)
Death - post message when player kills smb
Enable - 1\0 enable or disable feature
BindNameToSteamID - 1\0 bind names to SteamID ("Skippi" = "skippi" = "skiPPi", etc)
BindOnlyAdmins - 1\0 bind only names which belongs to admins
MinLength - minimum nick's length
MaxLength - maximum nick's length
AllowedChars - what chars players can use in their nicknames
BannedNames - what names players cant use
MinOnline - how many players should be on server to start voting for ban
MinYesPercent - how many persents of "yes" should be to ban player
SecsToVote - how many seconds will be given for voting
APIKey - steam api key (pls get your own here http://steamcommunity.com/dev/apikey)
AllowShared - 1\0 allow to connect players with shared copy of RUST
AllowVACBanned - 1\0 allow to connect players with VAC ban\bans
AllowedVACBans - how many vac bans can user have to be allowed to connect.
MaximumDays - how many days should pass after last vac ban to allow player to connect (0 - dont count days)
MaxPing - maximum player's (if bigger - kick)
SecondsToCheck - how often to check player's ping
Cooldown - how many seconds should player wait after discobbect to be able to reconnect
EnabledForAdmins - if 1 admins will wait theese Cooldown seconds too
Timer - how often to check players (In seconds)
TempWork - if is set to 1 antispeedhack wil work for WorkMins every RestMins (This feature can fix crashes of plugin)
RestMins - how many minutes shoul plugin wait before reenabling antispeedhack check
WorkMins - how many minutes should antispeedhack check work
AdminCheck - 1\0 should admins be checked for cheats
Chat - 1\0 write into the chat or not
Kick - 1\0 kick or not
Ban - 1\0 ban or not (if player falls - his speed is veeery fast, so i dont advice you to enable it...or set BanDistance > 65)
Teleport - 1\0 if you use plugins like /home go, /tpa - turn it on, plugin will check if distance is bigger then TeleportDistance and if true - it will do nothing.
ChatDistance - speed after which plugin should write it into the chat
KickDistance - speed after which plugin should Kick
BanDistance - speed after which plugin should Ban
TeleportDistance - if player moved more then TeleportDistance meters for ~2sec then let plugin think that it was teleport plugin
HeadshotsOnly - 1\0 if 1 then count only headshots
ShotsCount - how many kills into same bodyparts can player do in a row (if he made ShotsCount - ban)
ShotMaxDistance - shots from what distance anticheat should count
MaxKillDistance - distance from which player should make kill to be instantly banned

Need to be tested:
GodMod cheat detection
Upcoming:

"in developing"AntiFlyHack (in version 5.0)
