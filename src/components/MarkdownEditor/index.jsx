'use client';

import { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

export default function MarkdownEditor({ value, onChange }) {
  const handleEditorChange = ({ text }) => {
    onChange(text);
  };

  return (
    <MdEditor
      style={{ height: '400px' }}
      value={value}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      config={{
        view: {
          menu: true,
          md: true,
          html: false,
        },
        canView: {
          menu: true,
          md: true,
          html: false,
          fullScreen: false,
          hideMenu: false,
        },
      }}
      plugins={[
        'header',
        'font-bold',
        'font-italic',
        'font-underline',
        'list-unordered',
        'list-ordered',
        'block-quote',
        'link',
        'image',
      ]}
    />
  );
}
