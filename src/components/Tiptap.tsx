'use client'

import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useState } from 'react'

import Bold from '@tiptap/extension-bold'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
// import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import {
  FaBold,
  FaHighlighter,
  FaItalic,
  FaLink,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaUnderline,
} from 'react-icons/fa'
import { FaCode } from 'react-icons/fa6'

interface TextEditorProps {
  onChange: (content: string) => void
  content?: string
  className?: string
}

const limit = 5000

const TextEditor = ({ content = '', onChange, className = '' }: TextEditorProps) => {
  const [isEditable, setIsEditable] = useState<boolean>(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
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
      Color,
      // FontFamily,
      Placeholder.configure({
        placeholder: 'Describe the course …',
      }),
    ],
    content,

    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

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

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable)
    }
  }, [isEditable, editor])

  if (!editor) {
    return null
  }

  const percentage = editor ? Math.round((100 / limit) * editor.storage.characterCount.characters()) : 0

  return (
    <div className={`${className}`}>
      <div className='mb-5'>
        <div className='flex items-center flex-wrap gap-x-2 gap-y-1'>
          {/* Font */}
          {/* <select
            className='border border-dark font-semibold p-1.5 rounded-md shadow-lg bg-transparent outline-none'
            onChange={e => editor.commands.setFontFamily(e.target.value)}
          >
            <option value='Inter' className='px-3 py-1 bg-dark-0 text-white'>
              Inter
            </option>
            <option value='Montserrat' className='px-3 py-1 bg-dark-0 text-white'>
              Montserrat
            </option>
            <option value='Source Sans Pro' className='px-3 py-1 bg-dark-0 text-white'>
              Source Sans Pro
            </option>
          </select> */}
          {/* Bold */}
          <button
            onClick={() => editor.commands.toggleBold()}
            className={`${
              editor.isActive('bold') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Bold'
          >
            <FaBold />
          </button>
          {/* Italic */}
          <button
            onClick={() => editor.commands.toggleItalic()}
            className={`${
              editor.isActive('italic') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Italic'
          >
            <FaItalic />
          </button>
          {/* Underline */}
          <button
            onClick={() => editor.commands.toggleUnderline()}
            className={`${
              editor.isActive('underline') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Underline'
          >
            <FaUnderline />
          </button>
          {/* Strike */}
          <button
            onClick={() => editor.commands.toggleStrike()}
            className={`${
              editor.isActive('strike') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Strike'
          >
            <FaStrikethrough />
          </button>
          {/* Code */}
          <button
            onClick={() => editor.commands.toggleCode()}
            className={`${
              editor.isActive('code') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Code'
          >
            <FaCode />
          </button>
          {/* Link */}
          <button
            onClick={setLink}
            className={`${
              editor.isActive('link') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Link'
          >
            <FaLink />
          </button>
          {/* Subscript */}
          <button
            onClick={() => editor.commands.toggleSubscript()}
            className={`${
              editor.isActive('subscript') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Subscript'
          >
            <FaSubscript />
          </button>
          {/* Superscript */}
          <button
            onClick={() => editor.commands.toggleSuperscript()}
            className={`${
              editor.isActive('superscript') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Superscript'
          >
            <FaSuperscript />
          </button>
          {/* Highlight */}
          <button
            onClick={() => editor.commands.toggleHighlight()}
            className={`${
              editor.isActive('superscript') ? 'bg-dark-100 text-white' : ''
            } border border-dark rounded-md shadow-md p-2`}
            title='Superscript'
          >
            <FaHighlighter />
          </button>
          {/* COlor */}
          <input
            type='color'
            className='rounded-md shadow-lg h-[33.6px] p-1.5 border border-dark bg-transparent'
            onInput={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle').color}
          />
        </div>
      </div>
      {/* Bubble Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className='rounded-3xl px-3 py-1.5 border border-dark bg-white shadow-lg flex items-center justify-center gap-1'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${
              editor.isActive('bold') ? 'bg-dark-0 text-white' : ''
            } font-semibold rounded-full p-1 text-dark`}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${
              editor.isActive('italic') ? 'bg-dark-0 text-white' : ''
            } font-semibold rounded-full p-1 text-dark`}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${
              editor.isActive('underline') ? 'bg-dark-0 text-white' : ''
            } font-semibold rounded-full p-1 text-dark`}
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${
              editor.isActive('strike') ? 'bg-dark-0 text-white' : ''
            } font-semibold rounded-full p-1 text-dark`}
          >
            <FaStrikethrough />
          </button>
          <button
            onClick={() => editor.chain().focus().setHighlight().run()}
            className={`${
              editor.isActive('highlight') ? 'bg-dark-0 text-white' : ''
            } font-semibold rounded-full p-1 text-dark`}
          >
            <FaHighlighter />
          </button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <div
        className={`flex items-center justify-end text-xs gap-2 mt-2 ${
          editor.storage.characterCount.characters() >= limit ? 'text-yellow-500' : ''
        }`}
      >
        <svg height='20' width='20' viewBox='0 0 20 20'>
          <circle r='10' cx='10' cy='10' fill='#e9ecef' />
          <circle
            r='5'
            cx='10'
            cy='10'
            fill='transparent'
            stroke='currentColor'
            strokeWidth='10'
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform='rotate(-90) translate(-20)'
          />
          <circle r='6' cx='10' cy='10' fill='white' />
        </svg>
        {editor.storage.characterCount.characters()} / {limit} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </div>
  )
}

export default TextEditor
