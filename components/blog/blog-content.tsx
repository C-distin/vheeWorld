"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { CodeNode, CodeHighlightNode } from "@lexical/code"
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

const theme = {
  heading: {
    h1: "text-3xl font-black text-gray-900 mb-4 mt-8",
    h2: "text-2xl font-bold text-gray-900 mb-3 mt-6",
    h3: "text-xl font-semibold text-gray-900 mb-2 mt-5",
  },
  paragraph: "text-gray-700 leading-relaxed mb-4 text-base",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "font-mono bg-gray-100 text-purple-600 px-1.5 py-0.5 rounded text-sm",
  },
  quote: "border-l-4 border-purple-400 pl-5 italic text-gray-500 my-6 text-lg",
  list: {
    ul: "list-disc list-outside ml-6 my-4 space-y-2",
    ol: "list-decimal list-outside ml-6 my-4 space-y-2",
    listitem: "text-gray-700 leading-relaxed",
  },
  link: "text-purple-600 underline hover:text-purple-800 cursor-pointer",
  code: "block font-mono bg-gray-900 text-green-400 p-5 rounded-xl my-6 text-sm overflow-x-auto",
}

function RestorePlugin({ content }: { content: Record<string, unknown> }) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    const state = editor.parseEditorState(JSON.stringify(content))
    editor.setEditorState(state)
  }, [editor, content])
  return null
}

export function BlogContent({ content }: { content: Record<string, unknown> }) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "BlogReader",
        theme,
        editable: false,
        onError: console.error,
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, CodeNode, CodeHighlightNode],
      }}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none prose-custom" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <RestorePlugin content={content} />
    </LexicalComposer>
  )
}
