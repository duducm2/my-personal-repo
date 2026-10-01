Set sh = CreateObject("Wscript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
bat = fso.GetParentFolderName(WScript.ScriptFullName) & "\start.bat"
sh.Run "cmd /c """ & bat & """ --hidden", 0, False
