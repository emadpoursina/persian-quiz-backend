"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Palette,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Type,
  List,
  ListOrdered,
} from "lucide-react";

export default function WysiwygEditor({
  value,
  onChange,
  placeholder,
  className,
}) {
  const editorRef = useRef < HTMLDivElement > null;
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const savedSelectionRef = (useRef < Range) | (null > null);

  const colors = [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
    "#FFFFFF",
    "#FF0000",
    "#FF6600",
    "#FFCC00",
    "#FFFF00",
    "#99FF00",
    "#00FF00",
    "#00FFCC",
    "#00CCFF",
    "#0066FF",
    "#0000FF",
    "#6600FF",
    "#CC00FF",
    "#FF0099",
    "#FF6699",
    "#FFCCCC",
    "#FFE6CC",
    "#FFFFCC",
    "#E6FFCC",
  ];

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Save current selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, value) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const executeCommandWithSelection = (command, value) => {
    restoreSelection();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleColorPickerOpen = (type) => {
    saveSelection(); // Save selection before opening picker
    if (type === "text") {
      setShowTextColorPicker(!showTextColorPicker);
      setShowBgColorPicker(false);
    } else {
      setShowBgColorPicker(!showBgColorPicker);
      setShowTextColorPicker(false);
    }
  };

  const applyTextColor = (color) => {
    executeCommandWithSelection("foreColor", color);
    setShowTextColorPicker(false);
  };

  const applyBackgroundColor = (color) => {
    executeCommandWithSelection("hiliteColor", color);
    setShowBgColorPicker(false);
  };

  const formatButtons = [
    {
      icon: Bold,
      label: "Bold",
      command: "bold",
    },
    {
      icon: Italic,
      label: "Italic",
      command: "italic",
    },
    {
      icon: Underline,
      label: "Underline",
      command: "underline",
    },
    {
      icon: Type,
      label: "Header",
      command: "formatBlock",
      value: "h3",
    },
    {
      icon: List,
      label: "Bullet List",
      command: "insertUnorderedList",
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      command: "insertOrderedList",
    },
    {
      icon: AlignRight,
      label: "Align Right",
      command: "justifyRight",
    },
    {
      icon: AlignCenter,
      label: "Align Center",
      command: "justifyCenter",
    },
    {
      icon: AlignLeft,
      label: "Align Left",
      command: "justifyLeft",
    },
  ];

  return (
    <div
      className={`border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50 flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Format Buttons */}
          {formatButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              size="sm"
              variant="ghost"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onClick={() => executeCommand(button.command, button.value)}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}

          {/* Text Color */}
          <div className="relative">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onClick={() => handleColorPickerOpen("text")}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </Button>
            {showTextColorPicker && (
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <div className="grid grid-cols-6 gap-2 w-48 mb-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: color }}
                      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                      onClick={() => applyTextColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="text-xs text-gray-600 hover:text-gray-800 w-full text-center"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => {
                    executeCommandWithSelection("removeFormat");
                    setShowTextColorPicker(false);
                  }}
                >
                  حذف قالب‌بندی
                </button>
              </div>
            )}
          </div>

          {/* Background Color */}
          <div className="relative">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onClick={() => handleColorPickerOpen("bg")}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Background Color"
            >
              <div className="w-4 h-4 border-2 border-gray-400 bg-yellow-200 rounded"></div>
            </Button>
            {showBgColorPicker && (
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <div className="grid grid-cols-6 gap-2 w-48 mb-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: color }}
                      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                      onClick={() => applyBackgroundColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="text-xs text-gray-600 hover:text-gray-800 w-full text-center"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => {
                    executeCommandWithSelection("hiliteColor", "transparent");
                    setShowBgColorPicker(false);
                  }}
                >
                  حذف پس‌زمینه
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Font Size */}
        <select
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          onChange={(e) =>
            executeCommandWithSelection("fontSize", e.target.value)
          }
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          defaultValue="3"
        >
          <option value="1">کوچک</option>
          <option value="2">متوسط</option>
          <option value="3">معمولی</option>
          <option value="4">بزرگ</option>
          <option value="5">خیلی بزرگ</option>
        </select>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onMouseUp={saveSelection} // Save selection when user selects text with mouse
        onKeyUp={saveSelection} // Save selection when user moves cursor with keyboard
        className="min-h-[120px] p-3 focus:outline-none prose prose-sm max-w-none"
        style={{
          direction: "rtl",
          fontFamily: "Vazirmatn, sans-serif",
          lineHeight: "1.6",
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      {/* Click outside to close color pickers */}
      {(showTextColorPicker || showBgColorPicker) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowTextColorPicker(false);
            setShowBgColorPicker(false);
          }}
        />
      )}

      {/* Help Text */}
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          نکات: متن را انتخاب کنید و از ابزارهای قالب‌بندی استفاده کنید. رنگ متن
          و پس‌زمینه قابل تغییر است.
        </p>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }

        [contenteditable] h1,
        [contenteditable] h2,
        [contenteditable] h3 {
          font-weight: bold;
          margin: 0.5em 0;
        }

        [contenteditable] h1 {
          font-size: 1.5em;
        }
        [contenteditable] h2 {
          font-size: 1.3em;
        }
        [contenteditable] h3 {
          font-size: 1.1em;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          padding-right: 1.5em;
          padding-left: 0;
          margin: 0.5em 0;
        }

        [contenteditable] li {
          margin: 0.25em 0;
        }

        [contenteditable] strong {
          font-weight: bold;
        }

        [contenteditable] em {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
