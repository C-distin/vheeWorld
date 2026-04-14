"use client"

import { $createCodeNode, $isCodeNode } from "@lexical/code"
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, type HeadingTagType } from "@lexical/rich-text"
import { $patchStyleText, $setBlocksType } from "@lexical/selection"
import { $getNearestNodeOfType } from "@lexical/utils"
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconChevronDown,
  IconClearFormatting,
  IconCode,
  IconHighlight,
  IconIndentDecrease,
  IconIndentIncrease,
  IconLink,
  IconMessage,
  IconMinus,
  IconPlus,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
} from "@tabler/icons-react"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  type ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { useCallback, useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ── Types ──────────────────────────────────────────────────────────────────
type BlockType = "paragraph" | "h1" | "h2" | "h3" | "bullet" | "number" | "check" | "quote" | "code"

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  number: "Numbered List",
  bullet: "Bullet List",
  check: "Check List",
  quote: "Quote",
  code: "Code Block",
}

const BLOCK_SHORTCUTS: Record<BlockType, string> = {
  paragraph: "Ctrl+Alt+0",
  h1: "Ctrl+Alt+1",
  h2: "Ctrl+Alt+2",
  h3: "Ctrl+Alt+3",
  number: "Ctrl+Shift+7",
  bullet: "Ctrl+Shift+8",
  check: "Ctrl+Shift+9",
  quote: "Ctrl+Shift+Q",
  code: "Ctrl+Alt+C",
}

const FONT_FAMILIES = ["Arial", "Courier New", "Georgia", "Times New Roman", "Trebuchet MS", "Verdana"]

const ALIGN_OPTIONS: { label: string; value: ElementFormatType; shortcut: string }[] = [
  { label: "Left Align", value: "left", shortcut: "Ctrl+Shift+L" },
  { label: "Center Align", value: "center", shortcut: "Ctrl+Shift+E" },
  { label: "Right Align", value: "right", shortcut: "Ctrl+Shift+R" },
  { label: "Justify Align", value: "justify", shortcut: "Ctrl+Shift+J" },
  { label: "Start Align", value: "start", shortcut: "" },
  { label: "End Align", value: "end", shortcut: "" },
]

const INSERT_ITEMS = [
  "Horizontal Rule",
  "Page Break",
  "Image",
  "GIF",
  "Excalidraw",
  "Table",
  "Poll",
  "Columns Layout",
  "Equation",
  "Sticky Note",
  "Collapsible container",
  "Date",
  "X(Tweet)",
  "Youtube Video",
  "Figma Document",
]

