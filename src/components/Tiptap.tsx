'use client'

import { Node } from '@tiptap/core'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import GapCursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaChevronUp,
  FaCode,
  FaHighlighter,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaRedo,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaUnderline,
  FaUndo,
  FaYoutube,
} from 'react-icons/fa'
import { SiFramer } from 'react-icons/si'

interface TextEditorProps {
  onChange: (content: string) => void
  content?: string
  className?: string
}

const limit = 20000

// MARK: Customer Nodes
const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'mt-4 mb-2',
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    // Apply custom classes based on the heading level
    const level = node.attrs.level
    let customClass = ''
    switch (level) {
      case 1:
        customClass += 'text-4xl font-bold'
        break
      case 2:
        customClass += 'text-3xl font-semibold'
        break
      case 3:
        customClass += 'text-2xl font-semibold'
        break
      case 4:
        customClass += 'text-xl font-semibold'
        break
      case 5:
        customClass += 'text-lg font-semibold'
        break
      case 6:
        customClass += 'text-base font-semibold'
        break
    }

    return [`h${node.attrs.level}`, { ...HTMLAttributes, class: customClass }, 0]
  },
})

const CustomImage = Image.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'rounded-lg shadow-md',
      },
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 'auto',
        parseHTML: element => element.getAttribute('width') || 'auto',
        renderHTML: attributes => {
          if (attributes.width) {
            return { width: attributes.width }
          }
          return {}
        },
      },
      height: {
        default: 'auto',
        parseHTML: element => element.getAttribute('height') || 'auto',
        renderHTML: attributes => {
          if (attributes.height) {
            return { height: attributes.height }
          }
          return {}
        },
      },
      align: {
        default: 'left',
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const { align } = node.attrs
    let customClass = 'rounded-lg shadow-md'

    if (align === 'left') {
      customClass += ' mr-auto'
    } else if (align === 'right') {
      customClass += ' ml-auto'
    } else if (align === 'center') {
      customClass += ' mx-auto'
    }

    return ['img', { ...HTMLAttributes, class: customClass }]
  },
})

export interface IframeOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: any
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string }) => ReturnType
    }
  }
}

const Iframe = Node.create<IframeOptions>({
  name: 'iframe',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      allowFullscreen: false,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400px',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string; width?: string; height?: string }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = this.type.create({
            src: options.src,
            width: options.width || '100%',
            height: options.height || '400px',
          })

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },
})

