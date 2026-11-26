#Requires AutoHotkey v2.0
#SingleInstance Force
try DllCall("SetProcessDpiAwarenessContext", "Ptr", -4, "Ptr")

#Include *i %A_MyDocuments%\UIA-v2\Lib\UIA.ahk
#Include *i C:\Users\fie7ca\Documents\scripts\vendor\UIA-v2\Lib\UIA.ahk
#Include *i %A_MyDocuments%\scripts\vendor\UIA-v2\Lib\UIA.ahk
#Include *i C:\Users\%A_UserName%\Documents\UIA-v2\Lib\UIA.ahk
#Include *i C:\Users\%A_UserName%\Documents\scripts\vendor\UIA-v2\Lib\UIA.ahk

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
        } else if (strategy = "workday_location") {
            collected := ExtractWorkdayLocation(chromeHwnd, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "workday_3m_dual") {
            collected := ExtractWorkday3mDual(chromeHwnd, url, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "agibank_campinas") {
            collected := ExtractAgibankCampinas(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "greenhouse_office") {
            collected := ExtractGreenhouseOffice(chromeHwnd, btnName, waitMs, extractMode)
        } else if (strategy = "gupy_state_city" || strategy = "gupy_dual" || strategy = "gupy_remote_only") {
            collected := ExtractGupyDual(chromeHwnd, url, btnName, maxClicks, waitMs, extractMode, &pagesVisited, strategy = "gupy_remote_only")
        } else if (strategy = "mercado_livre_remote") {
            collected := ExtractMercadoLivreRemote(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "levva_dual") {
            collected := ExtractLevvaDual(chromeHwnd, url, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "inhire_dual") {
            collected := ExtractInhireDual(chromeHwnd, url, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "lg_estado_municipio") {
            collected := ExtractLgEstadoMunicipio(chromeHwnd, btnName, maxClicks, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "ciandt_dual") {
            collected := ExtractCiandtDual(chromeHwnd, url, waitMs, extractMode, &pagesVisited)
        } else if (strategy = "successfactors_location") {
            collected := ExtractSuccessFactorsLocation(chromeHwnd, btnName, waitMs, extractMode)
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
    if (InStr(t, "Traduzir") || InStr(t, "Translate") || InStr(t, " quer ") || InStr(t, "wants to"))
        return false
    x := 0, y := 0, w := 0, h := 0
    try WinGetPos(&x, &y, &w, &h, "ahk_id " hwnd)
    catch
        return false
    return (w >= 650 && h >= 450)
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
    Run('"' chromeExe '" --user-data-dir="' batchProfile '" --no-first-run --no-default-browser-check --deny-permission-prompts --new-window "' url '"')
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
    prevPageTxt := ""
    pageNum := 1
    while (pageNum <= maxClicks) {
        ScrollToBottomPasses(chromeHwnd, 2, 700)
        pageTxt := CopyDocumentText(chromeHwnd, extractMode)
        if (pageTxt != "" && pageTxt = prevPageTxt)
            break
        if (pageTxt != "") {
            prevPageTxt := pageTxt
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

ExtractAgibankCampinas(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    LogStep("AGIBANK: opening Localidade dropdown")
    HumanSleep(1000, 1800)
    locOk := ClickFirstControlByName(chromeHwnd, "Button", "Localidade")
    LogStep("AGIBANK Localidade clicked=" locOk)
    if (locOk) {
        HumanSleep(900, 1500)
        docEl := WaitDocumentElement(chromeHwnd, 5000)
        if (docEl) {
            edits := []
            try edits := docEl.FindElements({Type: "Edit"})
            LogStep("AGIBANK Edit count=" edits.Length)
            if (edits.Length > 0) {
                dropdownEdit := edits[edits.Length]
                if ClickUiaElement(chromeHwnd, dropdownEdit) {
                    HumanSleep(250, 450)
                    Send("^a")
                    HumanSleep(100, 200)
                    SendText("campinas")
                    HumanSleep(900, 1600)
                    docEl := WaitDocumentElement(chromeHwnd, 4000)
                    editPos := ""
                    try editPos := dropdownEdit.GetPos("screen")
                    if (IsObject(editPos))
                        LogStep("AGIBANK editPos=" editPos.x "," editPos.y "," editPos.w "x" editPos.h)
                    exactCamp := []
                    if (docEl) {
                        allCamp := []
                        try allCamp := docEl.FindElements({Name: "Campinas", matchmode: "Substring"})
                        LogStep("AGIBANK allCamp count=" allCamp.Length)
                        for el in allCamp {
                            nm := ""
                            tp := ""
                            ep := ""
                            try nm := Trim(el.Name)
                            try tp := el.LocalizedType
                            try ep := el.GetPos("screen")
                            posStr := IsObject(ep) ? (ep.x "," ep.y "," ep.w "x" ep.h) : "none"
                            LogStep("AGIBANK cand Type=[" tp "] Name=[" nm "] Pos=[" posStr "]")
                            if (StrLower(nm) != "campinas")
                                continue
                            if (el.Type != UIA.Type.Button && el.Type != UIA.Type.ListItem && el.Type != UIA.Type.MenuItem)
                                continue
                            if (IsObject(editPos) && IsObject(ep) && ep.w > 0 && ep.h > 0) {
                                if (ep.y > editPos.y && Abs(ep.x - editPos.x) < 300)
                                    exactCamp.Push(el)
                            } else if (!IsObject(editPos)) {
                                exactCamp.Push(el)
                            }
                        }
                    }
                    LogStep("AGIBANK exact Campinas dropdown matches=" exactCamp.Length)
                    campOk := false
                    if (exactCamp.Length > 0) {
                        campOk := ClickUiaElement(chromeHwnd, exactCamp[1])
                    }
                    LogStep("AGIBANK Campinas clicked=" campOk)
                    HumanSleep(500, 900)
                    ; Close the multi-select dropdown cleanly before paginating/copying
                    if !ClickFirstControlByName(chromeHwnd, "Button", "selecionado", "Localidade") {
                        WinActivate("ahk_id " chromeHwnd)
                        Send("{Escape}")
                    }
                    HumanSleep(Max(2000, waitMs), Max(3500, waitMs + 1000))
                }
            }
        }
    }
    collected := CollectPaginatedPages(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited, "AGIBANK (CAMPINAS)")
    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

ExtractGreenhouseOffice(chromeHwnd, officeName, waitMs, extractMode) {
    targetOffice := officeName != "" ? officeName : "Campinas"
    LogStep("GREENHOUSE: filtering office=[" targetOffice "]")
    HumanSleep(800, 1400)
    docEl := WaitDocumentElement(chromeHwnd, 5000)
    if (docEl) {
        combos := []
        edits := []
        try combos := docEl.FindElements({Type: "ComboBox"})
        try edits := docEl.FindElements({Type: "Edit"})
        LogStep("GREENHOUSE combos=" combos.Length " edits=" edits.Length)

        targetEl := ""
        for el in combos {
            nm := "", aid := ""
            try nm := Trim(el.Name)
            try aid := Trim(el.AutomationId)
            if (aid = "office-filter" || InStr(StrLower(nm), "agência") || InStr(StrLower(nm), "agencia") || InStr(StrLower(nm), "office") || InStr(StrLower(nm), "location")) {
                targetEl := el
                break
            }
        }
        if (!IsObject(targetEl) && combos.Length > 0)
            targetEl := combos[combos.Length]
        if (!IsObject(targetEl) && edits.Length > 0)
            targetEl := edits[edits.Length]

        if (IsObject(targetEl)) {
            ClickUiaElement(chromeHwnd, targetEl)
            try targetEl.SetFocus()
            HumanSleep(300, 550)
            SendText(targetOffice)
            HumanSleep(900, 1400)
            docEl := WaitDocumentElement(chromeHwnd, 4000)
            optClicked := false
            if (docEl) {
                opts := FindAllMatchingControls(docEl, "ListItem|MenuItem", targetOffice)
                LogStep("GREENHOUSE option matches=" opts.Length)
                if (opts.Length > 0) {
                    optNm := ""
                    try optNm := Trim(opts[1].Name)
                    LogStep("GREENHOUSE opt1=[" optNm "]")
                    WinActivate("ahk_id " chromeHwnd)
                    Send("{Enter}")
                    HumanSleep(300, 500)
                    optClicked := true
                }
            }
            if (!optClicked) {
                WinActivate("ahk_id " chromeHwnd)
                Send("{Enter}")
                HumanSleep(300, 500)
            }
            LogStep("GREENHOUSE office selected optClicked=" optClicked)
            HumanSleep(Max(1800, waitMs), Max(2800, waitMs + 800))
        }
    }
    ScrollToBottomPasses(chromeHwnd, 3, 500)
    return CopyDocumentText(chromeHwnd, extractMode)
}

ExtractGupyDual(chromeHwnd, url, spec, maxClicks, waitMs, extractMode, &pagesVisited, remoteOnly := false) {
    pagesVisited := 0
    collected := ""
    parts := StrSplit(spec, "|")
    stateName := parts.Length >= 1 ? Trim(parts[1]) : ""
    cityName := parts.Length >= 2 ? Trim(parts[2]) : ""
    LogStep("GUPY DUAL: url=[" url "] state=[" stateName "] city=[" cityName "] remoteOnly=" remoteOnly)

    ScrollToBottomPasses(chromeHwnd, 2, 500)
    HumanSleep(600, 1000)

    ; Method 1: Check Modo de trabalho -> Remoto
    hasRemote := false
    if (ClickFirstControlByName(chromeHwnd, "ComboBox", "Modo de trabalho")) {
        HumanSleep(500, 800)
        docEl := WaitDocumentElement(chromeHwnd, 3000)
        if (docEl) {
            remOpts := FindAllMatchingControls(docEl, "ListItem|MenuItem", "Remoto")
            for opt in remOpts {
                nm := ""
                try nm := Trim(opt.Name)
                if (StrLen(nm) > 0 && StrLen(nm) <= 25 && InStr(StrLower(nm), "remoto")) {
                    hasRemote := true
                    break
                }
            }
        }
        LogStep("GUPY M1 Remoto available=" hasRemote)
        if (hasRemote) {
            SendText("Remoto")
            HumanSleep(500, 800)
            WinActivate("ahk_id " chromeHwnd)
            Send("{Down}{Enter}")
            HumanSleep(Max(1500, waitMs), Max(2500, waitMs + 700))
            m1Text := CollectPaginatedPages(chromeHwnd, "Button", "Vá para próxima página", maxClicks, waitMs, extractMode, &pagesVisited, "METHOD 1 (REMOTO)")
            if (m1Text != "")
                collected .= m1Text
            if (remoteOnly) {
                if (pagesVisited < 1)
                    pagesVisited := 1
                return collected
            }
            HumanSleep(1000, 1800)
            RefreshChromeUrl(chromeHwnd, url, waitMs)
            ScrollToBottomPasses(chromeHwnd, 2, 500)
            HumanSleep(500, 900)
        } else {
            WinActivate("ahk_id " chromeHwnd)
            Send("{Escape}")
            HumanSleep(300, 500)
            if (remoteOnly) {
                pagesVisited := 1
                return "NO REMOTE OPENINGS AVAILABLE`r`n"
            }
        }
    } else if (remoteOnly) {
        pagesVisited := 1
        return "NO REMOTE OPENINGS AVAILABLE`r`n"
    }

    ; Method 2: Local (Estado + Cidade if configured, otherwise all jobs)
    if (stateName != "") {
        stBoxOk := ClickFirstControlByName(chromeHwnd, "ComboBox", "Estado")
        LogStep("GUPY M2 state box clicked=" stBoxOk)
        if (stBoxOk) {
            HumanSleep(300, 500)
            SendText(stateName)
            HumanSleep(700, 1100)
            WinActivate("ahk_id " chromeHwnd)
            Send("{Down}{Enter}")
            HumanSleep(900, 1400)
        }
    }
    if (cityName != "") {
        ctBoxOk := ClickFirstControlByName(chromeHwnd, "ComboBox", "Cidade")
        LogStep("GUPY M2 city box clicked=" ctBoxOk)
        if (ctBoxOk) {
            HumanSleep(300, 500)
            SendText(cityName)
            HumanSleep(700, 1100)
            WinActivate("ahk_id " chromeHwnd)
            Send("{Down}{Enter}")
            HumanSleep(Max(1500, waitMs), Max(2500, waitMs + 700))
        }
    }

    m2Text := CollectPaginatedPages(chromeHwnd, "Button", "Vá para próxima página", maxClicks, waitMs, extractMode, &pagesVisited, "METHOD 2 (LOCAL)")
    if (m2Text != "")
        collected .= m2Text

    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

ExtractMercadoLivreRemote(chromeHwnd, btnType, btnName, maxClicks, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    LogStep("MELI: opening All filters -> Workplace type -> Remote")
    HumanSleep(1200, 1800)
    afOk := ClickFirstControlByName(chromeHwnd, "Button", "All filters")
    LogStep("MELI All filters clicked=" afOk)
    HumanSleep(800, 1300)
    docEl := WaitDocumentElement(chromeHwnd, 6000)
    remClicked := false
    if (docEl) {
        cands := FindAllMatchingControls(docEl, "Button|CheckBox|Text|ListItem", "Remote")
        LogStep("MELI Remote cands=" cands.Length)
        for el in cands {
            nm := ""
            try nm := Trim(el.Name)
            if (StrLower(nm) = "remote") {
                remClicked := ClickUiaElement(chromeHwnd, el)
                LogStep("MELI Remote clicked=" remClicked " Type=[" el.LocalizedType "]")
                if (remClicked)
                    break
            }
        }
    }
    HumanSleep(Max(1800, waitMs), Max(2800, waitMs + 800))

    collected := CollectPaginatedPages(chromeHwnd, "Button", "Next", maxClicks, waitMs, extractMode, &pagesVisited)
    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

CollectIzirhPages(chromeHwnd, maxClicks, waitMs, extractMode, &pagesVisited, sectionPrefix) {
    collected := ""
    prevPageTxt := ""
    pageNum := 1
    while (pageNum <= maxClicks) {
        ScrollToBottomPasses(chromeHwnd, 2, 500)
        pageTxt := CopyDocumentText(chromeHwnd, extractMode)
        if (pageTxt != "" && pageTxt = prevPageTxt)
            break
        if (pageTxt != "") {
            prevPageTxt := pageTxt
            collected .= "=== " sectionPrefix " - PAGE " pageNum " ===`r`n" pageTxt "`r`n`r`n"
        }
        nextLabel := String(pageNum + 1)
        docEl := WaitDocumentElement(chromeHwnd, 4000)
        if (!docEl)
            break
        cands := FindAllMatchingControls(docEl, "Button|Hyperlink", nextLabel)
        LogStep("IZIRH next=[" nextLabel "] cands=" cands.Length)
        nextBtn := ""
        for el in cands {
            nm := ""
            try nm := Trim(el.Name)
            LogStep("IZIRH cand Type=[" el.LocalizedType "] Name=[" nm "]")
            if (nm = nextLabel || nm = "Ir para a página " nextLabel) {
                nextBtn := el
                break
            }
        }
        if (!IsObject(nextBtn))
            break
        disabled := false
        try {
            if !nextBtn.IsEnabled
                disabled := true
        }
        if (disabled || !ClickUiaElement(chromeHwnd, nextBtn))
            break
        pageNum += 1
        pagesVisited += 1
        HumanSleep(Max(1800, waitMs), Max(2800, waitMs + 800))
    }
    return collected
}

ClickLevvaFiltrar(chromeHwnd) {
    if (ClickFirstControlByName(chromeHwnd, "Button", "Filtrar"))
        return true
    docEl := WaitDocumentElement(chromeHwnd, 4000)
    if (!docEl)
        return false
    try {
        el := docEl.FindFirst({AutomationId: "button-filtrar"})
        if (IsObject(el))
            return ClickUiaElement(chromeHwnd, el)
    }
    return false
}

ExtractLevvaDual(chromeHwnd, url, maxClicks, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    collected := ""

    ; Method 1: Filtrar -> Tipo de trabalho -> Remoto
    LogStep("LEVVA METHOD 1: Filtrar -> Tipo de trabalho -> Remoto")
    HumanSleep(1200, 1800)
    f1Ok := ClickLevvaFiltrar(chromeHwnd)
    LogStep("LEVVA M1 button-filtrar=" f1Ok)
    HumanSleep(500, 800)
    if (ClickFirstControlByName(chromeHwnd, "Button", "Tipo de trabalho")) {
        HumanSleep(500, 800)
        remOk := ToggleOrClickCheckbox(chromeHwnd, "Remoto")
        LogStep("LEVVA M1 Remoto checked=" remOk)
        HumanSleep(400, 700)
        WinActivate("ahk_id " chromeHwnd)
        Send("{Escape}")
        HumanSleep(Max(1800, waitMs), Max(2600, waitMs + 600))
    }
    m1Text := CollectIzirhPages(chromeHwnd, maxClicks, waitMs, extractMode, &pagesVisited, "METHOD 1 (REMOTO)")
    if (m1Text != "")
        collected .= m1Text

    ; Method 2: Switch Tipo de trabalho from Remoto -> Presencial + Híbrido, and Cidade -> Campinas, Hortolândia, Indaiatuba
    HumanSleep(1000, 1800)
    LogStep("LEVVA METHOD 2: Tipo de trabalho (Presencial+Hibrido) + Cidade (Campinas/Hortolandia/Indaiatuba)")
    if (ClickFirstControlByName(chromeHwnd, "Button", "Remoto", "Tipo de trabalho")) {
        HumanSleep(500, 800)
        ; Uncheck Remoto if still selected, then check Presencial & Híbrido
        ToggleOrClickCheckbox(chromeHwnd, "Remoto")
        HumanSleep(300, 500)
        pOk := ToggleOrClickCheckbox(chromeHwnd, "Presencial")
        HumanSleep(300, 500)
        hOk := ToggleOrClickCheckbox(chromeHwnd, "Híbrido")
        LogStep("LEVVA M2 Presencial=" pOk " Hibrido=" hOk)
        HumanSleep(300, 500)
        WinActivate("ahk_id " chromeHwnd)
        Send("{Escape}")
        HumanSleep(400, 700)
    }
    if (ClickFirstControlByName(chromeHwnd, "Button", "Cidade")) {
        HumanSleep(500, 800)
        c1 := ToggleOrClickCheckbox(chromeHwnd, "Campinas")
        HumanSleep(250, 450)
        c2 := ToggleOrClickCheckbox(chromeHwnd, "Hortolândia")
        HumanSleep(250, 450)
        c3 := ToggleOrClickCheckbox(chromeHwnd, "Indaiatuba")
        LogStep("LEVVA M2 Cidades=" c1 "," c2 "," c3)
        HumanSleep(400, 700)
        WinActivate("ahk_id " chromeHwnd)
        Send("{Escape}")
        HumanSleep(Max(1800, waitMs), Max(2600, waitMs + 600))
    }
    m2Text := CollectIzirhPages(chromeHwnd, maxClicks, waitMs, extractMode, &pagesVisited, "METHOD 2 (LOCAL)")
    if (m2Text != "")
        collected .= m2Text

    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

ExtractLgEstadoMunicipio(chromeHwnd, spec, maxClicks, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    parts := StrSplit(spec != "" ? spec : "São Paulo|CAMPINAS", "|")
    stateName := parts.Length >= 1 && Trim(parts[1]) != "" ? Trim(parts[1]) : "São Paulo"
    cityName := parts.Length >= 2 ? Trim(parts[2]) : ""
    LogStep("LG: filtering Estado=[" stateName "] Municipio=[" cityName "]")
    HumanSleep(1000, 1500)

    if (ClickFirstControlByName(chromeHwnd, "Button", "Estado")) {
        HumanSleep(500, 800)
        stOk := ToggleOrClickCheckbox(chromeHwnd, stateName)
        LogStep("LG Estado [" stateName "] clicked=" stOk)
        HumanSleep(1000, 1600)
    }

    if (cityName != "" && ClickFirstControlByName(chromeHwnd, "Button", "Município", "Municipio")) {
        HumanSleep(500, 800)
        ctOk := ToggleOrClickCheckbox(chromeHwnd, cityName)
        LogStep("LG Municipio [" cityName "] clicked=" ctOk)
        HumanSleep(Max(1500, waitMs), Max(2500, waitMs + 700))
    }

    collected := CollectPaginatedPages(chromeHwnd, "Hyperlink|Button", "Próxima|Carregar mais|Mostrar mais|Ver mais", maxClicks, waitMs, extractMode, &pagesVisited)
    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

ExtractWorkdayLocation(chromeHwnd, spec, maxClicks, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    locBtn := ClickFirstControlByName(chromeHwnd, "Button|MenuItem", "Local", "Location")
    LogStep("WORKDAY_LOC Local clicked=" locBtn)
    if (locBtn) {
        HumanSleep(1200, 1800)
        docEl := WaitDocumentElement(chromeHwnd, 4000)
        matched := false
        if (spec != "") {
            for term in StrSplit(spec, "|") {
                t := Trim(term)
                if (t != "" && ToggleOrClickCheckbox(chromeHwnd, t)) {
                    LogStep("WORKDAY_LOC checked=[" t "]")
                    matched := true
                    break
                }
            }
        }
        if (!matched && docEl) {
            edits := FindAllMatchingControls(docEl, "Edit", "")
            for ed in edits {
                edName := ""
                try edName := ed.Name
                if (InStr(edName, "Pesquisar cargos") || InStr(edName, "Search for jobs"))
                    continue
                if (ClickUiaElement(chromeHwnd, ed)) {
                    HumanSleep(250, 450)
                    A_Clipboard := StrSplit(spec, "|")[1]
                    Send("^a^v")
                    HumanSleep(1200, 1800)
                    for term in StrSplit(spec, "|") {
                        t := Trim(term)
                        if (t != "" && ToggleOrClickCheckbox(chromeHwnd, t)) {
                            LogStep("WORKDAY_LOC searched+checked=[" t "]")
                            matched := true
                            break
                        }
                    }
                    if (matched)
                        break
                }
            }
        }
        if (!matched && docEl) {
            cbs := FindAllMatchingControls(docEl, "CheckBox", "")
            cbLog := ""
            for cb in cbs {
                if (A_Index > 15)
                    break
                try cbLog .= cb.Name " | "
            }
            LogStep("WORKDAY_LOC unmatched; sample CBs=" cbLog)
        }
        if (matched) {
            HumanSleep(600, 1100)
            vjOk := ClickFirstControlByName(chromeHwnd, "Button", "Visualizar|View Jobs|Exibir|Aplicar|Apply")
            LogStep("WORKDAY_LOC ViewJobs clicked=" vjOk)
            HumanSleep(Max(3500, waitMs), Max(5000, waitMs + 1500))
        }
    }
    collected := CollectPaginatedPages(chromeHwnd, "Button", "next|Próxima", maxClicks, waitMs, extractMode, &pagesVisited)
    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

SelectInhireDropdown(chromeHwnd, idx, optionText) {
    docEl := WaitDocumentElement(chromeHwnd, 4000)
    if (!docEl)
        return false
    cands := FindAllMatchingControls(docEl, "ComboBox|Button|Text", "Escolha uma opção")
    LogStep("INHIRE dropdown idx=" idx " cands=" cands.Length)
    if (cands.Length < idx)
        return false
    targetBox := cands[idx]
    boxPos := ""
    try boxPos := targetBox.GetPos("screen")
    if (!ClickUiaElement(chromeHwnd, targetBox))
        return false
    HumanSleep(600, 1000)
    doc2 := WaitDocumentElement(chromeHwnd, 2000)
    if (doc2) {
        opts := []
        try opts := doc2.FindElements({Name: optionText, matchmode: "Substring"})
        LogStep("INHIRE opts for [" optionText "] count=" opts.Length)
        for opt in opts {
            nm := ""
            ep := ""
            tp := ""
            try nm := Trim(opt.Name)
            try tp := opt.LocalizedType
            try ep := opt.GetPos("screen")
            if (nm = "" || InStr(nm, "[") || StrLen(nm) > 35)
                continue
            if (IsObject(boxPos) && IsObject(ep)) {
                if (ep.w <= 0 || ep.h <= 0 || ep.y <= boxPos.y || ep.y > boxPos.y + 400 || Abs(ep.x - boxPos.x) > 300)
                    continue
            }
            LogStep("INHIRE clicking opt Type=[" tp "] Name=[" nm "]")
            if (ClickUiaElement(chromeHwnd, opt))
                return true
        }
    }
    WinActivate("ahk_id " chromeHwnd)
    SendText(optionText)
    HumanSleep(600, 900)
    Send("{Enter}")
    LogStep("INHIRE option typed=[" optionText "]")
    return true
}

ExtractInhireDual(chromeHwnd, url, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    collected := ""

    ; Method 1: Modelo de Atuacao -> Remoto
    LogStep("INHIRE METHOD 1: Modelo de Atuacao -> Remoto")
    HumanSleep(1200, 1800)
    m1Ok := SelectInhireDropdown(chromeHwnd, 1, "Remoto")
    LogStep("INHIRE M1 Remoto ok=" m1Ok)
    HumanSleep(Max(1800, waitMs), Max(2600, waitMs + 700))
    ScrollToBottomPasses(chromeHwnd, 2, 500)
    t1 := CopyDocumentText(chromeHwnd, extractMode)
    if (t1 != "") {
        collected .= "=== METHOD 1 (REMOTO) ===`r`n" t1 "`r`n"
        pagesVisited += 1
    }

    ; Method 2: Refresh -> Localizacao -> Campinas
    HumanSleep(1200, 2000)
    LogStep("INHIRE METHOD 2: Refresh -> Localizacao -> Campinas")
    RefreshChromeUrl(chromeHwnd, url, waitMs)
    m2Ok := SelectInhireDropdown(chromeHwnd, 2, "Campinas")
    LogStep("INHIRE M2 Campinas ok=" m2Ok)
    HumanSleep(Max(1800, waitMs), Max(2600, waitMs + 700))
    ScrollToBottomPasses(chromeHwnd, 2, 500)
    t2 := CopyDocumentText(chromeHwnd, extractMode)
    if (t2 != "") {
        collected .= "=== METHOD 2 (CAMPINAS) ===`r`n" t2 "`r`n"
        pagesVisited += 1
    }

    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

ExtractCiandtDual(chromeHwnd, url, waitMs, extractMode, &pagesVisited) {
    pagesVisited := 0
    collected := ""

    ; Dismiss notice banner & cookie popup if present
    HumanSleep(1500, 2200)
    ClickFirstControlByName(chromeHwnd, "Button", "OK")
    HumanSleep(300, 500)
    DismissCiandtCookiePopup(chromeHwnd)
    HumanSleep(300, 500)

    ; Method 1: Workplace type -> Remote
    LogStep("CIANDT METHOD 1: Workplace type -> Remote")
    remOk := ClickExactFilterLabel(chromeHwnd, "Remote")
    LogStep("CIANDT M1 Remote checked=" remOk)
    HumanSleep(Max(2000, waitMs), Max(3200, waitMs + 1000))
    ScrollToBottomPasses(chromeHwnd, 3, 500)
    m1Text := CopyDocumentText(chromeHwnd, extractMode)
    if (m1Text != "") {
        collected .= "=== METHOD 1 (REMOTE) ===`r`n" m1Text "`r`n`r`n"
        pagesVisited += 1
    }

    ; Method 2: Refresh -> Local -> Campinas, SP
    HumanSleep(1200, 2200)
    LogStep("CIANDT METHOD 2: Refresh -> Local -> Campinas, SP")
    RefreshChromeUrl(chromeHwnd, url, waitMs)
    ClickFirstControlByName(chromeHwnd, "Button", "OK")
    HumanSleep(300, 500)
    DismissCiandtCookiePopup(chromeHwnd)
    HumanSleep(300, 500)
    campOk := ClickExactFilterLabel(chromeHwnd, "Campinas, SP")
    LogStep("CIANDT M2 Campinas checked=" campOk)
    HumanSleep(Max(2000, waitMs), Max(3200, waitMs + 1000))
    ScrollToBottomPasses(chromeHwnd, 2, 500)
    m2Text := CopyDocumentText(chromeHwnd, extractMode)
    if (m2Text != "") {
        collected .= "=== METHOD 2 (LOCAL: CAMPINAS, SP) ===`r`n" m2Text "`r`n`r`n"
        pagesVisited += 1
    }

    if (pagesVisited < 1)
        pagesVisited := 1
    return collected
}

DismissCiandtCookiePopup(chromeHwnd) {
    docEl := WaitDocumentElement(chromeHwnd, 3000)
    if (!docEl)
        return false
    try {
        popup := docEl.FindFirst({AutomationId: "sliding-popup"})
        if (IsObject(popup)) {
            btns := popup.FindElements({Type: "Button"})
            LogStep("CIANDT cookie popup btns=" btns.Length)
            if (btns.Length > 0)
                return ClickUiaElement(chromeHwnd, btns[1])
        }
    }
    return false
}

ClickExactFilterLabel(chromeHwnd, exactName) {
    docEl := WaitDocumentElement(chromeHwnd, 5000)
    if (!docEl)
        return false
    docPos := ""
    try docPos := docEl.GetPos("screen")
    els := []
    try els := docEl.FindElements({Type: "Text", Name: exactName, matchmode: "Substring"})
    for el in els {
        nm := ""
        try nm := Trim(el.Name)
        if (StrLower(nm) = StrLower(exactName)) {
            WinActivate("ahk_id " chromeHwnd)
            try el.ScrollIntoView()
            HumanSleep(300, 500)
            p := ""
            try p := el.GetPos("screen")
            if (IsObject(docPos) && IsObject(p)) {
                LogStep("FILTER PRE [" exactName "] doc=" docPos.x "," docPos.y "," docPos.w "x" docPos.h " el=" p.x "," p.y)
                if (p.y < docPos.y + 240) {
                    Send("{WheelUp 4}")
                    HumanSleep(250, 400)
                    try p := el.GetPos("screen")
                } else if (p.y > docPos.y + docPos.h - 100) {
                    Send("{WheelDown 4}")
                    HumanSleep(250, 400)
                    try p := el.GetPos("screen")
                }
            }
            if (IsObject(p) && p.w > 0 && p.h > 0) {
                clickX := p.x + p.w // 2
                clickY := p.y + p.h // 2
                WinActivate("ahk_id " chromeHwnd)
                WinWaitActive("ahk_id " chromeHwnd, , 2)
                DllCall("SetCursorPos", "Int", clickX, "Int", clickY)
                Sleep 100
                hitNm := "", hitTp := ""
                try {
                    hit := UIA.ElementFromPoint(clickX, clickY)
                    hitNm := Trim(hit.Name)
                    hitTp := hit.LocalizedType
                }
                mx := 0, my := 0
                CoordMode("Mouse", "Screen")
                MouseGetPos(&mx, &my)
                Click()
                HumanSleep(400, 700)
                LogStep("FILTER SETCURSORPOS [" exactName "] target=" clickX "," clickY " actual=" mx "," my " hit=[" hitTp ":" hitNm "]")
                return true
            }
            return ClickUiaElement(chromeHwnd, el)
        }
    }
    return false
}

ExtractSuccessFactorsLocation(chromeHwnd, locName, waitMs, extractMode) {
    targetLoc := locName != "" ? locName : "campinas"
    LogStep("SUCCESSFACTORS: filtering location=[" targetLoc "]")
    HumanSleep(800, 1300)
    docEl := WaitDocumentElement(chromeHwnd, 5000)
    if (docEl) {
        edits := []
        try edits := docEl.FindElements({Type: "Edit"})
        LogStep("SUCCESSFACTORS Edit count=" edits.Length)
        targetEl := ""
        for idx, el in edits {
            nm := "", aid := ""
            try nm := Trim(el.Name)
            try aid := Trim(el.AutomationId)
            LogStep("SUCCESSFACTORS Edit " idx " Name=[" nm "] Aid=[" aid "]")
            low := StrLower(nm " " aid)
            if (InStr(low, "localiza") || InStr(low, "location")) {
                targetEl := el
                break
            }
        }
        if (IsObject(targetEl) && ClickUiaElement(chromeHwnd, targetEl)) {
            HumanSleep(200, 400)
            Send("^a")
            HumanSleep(100, 200)
            SendText(targetLoc)
            HumanSleep(250, 450)
            Send("{Enter}")
            LogStep("SUCCESSFACTORS entered [" targetLoc "]")
            HumanSleep(Max(2000, waitMs), Max(3200, waitMs + 800))
        }
    }
    ScrollToBottomPasses(chromeHwnd, 3, 500)
    return CopyDocumentText(chromeHwnd, extractMode)
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
