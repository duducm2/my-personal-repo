#Requires AutoHotkey v2.0
#SingleInstance Force

#Include "C:\Users\eduev\Documents\UIA-v2\Lib\UIA.ahk"
#Include "C:\Users\eduev\Documents\UIA-v2\Lib\UIA_Browser.ahk"

; Phase 2: Batch Extraction Script
; Usage: AutoHotkey64.exe batch_extract_openings.ahk --manifest <tsv_path> --result <json_path>

manifestPath := ""
resultPath := ""

i := 1
while i <= A_Args.Length {
    arg := A_Args[i]
    if (arg = "--manifest" && i < A_Args.Length) {
        manifestPath := A_Args[i + 1]
        i += 2
        continue
    }
    if (arg = "--result" && i < A_Args.Length) {
        resultPath := A_Args[i + 1]
        i += 2
        continue
    }
    i += 1
}

if (manifestPath = "" || !FileExist(manifestPath)) {
    WriteResultJson(resultPath, false, "Manifest file not found", "[]")
    ExitApp 1
}

rawManifest := FileRead(manifestPath, "UTF-8")
lines := StrSplit(rawManifest, "`n", "`r")

if !WinExist("ahk_exe chrome.exe") {
    Run("chrome.exe --new-window about:blank")
    WinWaitActive("ahk_exe chrome.exe", , 15)
    Sleep 1200
} else {
    WinActivate("ahk_exe chrome.exe")
    WinWaitActive("ahk_exe chrome.exe", , 5)
}

cUIA := UIA_Browser()
itemsJson := ""
processedCount := 0

for line in lines {
    line := Trim(line)
    if (line = "")
        continue
    cols := StrSplit(line, "`t")
    if (cols.Length < 10)
        continue

    cid := cols[1]
    cname := cols[2]
    url := cols[3]
    strategy := cols[4]
    btnType := cols[5]
    btnName := cols[6]
    maxClicks := Integer(cols[7] != "" ? cols[7] : "10")
    waitMs := Integer(cols[8] != "" ? cols[8] : "2500")
    extractMode := cols[9]
    outPath := cols[10]

    processedCount += 1
    ToolTip "Fetching (" processedCount "): " cname

    ok := false
    errMsg := ""
    pagesVisited := 1
    charsWritten := 0

    try {
        cUIA.Navigate(url)
        try cUIA.WaitPageLoad(, 12000)
        Sleep waitMs

        collected := ""
        if (strategy = "load_more_button" && btnName != "") {
            clicks := 0
            while (clicks < maxClicks) {
                ScrollDocBottom(cUIA)
                Sleep 500
                btn := FindActionControl(cUIA, btnType, btnName)
                if !btn
                    break
                try {
                    if !btn.IsEnabled
                        break
                }
                try {
                    btn.ScrollIntoView()
                    Sleep 200
                    btn.Click()
                } catch {
                    break
                }
                clicks += 1
                pagesVisited += 1
                Sleep waitMs
            }
            ScrollDocBottom(cUIA)
            Sleep 400
            collected := CopyPageText(cUIA, extractMode)
        } else if (strategy = "numbered_pagination" && btnName != "") {
            pageNum := 1
            while (pageNum <= maxClicks) {
                ScrollDocBottom(cUIA)
                Sleep 350
                pageTxt := CopyPageText(cUIA, extractMode)
                if (pageTxt != "") {
                    collected .= "=== PAGE " pageNum " ===`r`n" pageTxt "`r`n`r`n"
                }
                btn := FindActionControl(cUIA, btnType, btnName)
                if !btn
                    break
                disabled := false
                try {
                    if !btn.IsEnabled
                        disabled := true
                }
                if (disabled)
                    break
                try {
                    btn.ScrollIntoView()
                    Sleep 200
                    btn.Click()
                } catch {
                    break
                }
                pageNum += 1
                pagesVisited := pageNum
                Sleep waitMs
            }
        } else if (strategy = "infinite_scroll") {
            Loop maxClicks {
                ScrollDocStep(cUIA, A_Index * 20)
                Sleep 600
            }
            collected := CopyPageText(cUIA, extractMode)
        } else {
            ScrollDocBottom(cUIA)
            Sleep 400
            collected := CopyPageText(cUIA, extractMode)
        }

        header := "COMPANY_ID: " cid "`r`nCOMPANY_NAME: " cname "`r`nPORTAL_URL: " url "`r`nEXTRACTED_AT: " FormatTime(, "yyyy-MM-dd HH:mm:ss") "`r`n`r`n"
        finalText := header . collected
        charsWritten := StrLen(finalText)

        try FileDelete(outPath)
        FileAppend(finalText, outPath, "UTF-8")
        ok := true
    } catch as e {
        errMsg := e.Message
    }

    if (itemsJson != "")
        itemsJson .= ","
    itemsJson .= '{"id":"' JsonEsc(cid) '","ok":' (ok ? "true" : "false") ',"pages":' pagesVisited ',"chars":' charsWritten ',"out_path":"' JsonEsc(outPath) '","error":"' JsonEsc(errMsg) '"}'
}

ToolTip
WriteResultJson(resultPath, true, "", "[" itemsJson "]")
ExitApp 0

FindActionControl(cUIA, btnType, btnName) {
    docEl := ""
    try docEl := cUIA.GetCurrentDocumentElement()
    if !docEl
        return ""
    t := (btnType != "" ? btnType : "Button")
    try {
        el := docEl.FindElement({Type: t, Name: btnName, matchmode: "Substring"})
        if el
            return el
    }
    try {
        el := docEl.FindElement({Name: btnName, matchmode: "Substring"})
        if el
            return el
    }
    return ""
}

ScrollDocBottom(cUIA) {
    try {
        docEl := cUIA.GetCurrentDocumentElement()
        if docEl
            docEl.VerticalScrollPercent := 100
    }
}

ScrollDocStep(cUIA, pct) {
    try {
        docEl := cUIA.GetCurrentDocumentElement()
        if docEl
            docEl.VerticalScrollPercent := Min(100, pct)
    }
}

CopyPageText(cUIA, extractMode) {
    if (extractMode = "uia_dump") {
        try return cUIA.GetCurrentDocumentElement().DumpAll()
    }
    A_Clipboard := ""
    WinActivate("ahk_exe chrome.exe")
    Sleep 150
    Send("^a")
    Sleep 150
    Send("^c")
    if ClipWait(2) {
        txt := A_Clipboard
        if (StrLen(Trim(txt)) > 0)
            return txt
    }
    try return cUIA.GetCurrentDocumentElement().DumpAll()
    return ""
}

JsonEsc(s) {
    s := StrReplace(s, "\", "\\")
    s := StrReplace(s, '"', '\"')
    s := StrReplace(s, "`r", "\r")
    s := StrReplace(s, "`n", "\n")
    s := StrReplace(s, "`t", "\t")
    return s
}

WriteResultJson(path, ok, errMsg, itemsArrayJson) {
    if (path = "")
        return
    try FileDelete(path)
    json := '{"ok":' (ok ? "true" : "false") ',"error":"' JsonEsc(errMsg) '","items":' itemsArrayJson '}'
    FileAppend(json, path, "UTF-8")
}