const TextEditor = ({ content = '', onChange, className = '' }: TextEditorProps) => {
  const [openTableControls, setOpenTableControls] = useState<boolean>(false)
  const [youtubeWidth, setYoutubeWidth] = useState<string>('640px')
  const [youtubeHeight, setYoutubeHeight] = useState<string>('480px')
  const [imageWidth, setImageWidth] = useState<string>('640px')
  const [imageHeight, setImageHeight] = useState<string>('480px')
  const [iframeWidth, setIframeWidth] = useState<string>('400px')
  const [iframeHeight, setIframeHeight] = useState<string>('500px')

  // MARK: Marks
  const marks = [
    Bold,
    Italic,
    Underline,
    Strike,
    Code.configure({
      HTMLAttributes: {
        class: 'text-[0.85rem] px-[0.3em] py-[0.25em] bg-[#333] text-white rounded-md',
      },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        class: 'text-sky-500 underline underline-offset-1',
      },
    }),
    Subscript,
    Superscript,
    Highlight.configure({ multicolor: true }),
    CharacterCount.configure({
      limit,
    }),
    TextStyle,
    Color,
  ]

  // MARK: Headings
  const headings = [CustomHeading]

  // MARK: Nodes
  const nodes = [
    Blockquote.configure({
      HTMLAttributes: {
        class: 'border-l-[3px] border-slate-300 pl-4',
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: 'list-disc px-[1rem] mr-[1rem] ml-[0.4rem]',
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: 'list-decimal px-[1rem] mr-[1rem] ml-[0.4rem]',
      },
    }),
    ListItem.configure({
      HTMLAttributes: {
        class: 'my-[0.25em]',
      },
    }),
    HorizontalRule.configure({
      HTMLAttributes: {
        class: 'my-8 border-t border-slate-200',
      },
    }),
    CustomImage,
    Youtube.configure({
      controls: true,
      nocookie: true,
      HTMLAttributes: {
        class: 'aspect-video rounded-lg shadow-md',
      },
    }),
    Iframe.configure({
      HTMLAttributes: {
        class: 'no-scrollbar flex items-center overflow-hidden',
      },
    }),
  ]

  // MARK: Tables
  const tables = [
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ]

  // MARK: Alignments
  const alignments = [
    TextAlign.configure({
      types: ['heading', 'paragraph', 'youtube'],
    }),
  ]

  // MARK: Editor
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      ...marks,
      ...headings,
      ...nodes,
      ...alignments,
      History,
      GapCursor,
      ...tables,
      HardBreak,
    ],
    editorProps: {
      attributes: {
        class:
          'outline-none border border-dark rounded-lg shadow-lg px-4 py-3 bg-white overflow-hidden min-h-[300px]',
      },
    },
    content,

    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // Link
  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  // Image
  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (!imageWidth.endsWith('px') && !imageWidth.endsWith('%')) {
      toast.error('Width must be in pixels or percentage')
      return
    }

    if (!imageHeight.endsWith('px')) {
      toast.error('Height must be in pixels')
      return
    }

    if (url?.trim()) {
      if (!editor) return

      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
        } as any)
        .run()
    }
  }, [editor, imageWidth, imageHeight])

  // Youtube
  const addYoutubeVideo = useCallback(() => {
    if (!editor) return
    const url = prompt('Enter YouTube URL')

    if (!youtubeWidth.endsWith('px') && !youtubeWidth.endsWith('%')) {
      toast.error('Width must be in pixels or percentage')
      return
    }

    if (!youtubeHeight.endsWith('px')) {
      toast.error('Height must be in pixels')
      return
    }

    if (url?.trim()) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: youtubeWidth,
        height: youtubeHeight,
      } as any)
    }
  }, [editor, youtubeHeight, youtubeWidth])

  // Iframe
  const addIframe = useCallback(() => {
    if (!editor) return

    if (!iframeWidth.endsWith('px') && !iframeWidth.endsWith('%')) {
      toast.error('Width must be in pixels or percentage')
      return
    }

    if (!iframeHeight.endsWith('px')) {
      toast.error('Height must be in pixels')
      return
    }

    const url = prompt('Enter URL')

    if (url?.trim()) {
      editor.commands.setIframe({
        src: url,
        width: iframeWidth,
        height: iframeHeight,
      } as any)
    }
  }, [editor, iframeWidth, iframeHeight])

  if (!editor) {
    return null
  }

  const percentage = editor ? Math.round((100 / limit) * editor.storage.characterCount.characters()) : 0

  return (
    <div className={`${className}`}>
      <div className="mb-5 flex select-none flex-col gap-2">
        {/* Marks & Headings */}
        <div className="flex justify-between gap-4">
          {/* Marks */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {/* Bold */}
            <button
              onClick={() => editor.commands.toggleBold()}
              className={`${
                editor.isActive('bold') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Bold"
            >
              <FaBold />
            </button>

            {/* Italic */}
            <button
              onClick={() => editor.commands.toggleItalic()}
              className={`${
                editor.isActive('italic') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Italic"
            >
              <FaItalic />
            </button>

            {/* Underline */}
            <button
              onClick={() => editor.commands.toggleUnderline()}
              className={`${
                editor.isActive('underline') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Underline"
            >
              <FaUnderline />
            </button>

            {/* Strike */}
            <button
              onClick={() => editor.commands.toggleStrike()}
              className={`${
                editor.isActive('strike') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Strike"
            >
              <FaStrikethrough />
            </button>

            {/* Code */}
            <button
              onClick={() => editor.commands.toggleCode()}
              className={`${
                editor.isActive('code') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Code"
            >
              <FaCode />
            </button>

            {/* Link */}
            <button
              onClick={setLink}
              className={`${
                editor.isActive('link') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Link"
            >
              <FaLink />
            </button>

            {/* Subscript */}
            <button
              onClick={() => editor.commands.toggleSubscript()}
              className={`${
                editor.isActive('subscript') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Subscript"
            >
              <FaSubscript />
            </button>

            {/* Superscript */}
            <button
              onClick={() => editor.commands.toggleSuperscript()}
              className={`${
                editor.isActive('superscript') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Superscript"
            >
              <FaSuperscript />
            </button>

            {/* Highlight */}
            <button
              onClick={() => editor.commands.toggleHighlight()}
              className={`${
                editor.isActive('highlight') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Highlight"
            >
              <FaHighlighter />
            </button>

            {/* Hard Break */}
            <button
              onClick={() => editor.commands.setHardBreak()}
              className={`${
                editor.isActive('highlight') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Hard Break"
            >
              <span className="font-semibold">Br</span>
            </button>

            {/* Color */}
            <input
              type="color"
              className="h-[32px] cursor-pointer rounded-md border border-dark bg-transparent p-1.5 shadow-lg"
              onInput={(e: any) => editor.commands.setColor(e.target.value)}
              value={editor.getAttributes('textStyle').color}
              title="Color"
            />
          </div>

          {/* Headings */}
          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
            {Array.from({ length: 6 }, (_, index) => (
              <button
                onClick={() => editor.commands.toggleHeading({ level: (index + 1) as any })}
                className={`${
                  editor.isActive('heading', { level: index + 1 })
                    ? 'bg-dark-100 font-semibold text-white'
                    : ''
                } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
                title={`Heading ${index + 1}`}
                key={index}
              >
                H{index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Nodes & Alignments */}
        <div className="flex justify-between gap-4">
          {/* Nodes */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {/* Block Quote */}
            <button
              onClick={() => editor.commands.toggleBlockquote()}
              className={`${
                editor.isActive('blockquote') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Block Quote"
            >
              <FaQuoteRight />
            </button>

            {/* Bullet List */}
            <button
              onClick={() => editor.commands.toggleBulletList()}
              className={`${
                editor.isActive('bulletList') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Bullet List"
            >
              <FaListUl />
            </button>

            {/* Order List */}
            <button
              onClick={() => editor.commands.toggleOrderedList()}
              className={`${
                editor.isActive('orderedList') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Order List"
            >
              <FaListOl />
            </button>

            {/* Horizontal Rule */}
            <button
              onClick={() => editor.commands.setHorizontalRule()}
              className={`flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Horizontal Rule"
            >
              ---
            </button>

            {/* Image */}
            <div
              className={`flex h-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Youtube"
            >
              <button
                className="px-2"
                onClick={addImage}
              >
                <FaImage />
              </button>
              <input
                id="width"
                type="text"
                className="h-full w-[52px] rounded-sm border-l-2 border-dark bg-transparent px-1.5 text-xs font-semibold outline-none"
                value={imageWidth}
                onChange={(e: any) => setImageWidth(e.target.value)}
              />
              <input
                id="width"
                type="text"
                className="h-full w-[52px] rounded-sm border-l-2 border-dark bg-transparent px-1.5 text-xs font-semibold outline-none"
                value={imageHeight}
                onChange={(e: any) => setImageHeight(e.target.value)}
              />
            </div>

            {/* Youtube */}
            <div
              className={`flex h-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Youtube"
            >
              <button
                className="px-2"
                onClick={addYoutubeVideo}
              >
                <FaYoutube />
              </button>
              <input
                id="width"
                type="text"
                className="h-full w-[52px] rounded-sm border-l-2 border-dark bg-transparent px-1.5 text-xs font-semibold outline-none"
                value={youtubeWidth}
                onChange={(e: any) => setYoutubeWidth(e.target.value)}
              />
              <input
                id="width"
                type="text"
                className="h-full w-[52px] rounded-sm border-l-2 border-dark bg-transparent px-1.5 text-xs font-semibold outline-none"
                value={youtubeHeight}
                onChange={(e: any) => setYoutubeHeight(e.target.value)}
              />
            </div>

            {/* Iframe */}
            <div
              className={`flex h-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Iframe"
            >
              <button
                className="px-2"
                onClick={addIframe}
              >
                <SiFramer />
              </button>

              <input
                id="width"
                type="text"
                className="h-full w-[52px] rounded-sm border-l-2 border-dark bg-transparent px-1.5 text-xs font-semibold outline-none"
                value={iframeWidth}
                onChange={(e: any) => setIframeWidth(e.target.value)}
              />
              <input
                id="width"
                type="text"
                className="h-full w-[52px] rounded-sm border-l-2 border-dark bg-transparent px-1.5 text-xs font-semibold outline-none"
                value={iframeHeight}
                onChange={(e: any) => setIframeHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Alignment */}
          <div className="flex flex-wrap justify-end gap-x-2 gap-y-1">
            {/* Left */}
            <button
              onClick={() => editor.commands.setTextAlign('left')}
              className={`${
                editor.isActive('left') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Left"
            >
              <FaAlignLeft />
            </button>

            {/* Center */}
            <button
              onClick={() => editor.commands.setTextAlign('center')}
              className={`${
                editor.isActive('center') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Center"
            >
              <FaAlignCenter />
            </button>

            {/* Right */}
            <button
              onClick={() => editor.commands.setTextAlign('right')}
              className={`${
                editor.isActive('right') ? 'bg-dark-100 text-white' : ''
              } flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md`}
              title="Right"
            >
              <FaAlignRight />
            </button>

            {/* Justify */}
            <button
              onClick={() => editor.commands.setTextAlign('justify')}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md"
              title="Justify"
            >
              <FaAlignJustify />
            </button>

            {/* Undo */}
            <button
              onClick={() => editor.commands.undo()}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md"
              title="Undo"
            >
              <FaUndo />
            </button>

            {/* Redo */}
            <button
              onClick={() => editor.commands.redo()}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-dark shadow-md"
              title="Redo"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-dark shadow-lg">
          <button
            className={`trans-200 group flex w-full items-center justify-center rounded-b-lg border-b px-3 py-3 delay-300 ${
              openTableControls ? 'border-dark' : 'border-transparent'
            }`}
            onClick={() => setOpenTableControls(prev => !prev)}
          >
            <FaChevronUp className={`${openTableControls ? 'rotate-180' : ''} trans-200`} />
          </button>

          {/* Insert Table */}
          <div
            className={`${
              openTableControls ? 'max-h-[200px] overflow-y-auto py-2' : 'max-h-0 overflow-hidden py-0'
            } trans-300 flex flex-wrap items-center gap-x-2 gap-y-1 px-2`}
          >
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })}
            >
              Insert table
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.addColumnBefore()}
            >
              Add column before
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.addColumnAfter()}
            >
              Add column after
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.deleteColumn()}
            >
              Delete column
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.addRowBefore()}
            >
              Add row before
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.addRowAfter()}
            >
              Add row after
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.deleteRow()}
            >
              Delete row
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.deleteTable()}
            >
              Delete table
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.mergeCells()}
            >
              Merge cells
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.splitCell()}
            >
              Split cell
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.toggleHeaderColumn()}
            >
              Toggle header column
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.toggleHeaderRow()}
            >
              Toggle header row
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.toggleHeaderCell()}
            >
              Toggle header cell
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.mergeOrSplit()}
            >
              Merge or split
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.setCellAttribute('colspan', 2)}
            >
              Set cell attribute
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.fixTables()}
            >
              Fix tables
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.goToNextCell()}
            >
              Go to next cell
            </button>
            <button
              className="flex h-[32px] items-center justify-center rounded-md border border-dark px-1.5 text-xs font-semibold shadow-md"
              onClick={() => editor.commands.goToPreviousCell()}
            >
              Go to previous cell
            </button>
          </div>
        </div>
      </div>

      <EditorContent editor={editor} />

      <div
        className={`mt-2 flex items-center justify-end gap-2 text-xs ${
          editor.storage.characterCount.characters() >= limit ? 'text-yellow-500' : ''
        }`}
      >
        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
        >
          <circle
            r="10"
            cx="10"
            cy="10"
            fill="#e9ecef"
          />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle
            r="6"
            cx="10"
            cy="10"
            fill="white"
          />
        </svg>
        {editor.storage.characterCount.characters()} / {limit} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </div>
  )
}

export default memo(TextEditor)
