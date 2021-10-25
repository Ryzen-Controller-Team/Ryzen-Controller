Set WshShell = CreateObject("WScript.Shell" ) 
scriptdir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run """" + scriptdir + "\..\..\..\..\Ryzen Controller""", 0
Set WshShell = Nothing