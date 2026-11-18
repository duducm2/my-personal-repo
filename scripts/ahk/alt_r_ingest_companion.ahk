#Requires AutoHotkey v2.0
#SingleInstance Force

; Phase 3: Standalone Alt+R helper for Career Cockpit
; When Career Cockpit is active, Alt+R triggers the web app's Alt+R Desktop .txt ingestion.
#HotIf WinActive("ahk_exe chrome.exe")
!r:: {
    title := WinGetTitle("A")
    if InStr(title, "Job openings") || InStr(title, "Target companies") {
        Send("!r")
        return
    }
    Send("!r")
}
#HotIf
