import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Underline, List, ListOrdered, Type } from "lucide-react"

export default function SimpleRichEditor({ value, onChange, placeholder, className }) {
  const [isPreview, setIsPreview] = useState(false)

  const insertTag = (openTag, closeTag) => {
    const textarea = document.getElementById("rich-editor-textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText
    if (selectedText) {
      // Wrap selected text
      newText = value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end)
    } else {
      // Insert tags at cursor position
      newText = value.substring(0, start) + openTag + closeTag + value.substring(end)
    }

    onChange(newText)

    // Set cursor position after the opening tag
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + openTag.length + (selectedText ? selectedText.length + closeTag.length : 0)
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const formatButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertTag("<strong>", "</strong>"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertTag("<em>", "</em>"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertTag("<u>", "</u>"),
    },
    {
      icon: Type,
      label: "Header",
      action: () => insertTag("<h3>", "</h3>"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertTag("<ul><li>", "</li></ul>"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertTag("<ol><li>", "</li></ol>"),
    },
  ]

  return (
    <div
      className={`border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          {formatButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              size="sm"
              variant="ghost"
              onClick={button.action}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={isPreview ? "default" : "ghost"}
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs"
          >
            {isPreview ? "ویرایش" : "پیش‌نمایش"}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="min-h-[120px]">
        {isPreview ? (
          <div
            className="p-3 min-h-[120px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: value || "<p class='text-gray-500'>پیش‌نمایش متن در اینجا نمایش داده می‌شود...</p>",
            }}
          />
        ) : (
          <Textarea
            id="rich-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 resize-none focus:ring-0 min-h-[120px] font-mono text-sm"
            style={{ direction: "rtl" }}
          />
        )}
      </div>

      {/* Help Text */}
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          نکات: متن را انتخاب کنید و روی دکمه‌های قالب‌بندی کلیک کنید. از پیش‌نمایش برای مشاهده نتیجه نهایی استفاده کنید.
        </p>
      </div>
    </div>
  )
}
