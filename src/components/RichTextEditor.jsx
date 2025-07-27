import dynamic from "next/dynamic"
import * as ReactDOM from "react-dom"

// ------- locate the real findDOMNode wherever the bundle put it -------
const realFindDOMNode =
  // CJS / legacy bundles
  (ReactDOM).findDOMNode ??
  // ESM namespace: react-dom.default.findDOMNode
  (ReactDOM).default?.findDOMNode

// Inject the function once so react-quill can call it safely
if (typeof window !== "undefined" && typeof realFindDOMNode === "function") {
  if (!(ReactDOM).findDOMNode) {
    ;(ReactDOM).findDOMNode = realFindDOMNode
  }
  if ((ReactDOM).default && !(ReactDOM).default.findDOMNode) {
    ;(ReactDOM).default.findDOMNode = realFindDOMNode
  }
}

/* Dynamically load react-quill on the client only */
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

/**
 * RichTextEditor – drop-in replacement for ReactQuill that avoids
 * the “findDOMNode is not a function” crash.
 */
export default function RichTextEditor(props) {
  return <ReactQuill {...props} />
}
