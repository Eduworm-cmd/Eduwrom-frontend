import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const RichtoolEditor = ({ editorValue, onEditorChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null); 

  useEffect(() => {
    if (!quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ 'color': [] }, { 'background': [] }],
            ['blockquote'],
            ['code-block'],
            ['clean'],
          ],
        },
      });

      // Handle content change
      quillInstance.current.on('text-change', () => {
        onEditorChange(quillInstance.current.root.innerHTML);
      });
    }

    // Set content only if it's not already set
    if (editorValue && quillInstance.current.root.innerHTML !== editorValue) {
      quillInstance.current.root.innerHTML = editorValue;
    }
  }, [editorValue, onEditorChange]);

  return (
    <div>
      <div ref={editorRef} className="border p-4"></div>
    </div>
  );
};

export default RichtoolEditor;
