#Requires AutoHotkey v2.0
#SingleInstance Force

#Include *i "%A_MyDocuments%\UIA-v2\Lib\UIA.ahk"
#Include *i "%A_MyDocuments%\scripts\vendor\UIA-v2\Lib\UIA.ahk"
#Include *i "%A_MyDocuments%\scripts\vendor\UIA-v2\UIA.ahk"
#Include *i "C:\Users\%A_UserName%\Documents\UIA-v2\Lib\UIA.ahk"
#Include *i "C:\Users\%A_UserName%\Documents\scripts\vendor\UIA-v2\Lib\UIA.ahk"
#Include *i "C:\Users\%A_UserName%\Documents\scripts\vendor\UIA-v2\UIA.ahk"
#Include *i "%A_MyDocuments%\UIA-v2\Lib\UIA_Browser.ahk"
#Include *i "%A_MyDocuments%\scripts\vendor\UIA-v2\Lib\UIA_Browser.ahk"
#Include *i "%A_MyDocuments%\scripts\vendor\UIA-v2\UIA_Browser.ahk"
#Include *i "C:\Users\%A_UserName%\Documents\UIA-v2\Lib\UIA_Browser.ahk"
#Include *i "C:\Users\%A_UserName%\Documents\scripts\vendor\UIA-v2\Lib\UIA_Browser.ahk"
#Include *i "C:\Users\%A_UserName%\Documents\scripts\vendor\UIA-v2\UIA_Browser.ahk"

; Phase 1: Website Mapping helper
; Usage: AutoHotkey64.exe inspect_portal_uia.ahk --url "https://..." --out "C:\...\uia-dump.txt"

targetUrl := ""
outPath := A_Desktop "\uia-portal-inspect.txt"

i := 1
while i <= A_Args.Length {
    arg := A_Args[i]
    if (arg = "--url" && i < A_Args.Length) {
        targetUrl := A_Args[i + 1]
        i += 2
        continue
    }
    if (arg = "--out" && i < A_Args.Length) {
        outPath := A_Args[i + 1]
        i += 2
        continue
    }
    i += 1
}

inspectorPath := ""
for candidate in [
    A_MyDocuments "\UIA-v2\UIATreeInspector.ahk",
    A_MyDocuments "\scripts\vendor\UIA-v2\UIATreeInspector.ahk",
    "C:\Users\" A_UserName "\Documents\UIA-v2\UIATreeInspector.ahk",
    "C:\Users\" A_UserName "\Documents\scripts\vendor\UIA-v2\UIATreeInspector.ahk"
] {
    if FileExist(candidate) {
        inspectorPath := candidate
        break
    }
}
if (inspectorPath != "" && !WinExist("UIATreeInspector")) {
    Run('"' A_AhkPath '" "' inspectorPath '"')
}

if (targetUrl != "") {
    Run('chrome.exe "' targetUrl '"')
    if WinWaitActive("ahk_exe chrome.exe", , 15) {
        Sleep 2500
    }
}

if !WinExist("ahk_exe chrome.exe") {
    MsgBox "Chrome window not found. Open a job portal in Chrome and re-run."
    ExitApp 1
}

WinActivate("ahk_exe chrome.exe")
WinWaitActive("ahk_exe chrome.exe", , 5)
cUIA := UIA_Browser()
try cUIA.WaitPageLoad(, 8000)
Sleep 1500

docEl := cUIA.GetCurrentDocumentElement()
report := "=== UIA PORTAL INSPECTION ===`r`n"
report .= "Title: " WinGetTitle("A") "`r`n"
try report .= "URL: " cUIA.GetCurrentURL() "`r`n"
report .= "`r`n=== CANDIDATE PAGINATION / LOAD-MORE CONTROLS ===`r`n"

keywords := ["more", "mais", "next", "próxim", "proxim", "carregar", "ver todas", "load"]
try {
    buttons := docEl.FindElements({Type: "Button"})
    for btn in buttons {
        nm := ""
        try nm := btn.Name
        if (nm = "")
            continue
        low := StrLower(nm)
        for kw in keywords {
            if InStr(low, kw) {
                report .= "[Button] Name=" nm " | AutomationId=" (btn.AutomationId ?? "") "`r`n"
                break
            }
        }
    }
}

report .= "`r`n=== DOCUMENT TREE DUMP ===`r`n"
try report .= docEl.DumpAll()

try FileDelete(outPath)
FileAppend(report, outPath, "UTF-8")
ToolTip "UIA inspection saved to " outPath
SetTimer () => ToolTip(), -3000
ExitApp 0