// ── Toolbar button ─────────────────────────────────────────────────────────
function Btn({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick?: () => void
  active?: boolean
  title?: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center h-8 min-w-8 px-1.5 rounded-md text-sm transition-colors ${
        active ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } disabled:opacity-40 disabled:pointer-events-none`}>
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
}

// ── Toolbar ────────────────────────────────────────────────────────────────
export function AdvancedToolbar() {
  const [editor] = useLexicalComposerContext()

  const [blockType, setBlockType] = useState<BlockType>("paragraph")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontSize, setFontSize] = useState(15)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isSubscript, setIsSubscript] = useState(false)
  const [isSuperscript, setIsSuperscript] = useState(false)
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left")
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // ── Sync toolbar state with editor selection ───────────────────────────
  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return

    setIsBold(selection.hasFormat("bold"))
    setIsItalic(selection.hasFormat("italic"))
    setIsUnderline(selection.hasFormat("underline"))
    setIsCode(selection.hasFormat("code"))
    setIsStrikethrough(selection.hasFormat("strikethrough"))
    setIsSubscript(selection.hasFormat("subscript"))
    setIsSuperscript(selection.hasFormat("superscript"))

    const anchorNode = selection.anchor.getNode()
    const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()

    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
      const type = parentList ? parentList.getListType() : element.getListType()
      setBlockType(type === "bullet" ? "bullet" : type === "check" ? "check" : "number")
    } else if ($isHeadingNode(element)) {
      setBlockType(element.getTag() as BlockType)
    } else if ($isCodeNode(element)) {
      setBlockType("code")
    } else {
      setBlockType("paragraph")
    }

    setElementFormat((element as any).getFormatType?.() ?? "left")
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(updateToolbar)
    })
  }, [editor, updateToolbar])

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload)
        return false
      },
      1
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload)
        return false
      },
      1
    )
  }, [editor])

  // ── Actions ───────────────────────────────────────────────────────────
  const setBlock = (type: BlockType) => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      switch (type) {
        case "paragraph":
          $setBlocksType(selection, () => $createParagraphNode())
          break
        case "h1":
        case "h2":
        case "h3":
          $setBlocksType(selection, () => $createHeadingNode(type as HeadingTagType))
          break
        case "quote":
          $setBlocksType(selection, () => $createQuoteNode())
          break
        case "code":
          $setBlocksType(selection, () => $createCodeNode())
          break
        case "bullet":
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          break
        case "number":
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          break
        case "check":
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
          break
      }
    })
  }

  const applyFontSize = (size: number) => {
    const clamped = Math.max(8, Math.min(72, size))
    setFontSize(clamped)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": `${clamped}px` })
      }
    })
  }

  const applyFontFamily = (font: string) => {
    setFontFamily(font)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-family": font })
      }
    })
  }

  const formatAlign = (align: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)
    setElementFormat(align)
  }

  const currentAlignLabel = ALIGN_OPTIONS.find((a) => a.value === elementFormat)?.label ?? "Left Align"

  const AlignIcon =
    elementFormat === "center"
      ? IconAlignCenter
      : elementFormat === "right"
        ? IconAlignRight
        : elementFormat === "justify"
          ? IconAlignJustified
          : IconAlignLeft

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-white flex-wrap">
      {/* Undo / Redo */}
      <Btn title="Undo" disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <IconArrowBackUp size={16} />
      </Btn>
      <Btn title="Redo" disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <IconArrowForwardUp size={16} />
      </Btn>

      <Divider />

      {/* Block type */}
      <DropdownMenu>
        <DropdownMenuTrigger aschild>
          <button
            type="button"
            className="flex items-center gap-1.5 h-8 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <span className="text-xs font-bold text-gray-400 w-5">
              {blockType === "h1" ? "H1" : blockType === "h2" ? "H2" : blockType === "h3" ? "H3" : "¶"}
            </span>
            <span className="min-w-[80px] text-left text-sm">{BLOCK_LABELS[blockType]}</span>
            <IconChevronDown size={13} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {(Object.entries(BLOCK_LABELS) as [BlockType, string][]).map(([type, label]) => (
            <DropdownMenuItem
              key={type}
              onClick={() => setBlock(type)}
              className={blockType === type ? "bg-gray-100" : ""}>
              <span className="w-7 text-xs font-bold text-gray-400">
                {type === "h1" ? "H1" : type === "h2" ? "H2" : type === "h3" ? "H3" : ""}
              </span>
              {label}
              <DropdownMenuShortcut>{BLOCK_SHORTCUTS[type]}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Font family */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 h-8 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <span className="text-xs font-bold text-gray-400">T</span>
            <span className="min-w-[72px] text-left text-sm">{fontFamily}</span>
            <IconChevronDown size={13} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {FONT_FAMILIES.map((font) => (
            <DropdownMenuItem
              key={font}
              onClick={() => applyFontFamily(font)}
              className={fontFamily === font ? "bg-gray-100" : ""}
              style={{ fontFamily: font }}>
              {font}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Font size */}
      <div className="flex items-center gap-0.5">
        <Btn title="Decrease font size" onClick={() => applyFontSize(fontSize - 1)}>
          <IconMinus size={13} />
        </Btn>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => applyFontSize(Number(e.target.value))}
          className="w-10 h-8 text-center border border-gray-200 rounded-md text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-400"
        />
        <Btn title="Increase font size" onClick={() => applyFontSize(fontSize + 1)}>
          <IconPlus size={13} />
        </Btn>
      </div>

      <Divider />

      {/* Inline format */}
      <Btn title="Bold (Ctrl+B)" active={isBold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <span className="font-black text-sm">B</span>
      </Btn>
      <Btn
        title="Italic (Ctrl+I)"
        active={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <span className="italic font-semibold text-sm">i</span>
      </Btn>
      <Btn
        title="Underline (Ctrl+U)"
        active={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <span className="underline font-semibold text-sm">U</span>
      </Btn>
      <Btn title="Inline Code" active={isCode} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}>
        <IconCode size={15} />
      </Btn>
      <Btn title="Link">
        <IconLink size={15} />
      </Btn>

      <Divider />

      {/* Font color swatch */}
      <Btn title="Font Color">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-bold text-sm leading-none">A</span>
          <div className="w-4 h-1 rounded-sm bg-gray-900" />
        </div>
        <IconChevronDown size={11} className="text-gray-400 ml-0.5" />
      </Btn>

      {/* Highlight swatch */}
      <Btn title="Highlight">
        <div className="flex flex-col items-center gap-0.5">
          <IconHighlight size={14} />
          <div className="w-4 h-1 rounded-sm bg-yellow-300" />
        </div>
        <IconChevronDown size={11} className="text-gray-400 ml-0.5" />
      </Btn>

      <Divider />

      {/* Aa — extra formats */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-0.5 h-8 px-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <span className="font-semibold text-sm">Aa</span>
            <IconChevronDown size={13} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuItem onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase" as any)}>
            <span className="w-7 text-xs text-gray-400">abc</span>
            Lowercase
            <DropdownMenuShortcut>Ctrl+Shift+1</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase" as any)}>
            <span className="w-7 text-xs font-bold text-gray-400">ABC</span>
            Uppercase
            <DropdownMenuShortcut>Ctrl+Shift+2</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize" as any)}>
            <span className="w-7 text-xs text-gray-400">Tt</span>
            Capitalize
            <DropdownMenuShortcut>Ctrl+Shift+3</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            active={isStrikethrough}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}>
            <IconStrikethrough size={15} className="w-7 text-gray-400" />
            Strikethrough
            <DropdownMenuShortcut>Ctrl+Shift+X</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            active={isSubscript}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}>
            <IconSubscript size={15} className="w-7 text-gray-400" />
            Subscript
            <DropdownMenuShortcut>Ctrl+,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            active={isSuperscript}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")}>
            <IconSuperscript size={15} className="w-7 text-gray-400" />
            Superscript
            <DropdownMenuShortcut>Ctrl+.</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconHighlight size={15} className="w-7 text-gray-400" />
            Highlight
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconClearFormatting size={15} className="w-7 text-gray-400" />
            Clear Formatting
            <DropdownMenuShortcut>Ctrl+\</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Insert */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 h-8 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <IconPlus size={14} />
            <span>Insert</span>
            <IconChevronDown size={13} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {INSERT_ITEMS.map((item) => (
            <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Alignment */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 h-8 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <AlignIcon size={15} />
            <span>{currentAlignLabel}</span>
            <IconChevronDown size={13} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {ALIGN_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => formatAlign(opt.value)}
              className={elementFormat === opt.value ? "bg-gray-100" : ""}>
              {opt.label}
              {opt.shortcut && <DropdownMenuShortcut>{opt.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}>
            <IconIndentDecrease size={15} className="mr-2 text-gray-400" />
            Outdent
            <DropdownMenuShortcut>Ctrl+[</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}>
            <IconIndentIncrease size={15} className="mr-2 text-gray-400" />
            Indent
            <DropdownMenuShortcut>Ctrl+]</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Comment */}
      <Btn title="Add Comment">
        <IconMessage size={16} />
      </Btn>
    </div>
  )
}
