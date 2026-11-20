#Requires AutoHotkey v2.0
#SingleInstance Force

#Include "C:\Users\eduev\Documents\UIA-v2\Lib\UIA.ahk"

; Phase 2: Batch Extraction Script (Direct UIA, lock-safe clipboard, multi-button expansion)
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
    chromeHwnd := 0

    try {
        LogStep("START " cid " url=" url)
        chromeHwnd := OpenPortalUrlInChrome(url, waitMs)
        LogStep("OPENED chromeHwnd=" chromeHwnd " title=" (chromeHwnd ? WinGetTitle("ahk_id " chromeHwnd) : ""))
        if (!chromeHwnd)
            throw Error("Could not find or activate Chrome window for " url)

        docEl := WaitDocumentElement(chromeHwnd, 12000)
        LogStep("DOCEL=" (IsObject(docEl) ? "OK" : "NONE"))
        if (!docEl)
            throw Error("Timed out waiting for browser Document element")

        collected := ""
        if (strategy = "load_more_button" && btnName != "") {
            ; Tier 1: scroll to bottom so lazy-loaded groups (e.g. SmartRecruiters city sections) render
            ScrollToBottomPasses(chromeHwnd, 4, 700)
            LogStep("SCROLLED tier1")

            ; Tier 2: click every matching Hyperlink/Button ("Mostrar mais" / "Show more") across rounds
            clicks := 0
            roundIdx := 0
            while (clicks < maxClicks && roundIdx < maxClicks) {
                roundIdx += 1
                docEl := WaitDocumentElement(chromeHwnd, 5000)
                if (!docEl)
                    break

                matches := FindAllMatchingControls(docEl, btnType, btnName)
                LogStep("ROUND " roundIdx " matches=" matches.Length)
                if (matches.Length = 0) {
                    ; Scroll down once more to check if another lazy group just appeared
                    ScrollToBottomPasses(chromeHwnd, 2, 700)
                    docEl := WaitDocumentElement(chromeHwnd, 4000)
                    if (docEl)
                        matches := FindAllMatchingControls(docEl, btnType, btnName)
                    if (matches.Length = 0)
                        break
                }

                clickedThisRound := 0
                for el in matches {
                    if (clicks >= maxClicks)
                        break
                    try {
                        if !el.IsEnabled
                            continue
                    }
                    if ClickUiaElement(chromeHwnd, el) {
                        clicks += 1
                        clickedThisRound += 1
                        pagesVisited += 1
                        HumanSleep(1800, 3000)
                    }
                }
                if (clickedThisRound = 0)
                    break
                ScrollToBottomPasses(chromeHwnd, 2, 700)
            }
            ScrollToBottomPasses(chromeHwnd, 2, 500)
            collected := CopyDocumentText(chromeHwnd, extractMode)
        } else if (strategy = "numbered_pagination" && btnName != "") {
            collected := CollectPaginatedPages(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "workday_3m_dual") {
            collected := ExtractWorkday3mDual(chromeHwnd, url, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "infinite_scroll") {
            ScrollToBottomPasses(chromeHwnd, maxClicks, 650)
            collected := CopyDocumentText(chromeHwnd, extractMode)
        } else {
            ScrollToBottomPasses(chromeHwnd, 3, 500)
            collected := CopyDocumentText(chromeHwnd, extractMode)
        }

        header := "COMPANY_ID: " cid "`r`nCOMPANY_NAME: " cname "`r`nPORTAL_URL: " url "`r`nEXTRACTED_AT: " FormatTime(, "yyyy-MM-dd HH:mm:ss") "`r`n`r`n"
        finalText := header . collected
        charsWritten := StrLen(finalText)

        try FileDelete(outPath)
        f := FileOpen(outPath, "w", "UTF-8-RAW")
        if (!f)
            throw Error("Failed to open output file: " outPath)
        f.Write(finalText)
        f.Close()
        ok := true
    } catch as e {
        errMsg := e.Message
    } finally {
        CloseBatchChromeWindow(chromeHwnd)
    }
    HumanSleep(2000, 4000)

    if (itemsJson != "")
        itemsJson .= ","
    itemsJson .= '{"id":"' JsonEsc(cid) '","ok":' (ok ? "true" : "false") ',"pages":' pagesVisited ',"chars":' charsWritten ',"out_path":"' JsonEsc(outPath) '","error":"' JsonEsc(errMsg) '"}'
}

ToolTip
WriteResultJson(resultPath, true, "", "[" itemsJson "]")
ExitApp 0

IsCareerCockpitTitle(title) {
    text := StrLower(title)
    return InStr(text, "job openings")
        || InStr(text, "target companies")
        || InStr(text, "job portals")
        || InStr(text, "career profile")
        || InStr(text, "people")
        || InStr(text, "hiring 2026")
        || InStr(text, "career advice")
        || InStr(text, "keyboard shortcuts")
        || InStr(text, ":8770")
}

IsCompanionTitle(title) {
    text := StrLower(title)
    return InStr(text, "gemini")
        || InStr(text, "copilot")
        || InStr(text, "chatgpt")
        || InStr(text, "claude")
}

IsRealBrowserWindow(hwnd) {
    t := ""
    try t := Trim(WinGetTitle("ahk_id " hwnd))
    catch
        return false
    if (t = "" || IsCareerCockpitTitle(t) || IsCompanionTitle(t))
        return false
    if (InStr(t, "Traduzir") || InStr(t, "Translate"))
        return false
    x := 0, y := 0, w := 0, h := 0
    try WinGetPos(&x, &y, &w, &h, "ahk_id " hwnd)
    catch
        return false
    return (w >= 500 && h >= 350)
}

FindNonCockpitChromeWindow() {
    for hwnd in WinGetList("ahk_exe chrome.exe") {
        if IsRealBrowserWindow(hwnd)
            return hwnd
    }
    return 0
}

FindChromeExe() {
    for p in [
        EnvGet("ProgramFiles") "\Google\Chrome\Application\chrome.exe",
        EnvGet("ProgramFiles(x86)") "\Google\Chrome\Application\chrome.exe",
        EnvGet("LOCALAPPDATA") "\Google\Chrome\Application\chrome.exe"
    ] {
        if (p != "" && FileExist(p))
            return p
    }
    return "chrome.exe"
}

OpenPortalUrlInChrome(url, waitMs) {
    existing := Map()
    for h in WinGetList("ahk_exe chrome.exe")
        existing[h] := true

    chromeExe := FindChromeExe()
    batchProfile := EnvGet("LOCALAPPDATA") "\career-batch-chrome"
    Run('"' chromeExe '" --user-data-dir="' batchProfile '" --no-first-run --no-default-browser-check --new-window "' url '"')
    Sleep Max(2500, waitMs)
    deadline := A_TickCount + 15000
    hwnd := 0
    while (A_TickCount < deadline) {
        for h in WinGetList("ahk_exe chrome.exe") {
            if (!existing.Has(h) && IsRealBrowserWindow(h)) {
                hwnd := h
                break
            }
        }
        if (hwnd)
            break
        hwnd := FindNonCockpitChromeWindow()
        if (hwnd)
            break
        Sleep 300
    }
    if (hwnd) {
        try {
            WinActivate("ahk_id " hwnd)
            WinWaitActive("ahk_id " hwnd, , 4)
        }
        ; Wait until tab finishes initial load (leaves New Tab / Sem título / Untitled)
        tDeadline := A_TickCount + 12000
        while (A_TickCount < tDeadline) {
            t := ""
            try t := StrLower(Trim(WinGetTitle("ahk_id " hwnd)))
            if (t != "" && !InStr(t, "new tab") && !InStr(t, "nova guia") && !InStr(t, "sem título") && !InStr(t, "untitled") && !InStr(t, "about:blank"))
                break
            Sleep 300
        }
        Sleep 1500
        HumanSleep(800, 1800)
    }
    if (!hwnd) {
        for h in WinGetList("ahk_exe chrome.exe") {
            t := ""
            try t := Trim(WinGetTitle("ahk_id " h))
            x := 0, y := 0, w := 0, hh := 0
            try WinGetPos(&x, &y, &w, &hh, "ahk_id " h)
            LogStep("CANDIDATE hwnd=" h " w=" w " h=" hh " title=" t)
        }
    }
    return hwnd
}

CloseBatchChromeWindow(hwnd) {
    if (!hwnd)
        return
    t := ""
    try t := Trim(WinGetTitle("ahk_id " hwnd))
    if (t != "" && (IsCareerCockpitTitle(t) || IsCompanionTitle(t)))
        return
    try WinClose("ahk_id " hwnd)
    Sleep 350
}

WaitDocumentElement(chromeHwnd, timeoutMs := 10000) {
    deadline := A_TickCount + timeoutMs
    while (A_TickCount < deadline) {
        try {
            root := UIA.ElementFromHandle(chromeHwnd)
            if (IsObject(root)) {
                doc := root.FindFirst(UIA.CreatePropertyCondition(UIA.Property.Type, UIA.Type.Document))
                if (IsObject(doc))
                    return doc
            }
        }
        Sleep 250
    }
    return ""
}

FocusDocumentBody(chromeHwnd) {
    WinActivate("ahk_id " chromeHwnd)
    WinWaitActive("ahk_id " chromeHwnd, , 3)
    docEl := WaitDocumentElement(chromeHwnd, 3000)
    if (docEl) {
        try docEl.SetFocus()
        try {
            pos := docEl.GetPos("screen")
            if (pos && pos.w > 80 && pos.h > 80) {
                CoordMode("Mouse", "Screen")
                Click(pos.x + 24, pos.y + 24)
                Sleep 120
                return
            }
        }
    }
}

ScrollToBottomPasses(chromeHwnd, passes := 3, delayMs := 600) {
    FocusDocumentBody(chromeHwnd)
    Loop passes {
        Send("^{End}")
        HumanSleep(Max(850, delayMs), Max(1450, delayMs + 600))
    }
}

FindAllMatchingControls(docEl, btnTypeSpec, btnNameSpec) {
    results := []
    seen := Map()
    types := []
    for t in StrSplit(btnTypeSpec != "" ? btnTypeSpec : "Hyperlink|Button", "|") {
        t := Trim(t)
        if (t != "")
            types.Push(t)
    }
    if (types.Length = 0)
        types := ["Hyperlink", "Button"]

    names := []
    for n in StrSplit(btnNameSpec, "|") {
        n := Trim(n)
        if (n != "")
            names.Push(n)
    }
    if (names.Length = 0)
        return results

    for tName in types {
        for pat in names {
            els := []
            try els := docEl.FindElements({Type: tName, Name: pat, matchmode: "Substring"})
            for el in els {
                nm := ""
                try nm := Trim(el.Name)
                key := nm
                try {
                    p := el.GetPos("screen")
                    key .= "@" p.x "," p.y
                }
                if !seen.Has(key) {
                    seen[key] := true
                    results.Push(el)
                }
            }
        }
    }
    return results
}

LogStep(msg) {
    static logPath := A_ScriptDir "\..\..\my-data\debug\batch_ahk.log"
    try FileAppend(FormatTime(, "HH:mm:ss") " " msg "`r`n", logPath, "UTF-8")
}

ClickUiaElement(chromeHwnd, el) {
    try {
        WinActivate("ahk_id " chromeHwnd)
        el.ScrollIntoView()
        HumanSleep(350, 700)
    }
    try {
        el.Click()
        HumanSleep(250, 550)
        return true
    }
    try {
        el.Invoke()
        HumanSleep(250, 550)
        return true
    }
    try {
        p := el.GetPos("screen")
        if (p && p.w > 0 && p.h > 0) {
            CoordMode("Mouse", "Screen")
            Click(p.x + p.w // 2, p.y + p.h // 2)
            HumanSleep(250, 550)
            return true
        }
    }
    return false
}

ClipboardUnicode() {
    opened := false
    loop 20 {
        if DllCall("OpenClipboard", "Ptr", 0) {
            opened := true
            break
        }
        Sleep 50
    }
    if (!opened)
        return ""
    text := ""
    try {
        handle := DllCall("GetClipboardData", "UInt", 13, "Ptr")
        if (handle) {
            ptr := DllCall("GlobalLock", "Ptr", handle, "Ptr")
            if (ptr) {
                text := StrGet(ptr, "UTF-16")
                DllCall("GlobalUnlock", "Ptr", handle)
            }
        }
    } catch {
        text := ""
    }
    DllCall("CloseClipboard")
    return text
}

ClearClipboardSafe() {
    loop 15 {
        if DllCall("OpenClipboard", "Ptr", 0) {
            DllCall("EmptyClipboard")
            DllCall("CloseClipboard")
            return true
        }
        Sleep 40
    }
    return false
}

CopyDocumentText(chromeHwnd, extractMode) {
    if (extractMode = "uia_dump") {
        docEl := WaitDocumentElement(chromeHwnd, 3000)
        if (docEl) {
            try return docEl.DumpAll()
        }
    }

    FocusDocumentBody(chromeHwnd)
    before := ClipboardUnicode()
    ClearClipboardSafe()
    HumanSleep(150, 300)
    Send("^a")
    HumanSleep(220, 420)
    Send("^c")

    txt := ""
    deadline := A_TickCount + 3000
    while (A_TickCount < deadline) {
        Sleep 150
        candidate := ClipboardUnicode()
        if (StrLen(Trim(candidate)) > 0 && candidate != before) {
            txt := candidate
            break
        }
        if (StrLen(Trim(candidate)) > 200) {
            txt := candidate
            break
        }
    }

    if (StrLen(Trim(txt)) >= 100)
        return txt

    docEl := WaitDocumentElement(chromeHwnd, 3000)
    if (docEl) {
        try return docEl.DumpAll()
    }
    return txt
}

HumanSleep(minMs, maxMs) {
    lo := Min(minMs, maxMs)
    hi := Max(minMs, maxMs)
    Sleep Random(lo, hi)
}

CollectPaginatedPages(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited, sectionPrefix := "") {
    collected := ""
    pageNum := 1
    while (pageNum <= maxClicks) {
        ScrollToBottomPasses(chromeHwnd, 2, 700)
        pageTxt := CopyDocumentText(chromeHwnd, extractMode)
        if (pageTxt != "") {
            label := sectionPrefix != "" ? sectionPrefix " - PAGE " pageNum : "PAGE " pageNum
            collected .= "=== " label " ===`r`n" pageTxt "`r`n`r`n"
        }
        if (btnName = "")
            break
        docEl := WaitDocumentElement(chromeHwnd, 5000)
        if (!docEl)
            break
        matches := FindAllMatchingControls(docEl, btnType != "" ? btnType : "Button", btnName)
        if (matches.Length = 0)
            break
        btn := matches[1]
        disabled := false
        try {
            if !btn.IsEnabled
                disabled := true
        }
        if (disabled)
            break
        if !ClickUiaElement(chromeHwnd, btn)
            break
        pageNum += 1
        pagesVisited += 1
        HumanSleep(Max(2500, waitMs), Max(4200, waitMs + 1500))
    }
    return collected
}

ClickFirstControlByName(chromeHwnd, typeSpec, nameSpec, fallbackName := "") {
    docEl := WaitDocumentElement(chromeHwnd, 5000)
    if (!docEl)
        return false
    matches := FindAllMatchingControls(docEl, typeSpec, nameSpec)
    if (matches.Length = 0 && fallbackName != "")
        matches := FindAllMatchingControls(docEl, typeSpec, fallbackName)
    if (matches.Length = 0)
        return false
    return ClickUiaElement(chromeHwnd, matches[1])
}

ToggleOrClickCheckbox(chromeHwnd, nameSpec, fallbackName := "") {
    docEl := WaitDocumentElement(chromeHwnd, 5000)
    if (!docEl)
        return false
    matches := FindAllMatchingControls(docEl, "CheckBox", nameSpec)
    if (matches.Length = 0 && fallbackName != "")
        matches := FindAllMatchingControls(docEl, "CheckBox", fallbackName)
    if (matches.Length = 0)
        matches := FindAllMatchingControls(docEl, "Text|ListItem", nameSpec)
    LogStep("CHECKBOX [" nameSpec "] matches=" matches.Length)
    if (matches.Length = 0)
        return false
    el := matches[1]
    try {
        WinActivate("ahk_id " chromeHwnd)
        el.ScrollIntoView()
        HumanSleep(350, 700)
    }
    try {
        if (el.Type = UIA.Type.CheckBox) {
            state := el.ToggleState
            if (state = 0) {
                el.Toggle()
                HumanSleep(350, 700)
                if (el.ToggleState = 1)
                    return true
            } else {
                return true
            }
        }
    }
    return ClickUiaElement(chromeHwnd, el)
}

RefreshChromeUrl(chromeHwnd, url, waitMs) {
    WinActivate("ahk_id " chromeHwnd)
    WinWaitActive("ahk_id " chromeHwnd, , 3)
    Send("^l")
    HumanSleep(250, 500)
    SendText(url)
    HumanSleep(200, 400)
    Send("{Enter}")
    HumanSleep(Max(3000, waitMs), Max(4500, waitMs + 1500))
    WaitDocumentElement(chromeHwnd, 12000)
    HumanSleep(1200, 2200)
}

ExtractWorkday3mDual(chromeHwnd, url, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    collected := ""

    ; Method 1: Select "More" -> "Remote Work Options" -> "Remote" -> "View Jobs"
    LogStep("3M METHOD 1: More -> Remote Work Options -> Remote")
    moreOk := ClickFirstControlByName(chromeHwnd, "Button|MenuItem", "More")
    LogStep("3M M1 More clicked=" moreOk)
    if (moreOk) {
        HumanSleep(1200, 2000)
        docEl := WaitDocumentElement(chromeHwnd, 4000)
        remoteMatches := docEl ? FindAllMatchingControls(docEl, "CheckBox", "Remote") : []
        if (remoteMatches.Length = 0) {
            rwoOk := ClickFirstControlByName(chromeHwnd, "Button|CheckBox|Text|Group", "Remote Work Options")
            LogStep("3M M1 RemoteWorkOptions clicked=" rwoOk)
            HumanSleep(900, 1600)
        }
        remOk := ToggleOrClickCheckbox(chromeHwnd, "Remote (", "Remote")
        LogStep("3M M1 Remote checked=" remOk)
        if (remOk) {
            HumanSleep(700, 1300)
            vjOk := ClickFirstControlByName(chromeHwnd, "Button", "View Jobs")
            LogStep("3M M1 ViewJobs clicked=" vjOk)
            HumanSleep(Max(3500, waitMs), Max(5000, waitMs + 1500))
        }
    }
    m1Text := CollectPaginatedPages(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited, "METHOD 1 (REMOTE)")
    if (m1Text != "")
        collected .= m1Text

    ; Method 2: Refresh page and retrieve all job openings in Brazil regardless of work type
    HumanSleep(1500, 2800)
    LogStep("3M METHOD 2: Refresh -> Geography/Country -> Brazil")
    RefreshChromeUrl(chromeHwnd, url, waitMs)
    geoOk := ClickFirstControlByName(chromeHwnd, "Button|MenuItem", "Geography/Country", "Geography")
    LogStep("3M M2 Geography clicked=" geoOk)
    if (geoOk) {
        HumanSleep(1200, 2000)
        brOk := ToggleOrClickCheckbox(chromeHwnd, "Brazil (", "Brazil")
        LogStep("3M M2 Brazil checked=" brOk)
        if (brOk) {
            HumanSleep(700, 1300)
            vjOk2 := ClickFirstControlByName(chromeHwnd, "Button", "View Jobs")
            LogStep("3M M2 ViewJobs clicked=" vjOk2)
            HumanSleep(Max(3500, waitMs), Max(5000, waitMs + 1500))
        }
    }
    m2Text := CollectPaginatedPages(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited, "METHOD 2 (BRAZIL ALL)")
    if (m2Text != "")
        collected .= m2Text

    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
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
    f := FileOpen(path, "w", "UTF-8-RAW")
    if (f) {
        f.Write(json)
        f.Close()
    }
}
