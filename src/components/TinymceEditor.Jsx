import { useEffect, useRef } from "react";

export default function TinyMCEEditor({
  value,
  onChange,
  placeholder,
  className,
}) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    // Load TinyMCE script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js";
    script.referrerPolicy = "origin";

    script.onload = () => {
      if (window.tinymce && editorRef.current) {
        window.tinymce.init({
          target: editorRef.current,
          height: 200,
          menubar: false,
          directionality: "rtl",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | bold italic underline | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "link table | code fullscreen | preview help",

          content_style: `
            body { 
              font-family: 'Vazirmatn', Arial, sans-serif; 
              font-size: 14px; 
              direction: rtl; 
              text-align: right;
            }
            p { margin: 0.5em 0; }
            h1, h2, h3, h4, h5, h6 { margin: 0.5em 0; font-weight: bold; }
            ul, ol { padding-right: 1.5em; padding-left: 0; }
          `,

          setup: (editor) => {
            editorInstanceRef.current = editor;

            // Set initial content
            editor.on("init", () => {
              editor.setContent(value || "");
            });

            // Handle content changes
            editor.on("change keyup", () => {
              const content = editor.getContent();
              onChange(content);
            });
          },

          placeholder: placeholder || "متن خود را وارد کنید...",
          skin: "oxide",
          content_css: "default",

          formats: {
            alignleft: {
              selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table",
              styles: { textAlign: "left" },
            },
            aligncenter: {
              selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table",
              styles: { textAlign: "center" },
            },
            alignright: {
              selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table",
              styles: { textAlign: "right" },
            },
            alignjustify: {
              selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table",
              styles: { textAlign: "justify" },
            },
          },

          color_map: [
            "000000",
            "Black",
            "993300",
            "Burnt orange",
            "333300",
            "Dark olive",
            "003300",
            "Dark green",
            "003366",
            "Dark azure",
            "000080",
            "Navy Blue",
            "333399",
            "Indigo",
            "333333",
            "Very dark gray",
            "800000",
            "Maroon",
            "FF6600",
            "Orange",
            "808000",
            "Olive",
            "008000",
            "Green",
            "008080",
            "Teal",
            "0000FF",
            "Blue",
            "666699",
            "Grayish blue",
            "808080",
            "Gray",
            "FF0000",
            "Red",
            "FF9900",
            "Amber",
            "99CC00",
            "Yellow green",
            "339966",
            "Sea green",
            "33CCCC",
            "Turquoise",
            "3366FF",
            "Royal blue",
            "800080",
            "Purple",
            "999999",
            "Medium gray",
            "FF00FF",
            "Magenta",
            "FFCC00",
            "Gold",
            "FFFF00",
            "Yellow",
            "00FF00",
            "Lime",
            "00FFFF",
            "Aqua",
            "00CCFF",
            "Sky blue",
            "993366",
            "Red violet",
            "FFFFFF",
            "White",
            "FF99CC",
            "Pink",
            "FFCC99",
            "Peach",
            "FFFF99",
            "Light yellow",
            "CCFFCC",
            "Light green",
            "CCFFFF",
            "Light cyan",
            "99CCFF",
            "Light blue",
            "CC99FF",
            "Plum",
          ],
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (
      editorInstanceRef.current &&
      value !== editorInstanceRef.current.getContent()
    ) {
      editorInstanceRef.current.setContent(value || "");
    }
  }, [value]);

  return (
    <div className={className}>
      <textarea ref={editorRef} style={{ width: "100%", height: "200px" }} />
    </div>
  );
}
