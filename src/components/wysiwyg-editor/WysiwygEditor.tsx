/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useConcatenatedMessages } from "../../hooks/useConcatenatedMessages";
import "./wysiwyg-editor.scss";

export interface WysiwygEditorProps {
  filter?: "conversations" | "tools" | "none";
}

export default function WysiwygEditor({ filter = "none" }: WysiwygEditorProps) {
  const concatenatedMessages = useConcatenatedMessages(filter);
  const [value, setValue] = useState("");

  // Update editor content whenever concatenatedMessages changes
  useEffect(() => {
    setValue(concatenatedMessages);
  }, [concatenatedMessages]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  return (
    <div className="wysiwyg-editor">
      <div className="editor-header">
        <h3>Live Content Editor</h3>
        <span className="filter-indicator">Filter: {filter}</span>
      </div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        placeholder="Content from the logger will appear here automatically..."
      />
    </div>
  );
} 