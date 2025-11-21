(require 'llm)
(require 'llm-openai)
(setq my-llm-provider (make-llm-openai :key (getenv "OPENAI_API_KEY")))
;; Чат з LLM прямо з Emacs minibuffer
(defun llm-chat-minibuffer (prompt)
  (interactive "sPrompt to LLM: ")
  (message (llm-chat my-llm-provider prompt)))
