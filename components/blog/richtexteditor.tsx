"use client"

import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { TRANSFORMERS } from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { AdvancedToolbar } from "./toolbar"

// ── Theme ──────────────────────────────────────────────────────────────────
const theme = {
  heading: {
    h1: "text-3xl font-black text-gray-900 mb-3 mt-5",
    h2: "text-2xl font-bold text-gray-900 mb-2 mt-4",
    h3: "text-xl font-semibold text-gray-900 mb-2 mt-3",
  },
  paragraph: "mb-2 text-gray-700 leading-relaxed",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "font-mono bg-gray-100 text-purple-600 px-1.5 py-0.5 rounded text-sm",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
  },
  quote: "border-l-4 border-purple-400 pl-4 italic text-gray-500 my-3",
  list: {
    ul: "list-disc list-outside ml-6 my-2 space-y-1",
    ol: "list-decimal list-outside ml-6 my-2 space-y-1",
    listitem: "text-gray-700 pl-1",
    listitemChecked: "line-through text-gray-400",
    listitemUnchecked: "text-gray-700",
  },
  link: "text-purple-600 underline hover:text-purple-800 cursor-pointer",
  code: "block font-mono bg-gray-900 text-green-400 p-4 rounded-xl my-4 text-sm overflow-x-auto whitespace-pre",
  codeHighlight: {
    atrule: "text-purple-400",
    attr: "text-blue-400",
    boolean: "text-orange-400",
    builtin: "text-cyan-400",
    cdata: "text-gray-400",
    char: "text-green-300",
    class: "text-yellow-300",
    "class-name": "text-yellow-300",
    comment: "text-gray-500 italic",
    constant: "text-orange-300",
    deleted: "text-red-400",
    doctype: "text-gray-500",
    entity: "text-orange-300",
    function: "text-blue-300",
    important: "text-red-400 font-bold",
    inserted: "text-green-400",
    keyword: "text-purple-300",
    namespace: "text-gray-300",
    number: "text-orange-300",
    operator: "text-gray-300",
    prolog: "text-gray-500",
    property: "text-blue-300",
    punctuation: "text-gray-400",
    regex: "text-orange-300",
    selector: "text-green-300",
    string: "text-green-300",
    symbol: "text-orange-300",
    tag: "text-red-400",
    url: "text-blue-400 underline",
    variable: "text-orange-200",
  },
}

// ── Config ─────────────────────────────────────────────────────────────────
const editorConfig = {
  namespace: "CMS_EDITOR",
  theme,
  onError(error: Error) {
    console.error(error)
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, CodeNode, CodeHighlightNode],
}

// ── Component ──────────────────────────────────────────────────────────────
export function RichTextEditor({
  onChange,
  initialContent,
  placeholder = "Start writing...",
  minHeight = "320px",
}: {
  onChange?: (json: any) => void
  initialContent?: any
  placeholder?: string
  minHeight?: string
}) {
  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        editorState: initialContent ? JSON.stringify(initialContent) : undefined,
      }}>
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-purple-400/40 focus-within:border-purple-400 transition-all bg-white">
        {/* Toolbar */}
        <AdvancedToolbar />

        {/* Editor area — position relative needed for placeholder */}
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none px-5 py-4 text-sm text-gray-700 leading-relaxed"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-5 text-sm text-gray-300 pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100 bg-gray-50/60">
          <p className="text-[10px] text-gray-300">
            Supports <strong>**bold**</strong>, <em>*italic*</em>, # headings, and markdown shortcuts
          </p>
          <p className="text-[10px] text-gray-300 font-medium">Lexical</p>
        </div>

        {/* Plugins */}
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin
          onChange={(editorState) => {
            const json = editorState.toJSON()
            onChange?.(json)
          }}
        />
      </div>
    </LexicalComposer>
  )
}
